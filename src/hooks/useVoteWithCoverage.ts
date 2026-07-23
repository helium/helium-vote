"use client";

import { VoteChoiceWithMeta } from "@/lib/types";
import {
  SkippedPosition,
  isAllPositionsSkippedError,
  readSkipped,
  readSkippedFromError,
} from "@/lib/governanceContract";
import { partitionSkips, runCoverageVerification } from "@/lib/voteCoverage";
import { fetchVoteMarkerChoices } from "@/utils/fetchVoteMarkers";
import { useVoteMutation } from "@/hooks/useGovernanceMutations";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// Let the confirmed on-chain state settle before reading markers.
const MARKER_SETTLE_MS = 2000;

// The component supplies this to gate on a pre-vote max-choices warning:
// resolves true to proceed, false to cancel.
export type ConfirmMaxChoices = (
  skipped: SkippedPosition[]
) => Promise<boolean>;

const reportAllSkipped = (skipped: SkippedPosition[]) => {
  const { maxChoices, alreadyVoted } = partitionSkips(skipped);
  if (maxChoices.length > 0) {
    toast(
      `${maxChoices.length} of your positions cannot support this candidate — they already used all their choices.`
    );
  } else if (alreadyVoted.length > 0) {
    toast("You've already voted for this option with these positions.");
  }
};

export const useVoteWithCoverage = ({
  proposalKey,
  positionMints,
}: {
  proposalKey: PublicKey;
  positionMints: string[];
}) => {
  const voteMutation = useVoteMutation();
  const { connection } = useConnection();
  const [votingChoice, setVotingChoice] = useState<number | null>(null);

  const castVote = useCallback(
    async function cast(
      choice: VoteChoiceWithMeta,
      confirmMaxChoices: ConfirmMaxChoices
    ): Promise<void> {
      const params = {
        proposalKey: proposalKey.toBase58(),
        positionMints,
        choice: choice.index,
      };
      setVotingChoice(choice.index);
      try {
        // 1. Build the vote — the skip report rides along on the response.
        let initialSkipped: SkippedPosition[];
        try {
          const prepared = await voteMutation.prepare(params);
          initialSkipped = readSkipped(prepared);
        } catch (e) {
          if (isAllPositionsSkippedError(e)) {
            reportAllSkipped(readSkippedFromError(e));
            return;
          }
          throw e;
        }

        // 2. Warn before submitting if any position hit its choice cap.
        const { maxChoices } = partitionSkips(initialSkipped);
        if (maxChoices.length > 0) {
          const proceed = await confirmMaxChoices(maxChoices);
          if (!proceed) return;
        }

        // 3. Submit (re-builds server-side; safe after the dialog delay).
        try {
          await voteMutation.submit(params, {
            header: "Cast Vote",
            message: `Voting for ${choice.name}`,
          });
        } catch (e) {
          if (isAllPositionsSkippedError(e)) {
            reportAllSkipped(readSkippedFromError(e));
            return;
          }
          if (e instanceof WalletSignTransactionError) return;
          toast((e as Error)?.message || "Vote failed, please try again");
          return;
        }

        // 4. Verify on-chain coverage with at most one transparent retry.
        const verifying = toast.loading("Verifying your vote on-chain…");
        try {
          await new Promise((r) => setTimeout(r, MARKER_SETTLE_MS));
          const result = await runCoverageVerification({
            positionMints,
            choice: choice.index,
            fetchMarkers: (mints) =>
              fetchVoteMarkerChoices(connection, proposalKey, mints),
            resubmit: async () => {
              try {
                const prepared = await voteMutation.prepare(params);
                await voteMutation.submit(params, {
                  header: "Cast Vote",
                  message: `Voting for ${choice.name}`,
                });
                return readSkipped(prepared);
              } catch (e) {
                if (isAllPositionsSkippedError(e)) {
                  return readSkippedFromError(e);
                }
                throw e;
              }
            },
            initialSkipped,
          });
          toast.dismiss(verifying);

          if (result.covered) {
            toast("Vote submitted");
          } else {
            toast(
              `${result.uncoveredMints.length} of ${result.expectedCount} positions didn't register this vote`,
              {
                action: {
                  label: "Retry",
                  onClick: () => {
                    cast(choice, confirmMaxChoices);
                  },
                },
              }
            );
          }
        } finally {
          toast.dismiss(verifying);
        }
      } finally {
        setVotingChoice(null);
      }
    },
    [proposalKey, positionMints, voteMutation, connection]
  );

  return { castVote, votingChoice };
};
