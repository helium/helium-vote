import { useProposalStatus } from "@/hooks/useProposalStatus";
import { cn } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import {
  useHeliumVsrState,
  votesForWalletQuery,
} from "@helium/voter-stake-registry-hooks";
import { ProposalWithVotes } from "@helium/voter-stake-registry-sdk";
import { PublicKey } from "@solana/web3.js";
import { useInfiniteQuery } from "@tanstack/react-query";
import BN from "bn.js";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { CountdownTimer } from "./CountdownTimer";
import { Pill } from "./Pill";

export default function VoteHistory({ wallet }: { wallet: PublicKey }) {
  const { voteService } = useHeliumVsrState();
  const {
    data: voteHistoryPages,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    votesForWalletQuery({
      voteService,
      wallet,
      amountPerPage: 20,
    })
  );
  const dedupedVoteHistories = useMemo(() => {
    const seen = new Set();
    return (voteHistoryPages?.pages?.flat() || []).filter((p) => {
      const has = seen.has(p.name);
      seen.add(p.name);
      return !has;
    });
  }, [voteHistoryPages]);

  return (
    <div className="w-full">
      <InfiniteScroll
        dataLength={dedupedVoteHistories.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
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
          {dedupedVoteHistories.map((voteHistory) => {
            return (
              <ProposalItem key={voteHistory.address} proposal={voteHistory} />
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}

const ProposalItem: React.FC<{
  proposal: ProposalWithVotes;
}> = ({ proposal }) => {
  const { completed, timeExpired, endTs, votingResults, isCancelled } =
    useProposalStatus(proposal);
  const { network } = useGovernance();
  // @ts-ignore
  const choices = proposal.state?.resolved?.choices;

  return (
    <Link
      href={`/${network}/proposals/${proposal.address}`}
      className="w-full flex flex-col md:flex-row"
    >
      <div className="flex-1 flex flex-col gap-2 max-md:rounded-t-xl md:rounded-l-xl bg-slate-800 p-4">
        <div className="flex flex-row gap-1">
          {!completed && <Pill variant="success">Actively Voting</Pill>}
          {isCancelled && <Pill variant="warning">Vote Cancelled</Pill>}
        </div>

        <div className="text-white text-xl font-medium">{proposal.name}</div>
        {timeExpired ? (
          <div className="flex flex-col">
            <InfoItem
              name="Completed"
              value={new Date(endTs!.toNumber() * 1000).toLocaleDateString()}
            />
            <InfoItem
              name="Result"
              // @ts-ignore
              value={
                choices
                  ? Object.values(choices)
                      // @ts-ignore
                      .map((c: number) => proposal.choices[c].name)
                      .join(", ")
                  : ""
              }
            />
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
                proposal.votes[0].weight && !votingResults.totalVotes.isZero()
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
              <CountdownTimer endTs={endTs?.toNumber()!} />
            </div>
          </div>
        )}
      </div>
    </Link>
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
