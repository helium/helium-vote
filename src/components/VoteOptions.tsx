"use client";

import { VoteChoiceWithMeta } from "@/lib/types";
import { onInstructions } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useAnchorProvider } from "@helium/helium-react-hooks";
import {
  useAssignProxies,
  useRelinquishVote,
  useVote,
} from "@helium/voter-stake-registry-hooks";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { PublicKey } from "@solana/web3.js";
import { FC, useMemo, useState } from "react";
import { toast } from "sonner";
import { AssignProxyModal } from "./AssignProxyModal";
import { ProxyButton } from "./ProxyButton";
import { VoteOption } from "./VoteOption";

export const VoteOptions: FC<{
  choices?: VoteChoiceWithMeta[];
  maxChoicesPerVoter: number;
  proposalKey: PublicKey;
}> = ({ choices = [], maxChoicesPerVoter, proposalKey }) => {
  const [currVote, setCurrVote] = useState(0);
  const {
    voteWeights,
    canVote,
    vote,
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

  const {
    canRelinquishVote,
    relinquishVote,
    loading: relinquishing,
  } = useRelinquishVote(proposalKey);
  const provider = useAnchorProvider();

  const handleVote = (choice: VoteChoiceWithMeta) => async () => {
    if (canVote(choice.index) && provider) {
      try {
        setCurrVote(choice.index);
        await vote({
          choice: choice.index,
          onInstructions: onInstructions(provider, {
            useFirstEstimateForAll: true,
          }),
        });
        toast("Vote submitted");
      } catch (e: any) {
        console.error(e)
        if (!(e instanceof WalletSignTransactionError)) {
          setCurrVote(0);
          toast(e.message || "Vote failed, please try again");
        }
      }
    }
  };

  const handleRelinquish = (choice: VoteChoiceWithMeta) => async () => {
    if (canRelinquishVote(choice.index)) {
      try {
        setCurrVote(choice.index);
        await relinquishVote({
          choice: choice.index,
          onInstructions: onInstructions(provider, {
            useFirstEstimateForAll: true,
          }),
        });
        toast("Vote relinquished");
      } catch (e: any) {
        console.error(e)
        if (!(e instanceof WalletSignTransactionError)) {
          setCurrVote(0);
          toast(e.message || "Relinquish vote failed, please try again");
        }
      }
    }
  };

  const { mutateAsync: assignProxies } = useAssignProxies();

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
              onSubmit={(args) => {
                return assignProxies({
                  ...args,
                  onInstructions: onInstructions(provider, {
                    useFirstEstimateForAll: true,
                  }),
                });
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
          voting={currVote === r.index && (voting || relinquishing)}
          option={r}
          voters={voters?.[index] || []}
          myWeight={voteWeights?.[r.index]}
          canVote={canVote(r.index)}
          canRelinquishVote={canRelinquishVote(r.index)}
          onVote={handleVote(r)}
          onRelinquishVote={handleRelinquish(r)}
        />
      ))}
    </div>
  );
};
