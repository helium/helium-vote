import { useProposalStatus } from "@/hooks/useProposalStatus";
import { cn } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { ProposalWithVotes } from "@helium/voter-stake-registry-sdk";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { CountdownTimer } from "./CountdownTimer";
import { toNumber } from "@helium/spl-utils";
import { Pill } from "./Pill";
import { Loader2 } from "lucide-react";

export default function VoteHistory({ wallet }: { wallet: PublicKey }) {
  const { voteService, mint } = useGovernance();
  const [voteHistories, setVoteHistory] = useState<ProposalWithVotes[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchMoreData = async (page: number) => {
    setPage(page);
    if (voteService) {
      const newVoteHistory = await voteService.getVotesForWallet({
        wallet: wallet,
        page: page,
        limit: 100,
      });
      if (newVoteHistory.length < 100) {
        setHasMore(false);
      }
      setVoteHistory((prevVoteHistory) => [
        ...prevVoteHistory,
        ...newVoteHistory,
      ]);
    }
  };

  useEffect(() => {
    if (voteService) {
      setHasMore(true);
      setVoteHistory([]);
      fetchMoreData(1);
    }
  }, [voteService]);

  return (
    <div className="w-full">
      <InfiniteScroll
        dataLength={voteHistories.length}
        next={() => {
          setPage(page + 1);
          fetchMoreData(page + 1);
        }}
        hasMore={hasMore}
        loader={
          <div className="p-4 flex flex-row justify-center">
            <Loader2 className="size-5 animate-spin" />
          </div>
        }
        endMessage={
          <p className="mt-3 text-white/opacity-75 text-sm text-center">
            You&apos;ve reached the end of the list
          </p>
        }
      >
        <div className="flex flex-col gap-2">
          {voteHistories.map((voteHistory, index) => {
            return <ProposalItem key={index} proposal={voteHistory} />;
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}

const ProposalItem: React.FC<{
  proposal: ProposalWithVotes;
}> = ({ proposal }) => {
  const {
    completed,
    timeExpired,
    endTs,
    votingResults,
    isActive,
    isFailed,
    isCancelled,
  } = useProposalStatus(proposal);

  return (
    <div className="w-full flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col gap-2 max-md:rounded-t-xl md:rounded-l-xl bg-slate-800 p-4">
        <div className="flex flex-row gap-1">
          {!completed && <Pill variant="success">Actively Voting</Pill>}
          {isActive && completed && (
            <Pill variant="warning">Voting Closed</Pill>
          )}
          {isCancelled && <Pill variant="warning">Vote Cancelled</Pill>}
        </div>

        <div className="text-white text-xl font-medium">
          HIP 37: H3Dex-based PoC Targeting
        </div>
        {timeExpired ? (
          <div className="flex flex-col">
            <InfoItem
              name="Completed"
              value={new Date(endTs.toNumber() * 1000).toLocaleDateString()}
            />
            <InfoItem name="Result" value="Chicken" />
          </div>
        ) : null}
      </div>
      <div className="flex-1 max-md:rounded-b-xl md:rounded-r-xl bg-slate-850 p-4">
        {proposal.votes[0].weight ? (
          <div className="flex flex-row gap-2">
            <InfoItem
              className="flex-1 flex-col items-start"
              name="Voted"
              value={proposal.votes.map((v) => v.choiceName).join(", ")}
            />
            <InfoItem
              className="flex-1 flex-col items-start"
              name="Percent of Vote"
              value={
                // Calc with 4 decimals precision
                proposal.votes[0].weight
                  ? (
                      new BN(proposal.votes[0].weight)
                        .mul(new BN(10000))
                        .div(votingResults.totalVotes)
                        .toNumber() / 100
                    ).toString() + "%"
                  : ""
              }
            />
          </div>
        ) : (
          <Pill variant="warning" className="rounded-none mb-3">
            Not Voted
          </Pill>
        )}
        {!timeExpired && (
          <div className="flex flex-col">
            <div className={"flex flex-row items-center gap-2"}>
              <div className="uppercase text-slate-500 text-xs font-medium leading-none">
                Est. Time Remaining
              </div>
              <CountdownTimer endTs={endTs} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem: React.FC<{
  name: string;
  value: React.ReactElement | string;
  className?: string;
}> = ({ name, value, className }) => {
  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      <div className="uppercase text-slate-500 text-xs font-medium leading-none">
        {name}
      </div>
      <div className="text-white font-medium">{value}</div>
    </div>
  );
};
