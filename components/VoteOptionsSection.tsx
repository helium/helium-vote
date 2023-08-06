import {
  useHeliumVsrState,
  useRelinquishVote,
  useVote,
} from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import { useNotifyError } from "../hooks/useNotifyError";
import VoteOption, { Outcome } from "./VoteOption";
import { ProvidedVotingPowerBox } from "./VotingPowerBox";
import { useState } from "react";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import { useWallet } from "@solana/wallet-adapter-react";
import { BsLink45Deg } from "react-icons/bs";

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
  const { connected } = useWallet();

  const { amountLocked, loading } = useHeliumVsrState();
  const noVotingPower = !loading && (!amountLocked || amountLocked.isZero());

  useNotifyError(voteErr, "Failed to vote");
  useNotifyError(relErr, "Failed to relinquish vote");

  return (
    <div className="w-full bg-hv-gray-750 py-5 sm:py-10 mt-10 sm:mt-20">
      <div className="flex flex-col space-y-2 max-w-5xl mx-auto px-0 sm:px-10">
        <div>
          <div className="ml-4 sm:ml-0 pb-4 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-xl tracking-tight sm:text-3xl font-semibold text-white font-sans">
              Vote Options
            </p>
            <Link
              href="/staking"
              className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              <div className="flex flex-row items-center space-x-2">
                <FiSettings />
                <ProvidedVotingPowerBox className="text-white align-right" />
              </div>
            </Link>
          </div>

          <div className="w-full">
            {!connected && (
              <div className="text-white flex flex-col items-center justify-center">
                <BsLink45Deg className="h-6 mb-1 text-primary-light w-6" />
                <span className="text-fgd-1 text-sm">Connect your wallet</span>
              </div>
            )}
            {connected && noVotingPower && (
              <Link
                href="/staking"
                className="text-white flex flex-col items-center justify-center"
              >
                <FiSettings className="h-6 mb-1 text-primary-light w-6" />
                <span className="text-fgd-1 text-sm">
                  No voting power. Click here to manage voting power.
                </span>
              </Link>
            )}

            {connected && !noVotingPower &&
              outcomes?.map((o, i, { length }) => (
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
      </div>
    </div>
  );
};

export default VoteOptionsSection;
