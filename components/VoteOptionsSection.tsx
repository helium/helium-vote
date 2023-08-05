import { useRelinquishVote, useVote } from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import { useNotifyError } from "../hooks/useNotifyError";
import VoteOption, { Outcome } from "./VoteOption";
import { ProvidedVotingPowerBox } from "./VotingPowerBox";
import { useState } from "react";

const VoteOptionsSection: React.FC<{
  outcomes: Outcome[];
  proposalKey: PublicKey;
}> = ({ outcomes, proposalKey }) => {
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
  const [currVote, setCurrVote] = useState(0);

  useNotifyError(voteErr, "Failed to vote");
  useNotifyError(relErr, "Failed to relinquish vote");

  return (
    <div className="w-full bg-hv-gray-750 py-5 sm:py-10 mt-10 sm:mt-20">
      <div className="flex flex-col space-y-2 max-w-5xl mx-auto px-0 sm:px-10">
        <div>
          <p className="text-xl ml-4 sm:ml-0 mb-3 tracking-tight sm:text-3xl font-semibold text-white font-sans pb-4">
            Vote Options
          </p>
          <div className="w-full">
            {outcomes?.map((o, i, { length }) => (
              <VoteOption
                voting={currVote == o.index && (voting || relinquishing)}
                index={o.index}
                length={length}
                key={o.name}
                outcome={o}
                myWeight={voteWeights?.[o.index]}
                canVote={canVote(o.index)}
                canRelinquishVote={canRelinquishVote(o.index)}
                onVote={
                  canVote(o.index)
                    ? () => {
                        setCurrVote(o.index);
                        vote({ choice: o.index });
                      }
                    : undefined
                }
                onRelinquishVote={
                  canRelinquishVote(o.index)
                    ? () => {
                        setCurrVote(o.index);
                        relinquishVote({ choice: o.index });
                      }
                    : undefined
                }
              />
            ))}
          </div>
        </div>
        <ProvidedVotingPowerBox className="text-white align-right" />
      </div>
    </div>
  );
};

export default VoteOptionsSection;
