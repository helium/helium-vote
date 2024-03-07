"use client";

import { VoteChoiceWithMeta } from "@/lib/types";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useRelinquishVote, useVote } from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import React, { FC, useState } from "react";
import { VoteOption } from "./VoteOption";
import { toast } from "sonner";

export const VoteOptions: FC<{
  choices?: VoteChoiceWithMeta[];
  maxChoicesPerVoter: number;
  proposalKey: PublicKey;
}> = ({ choices = [], maxChoicesPerVoter, proposalKey }) => {
  const [currVote, setCurrVote] = useState(0);
  const {} = useGovernance();

  const {
    voteWeights,
    canVote,
    vote,
    loading: voting,
    error: voteErr,
  } = useVote(proposalKey);

  const {
    canRelinquishVote,
    relinquishVote,
    loading: relinquishing,
    error: relErr,
  } = useRelinquishVote(proposalKey);

  const handleVote = (choice: VoteChoiceWithMeta) => async () => {
    if (canVote(choice.index)) {
      setCurrVote(choice.index);
      await vote({ choice: choice.index }).then(() => toast("Vote submitted"));
    }
  };

  const handleRelinquish = (choice: VoteChoiceWithMeta) => async () => {
    if (canRelinquishVote(choice.index)) {
      setCurrVote(choice.index);
      await relinquishVote({ choice: choice.index }).then(() =>
        toast("Vote relinquished")
      );
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
