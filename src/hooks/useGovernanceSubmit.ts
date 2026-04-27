import type { TransactionData, TokenAmountOutput } from "@helium/blockchain-api";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useWallet } from "./useWallet";
import { useBlockchainApi } from "@/providers/BlockchainApiProvider";
import { signTransactionData } from "@/utils/transactionUtils";

type BatchStatus = "pending" | "confirmed" | "failed" | "expired" | "partial";

const TERMINAL_STATUSES: BatchStatus[] = [
  "confirmed",
  "failed",
  "expired",
  "partial",
];

type SubmittableResponse = {
  transactionData: TransactionData;
  estimatedSolFee?: TokenAmountOutput;
  hasMore?: boolean;
};

export interface GovernanceSubmitOptions {
  header: string;
  message: string;
  tag?: string;
}

async function pollForCompletion(
  client: ReturnType<typeof useBlockchainApi>,
  batchId: string,
  pollIntervalMs = 2000,
  maxPollTime = 60000
): Promise<{ status: BatchStatus; signatures: string[] }> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxPollTime) {
    const result = await client.transactions.get({
      id: batchId,
      commitment: "confirmed",
    });

    const status = result.status as BatchStatus;

    if (TERMINAL_STATUSES.includes(status)) {
      return {
        status,
        signatures: result.transactions?.map((t) => t.signature) ?? [],
      };
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error("Transaction polling timeout");
}

export function useGovernanceSubmit(): {
  submit: (
    response: SubmittableResponse,
    options: GovernanceSubmitOptions,
    fetchMore?: () => Promise<SubmittableResponse>
  ) => Promise<{ signatures: string[] }>;
} {
  const wallet = useWallet();
  const client = useBlockchainApi();
  const queryClient = useQueryClient();

  const submit = useCallback(
    async (
      response: SubmittableResponse,
      options: GovernanceSubmitOptions,
      fetchMore?: () => Promise<SubmittableResponse>
    ): Promise<{ signatures: string[] }> => {
      if (!wallet.signAllTransactions) {
        throw new Error("Wallet does not support signing transactions");
      }

      const allSignatures: string[] = [];
      let current = response;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { transactionData } = current;

        if (transactionData.transactions.length === 0) {
          break;
        }

        const signed = await signTransactionData(
          { signAllTransactions: wallet.signAllTransactions },
          transactionData
        );

        const tag = options.tag || "governance";
        const taggedData = { ...signed, tag };

        const { batchId } = await client.transactions.submit(taggedData);
        queryClient.invalidateQueries({
          queryKey: ["pendingTransactions"],
        });

        const { status, signatures } = await pollForCompletion(
          client,
          batchId
        );

        if (status === "failed" || status === "partial") {
          throw new Error("Transaction failed");
        }

        if (status === "expired") {
          throw new Error("Transaction expired");
        }

        allSignatures.push(...signatures);

        if (!current.hasMore || !fetchMore) {
          break;
        }

        current = await fetchMore();
      }

      return { signatures: allSignatures };
    },
    [wallet, client, queryClient]
  );

  return { submit };
}
