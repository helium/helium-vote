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
import { sleep } from "@helium/spl-utils";
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
  skipped: SkippedPosition[],
) => Promise<boolean>;

const reportAllSkipped = (skipped: SkippedPosition[]) => {
  const { maxChoices, alreadyVoted } = partitionSkips(skipped);
  if (maxChoices.length > 0) {
    toast(
      `${maxChoices.length} of your positions cannot support this candidate — they already used all their choices.`,
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
      confirmMaxChoices: ConfirmMaxChoices,
    ): Promise<void> {
      const params = {
        proposalKey: proposalKey.toBase58(),
        positionMints,
        choice: choice.index,
      };
      const submitOptions = {
        header: "Cast Vote",
        message: `Voting for ${choice.name}`,
      };

      // Submit the vote — building it fresh unless a prepared response is
      // supplied — and return its skip report. One build per call.
      const submitVote = async (
        prepared?: Awaited<ReturnType<typeof voteMutation.prepare>>,
      ): Promise<SkippedPosition[]> => {
        const built = prepared ?? (await voteMutation.prepare(params));
        await voteMutation.submit(params, submitOptions, built);
        return readSkipped(built);
      };

      setVotingChoice(choice.index);
      try {
        // 1. Build the vote — the skip report rides along on the response.
        let prepared: Awaited<ReturnType<typeof voteMutation.prepare>>;
        let initialSkipped: SkippedPosition[];
        try {
          prepared = await voteMutation.prepare(params);
          initialSkipped = readSkipped(prepared);
        } catch (e) {
          if (!isAllPositionsSkippedError(e)) throw e;
          reportAllSkipped(readSkippedFromError(e));
          return;
        }

        // 2. Warn before submitting if any position hit its choice cap. If the
        //    dialog was shown the blockhash may have gone stale, so drop the
        //    prepared build and let submit rebuild.
        const { maxChoices } = partitionSkips(initialSkipped);
        let reusable: typeof prepared | undefined = prepared;
        if (maxChoices.length > 0) {
          const proceed = await confirmMaxChoices(maxChoices);
          if (!proceed) return;
          reusable = undefined;
        }

        // 3. Submit. A user cancel or all-positions-skipped short-circuits, but
        //    any other failure (including a partial batch landing) falls through
        //    to coverage verification — the markers are ground truth.
        try {
          // A rebuild after the dialog may skip newly-capped positions, so
          // take the submit's skip report over the stale prepare's.
          initialSkipped = await submitVote(reusable);
        } catch (e) {
          if (e instanceof WalletSignTransactionError) return;
          if (isAllPositionsSkippedError(e)) {
            reportAllSkipped(readSkippedFromError(e));
            return;
          }
        }

        // 4. Verify on-chain coverage with at most one transparent retry.
        const verifying = toast.loading("Verifying your vote on-chain…");
        try {
          const result = await runCoverageVerification({
            positionMints,
            choice: choice.index,
            fetchMarkers: async (mints) => {
              await sleep(MARKER_SETTLE_MS);
              return fetchVoteMarkerChoices(connection, proposalKey, mints);
            },
            resubmit: async () => {
              try {
                return await submitVote();
              } catch (e) {
                // A cancelled or partially-failed retry still ends in the final
                // marker diff — report ground truth, not a generic error.
                if (isAllPositionsSkippedError(e)) {
                  return readSkippedFromError(e);
                }
                return undefined;
              }
            },
            initialSkipped,
          });

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
              },
            );
          }
        } catch (e) {
          console.error(e);
          toast(
            "Couldn't verify your vote on-chain. Refresh to confirm it registered.",
          );
        } finally {
          toast.dismiss(verifying);
        }
      } catch (e: any) {
        console.error(e);
        if (!(e instanceof WalletSignTransactionError)) {
          toast(e.message || "Vote failed, please try again");
        }
      } finally {
        setVotingChoice(null);
      }
    },
    [proposalKey, positionMints, voteMutation, connection],
  );

  return { castVote, votingChoice };
};
