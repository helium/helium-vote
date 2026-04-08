import { VersionedTransaction, Transaction } from "@solana/web3.js";
import type { TransactionData } from "@helium/blockchain-api";
import { createHash } from "crypto";

interface WalletSigner {
  signAllTransactions: <T extends Transaction | VersionedTransaction>(
    txs: T[]
  ) => Promise<T[]>;
}

// Sign all transactions in a TransactionData object
export async function signTransactionData(
  wallet: WalletSigner,
  transactionData: TransactionData
): Promise<TransactionData> {
  const signedTransactions = await wallet.signAllTransactions(
    transactionData.transactions.map(({ serializedTransaction }) =>
      VersionedTransaction.deserialize(
        Buffer.from(serializedTransaction, "base64")
      )
    )
  );

  return {
    ...transactionData,
    transactions: signedTransactions.map((tx, i) => ({
      serializedTransaction: Buffer.from(tx.serialize()).toString("base64"),
      metadata: transactionData.transactions[i].metadata,
    })),
  };
}

/**
 * Creates a short hash from action parameters for use in transaction tags
 * @param params Object with string/number values to hash
 * @returns Short hex hash (first 12 characters of sha256)
 */
export function hashTagParams(
  params: Record<string, string | number | undefined>
): string {
  const paramsString = Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join(",");
  return createHash("sha256").update(paramsString).digest("hex").slice(0, 12);
}
