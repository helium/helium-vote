"use client";

import { VoteChoiceWithMeta } from "@/lib/types";
import { useGovernance } from "@/providers/GovernanceProvider";
import {
  useRelinquishVote,
  useVote,
} from "@helium/voter-stake-registry-hooks";
import {
  useRelinquishVoteMutation,
  useAssignProxiesMutation,
} from "@/hooks/useGovernanceMutations";
import {
  useVoteWithCoverage,
  type ConfirmMaxChoices,
} from "@/hooks/useVoteWithCoverage";
import { SkippedPosition } from "@/lib/governanceContract";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { PublicKey } from "@solana/web3.js";
import { FC, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { AssignProxyModal } from "./AssignProxyModal";
import { ProxyButton } from "./ProxyButton";
import { VoteOption } from "./VoteOption";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export const VoteOptions: FC<{
  choices?: VoteChoiceWithMeta[];
  maxChoicesPerVoter: number;
  proposalKey: PublicKey;
}> = ({ choices = [], maxChoicesPerVoter, proposalKey }) => {
  const [currVote, setCurrVote] = useState(0);
  const {
    didVote,
    canVote,
    loading: voting,
    voters,
  } = useVote(proposalKey);

  const { positions } = useGovernance();

  const unproxiedPositions = useMemo(
    () =>
      positions?.filter(
        (p) => !p.proxy || p.proxy.nextVoter.equals(PublicKey.default)
      ),
    [positions]
  );
  const canProxy = !!unproxiedPositions?.length;

  const positionMints = useMemo(
    () => positions?.map((p) => p.mint.toBase58()) || [],
    [positions]
  );

  const {
    canRelinquishVote,
    loading: relinquishing,
  } = useRelinquishVote(proposalKey);

  const relinquishVoteMutation = useRelinquishVoteMutation();
  const assignProxiesMutation = useAssignProxiesMutation();
  const { castVote, votingChoice } = useVoteWithCoverage({
    proposalKey,
    positionMints,
  });

  // Bridges the pre-vote max-choices warning dialog to the async vote flow:
  // the flow awaits `resolve`, which the dialog buttons call.
  const [warning, setWarning] = useState<{
    count: number;
    resolve: (proceed: boolean) => void;
  } | null>(null);

  const confirmMaxChoices = useCallback<ConfirmMaxChoices>(
    (skipped: SkippedPosition[]) =>
      new Promise<boolean>((resolve) =>
        setWarning({ count: skipped.length, resolve })
      ),
    []
  );

  const resolveWarning = (proceed: boolean) => {
    warning?.resolve(proceed);
    setWarning(null);
  };

  const handleVote = (choice: VoteChoiceWithMeta) => async () => {
    if (canVote(choice.index)) {
      await castVote(choice, confirmMaxChoices);
    }
  };

  const handleRelinquish = (choice: VoteChoiceWithMeta) => async () => {
    if (canRelinquishVote(choice.index)) {
      try {
        setCurrVote(choice.index);
        await relinquishVoteMutation.submit(
          {
            proposalKey: proposalKey.toBase58(),
            positionMints,
            choice: choice.index,
          },
          {
            header: "Relinquish Vote",
            message: `Relinquishing vote for ${choice.name}`,
          }
        );
        toast("Vote relinquished");
      } catch (e: any) {
        console.error(e);
        if (!(e instanceof WalletSignTransactionError)) {
          setCurrVote(0);
          toast(e.message || "Relinquish vote failed, please try again");
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <h5>Voting Options</h5>
        <p className="text-xs text-muted-foreground">
          (Vote for up to {maxChoicesPerVoter} of {choices.length} options)
        </p>
      </div>
      <div className="flex flex-col p-4 bg-gray-700 rounded-sm gap-2">
        <p className="text-sm">
          Vote by clicking on an option below. Click again to remove your vote.
        </p>
        {canProxy && (
          <>
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-slate-500"></div>
              <span className="flex-shrink mx-4 text-sm font-semibold text-slate-500">
                OR
              </span>
              <div className="flex-grow border-t border-slate-500"></div>
            </div>
            <p className="text-sm">
              Assign proxy to a trusted voter if you don&rsquo;t want to vote.
              You can override any active votes anytime - your vote takes
              precedence over a proxy.
            </p>
            <AssignProxyModal
              onSubmit={async (args) => {
                await assignProxiesMutation.submit(
                  {
                    proxyKey: args.recipient.toBase58(),
                    positionMints: args.positions.map((p) =>
                      p.mint.toBase58()
                    ),
                    expirationTime: args.expirationTime.toNumber(),
                  },
                  {
                    header: "Assign Proxy",
                    message: "Assigning proxy voter",
                  }
                );
              }}
            >
              <ProxyButton />
            </AssignProxyModal>
          </>
        )}
      </div>
      {choices.map((r, index) => (
        <VoteOption
          key={r.name}
          voting={
            votingChoice === r.index ||
            (currVote === r.index &&
              (voting || relinquishing || relinquishVoteMutation.isPending))
          }
          option={r}
          voters={voters?.[r.index] || []}
          didVote={didVote?.[r.index]}
          canVote={canVote(r.index)}
          canRelinquishVote={canRelinquishVote(r.index)}
          onVote={handleVote(r)}
          onRelinquishVote={handleRelinquish(r)}
        />
      ))}
      <Dialog
        open={!!warning}
        onOpenChange={(open) => {
          if (!open) resolveWarning(false);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Some positions can&rsquo;t vote</DialogTitle>
            <DialogDescription>
              {warning?.count} of your positions already used all their choices
              and cannot support this candidate. The rest of your positions will
              still vote.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => resolveWarning(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 text-white"
              onClick={() => resolveWarning(true)}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
