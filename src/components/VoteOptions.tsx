"use client";

import { VoteChoiceWithMeta } from "@/lib/types";
import { useRelinquishVote, useVote } from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import React, { FC, useState } from "react";
import { VoteOption } from "./VoteOption";
import { toast } from "sonner";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { onInstructions } from "@/lib/utils";
import { useAnchorProvider } from "@helium/helium-react-hooks";

export const VoteOptions: FC<{
  choices?: VoteChoiceWithMeta[];
  maxChoicesPerVoter: number;
  proposalKey: PublicKey;
}> = ({ choices = [], maxChoicesPerVoter, proposalKey }) => {
  const [currVote, setCurrVote] = useState(0);
  const { voteWeights, canVote, vote, loading: voting } = useVote(proposalKey);

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
          onInstructions: onInstructions(provider),
        });
        toast("Vote submitted");
      } catch (e: any) {
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
        await relinquishVote({ choice: choice.index });
        toast("Vote relinquished");
      } catch (e: any) {
        if (!(e instanceof WalletSignTransactionError)) {
          setCurrVote(0);
          toast(e.message || "Relinquish vote failed, please try again");
        }
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h5>Voting Options</h5>
      <div className="flex flex-col px-4 py-2 bg-slate-700 rounded-sm">
        <p className="text-sm">
          To vote, click on any option. To remove your vote, click the option
          again.{" "}
        </p>
        <p className="text-sm">
          Vote for up to {maxChoicesPerVoter} of {choices.length} options.
        </p>
      </div>
      {choices.map((r) => (
        <VoteOption
          key={r.name}
          voting={currVote === r.index && (voting || relinquishing)}
          option={r}
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
