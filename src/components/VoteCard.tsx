"use client";

import { ProposalState } from "@/lib/types";
import { getTimeFromNowFmt, humanReadable } from "@/lib/utils";
import BN from "bn.js";
import classNames from "classnames";
import Link from "next/link";
import React, { FC } from "react";
import { CountdownTimer } from "./CountdownTimer";
import { Pill } from "./Pill";
import { Badge } from "./ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { toNumber } from "@helium/spl-utils";

export const VoteCardSkeleton: FC = () => (
  <Card className="flex flex-col overflow-hidden">
    <CardHeader className="flex flex-grow">
      <div className="flex flex-row mb-1 gap-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="w-20 h-7 bg-slate-800 rounded-sm" />
        ))}
      </div>
      <Skeleton className="w-full h-7 bg-slate-800 rounded-sm" />
      <Skeleton className="w-full h-4 bg-slate-800 rounded-sm" />
      <Skeleton className="w-1/2 h-4 bg-slate-800 rounded-sm" />
    </CardHeader>
    <CardFooter className="bg-slate-950 flex flex-row justify-between py-4">
      <div className="flex flex-col flex-1 gap-2">
        <Skeleton className="flex w-8/12 h-4 bg-slate-800 rounded-sm" />
        <Skeleton className="flex w-1/2 h-4 bg-slate-800 rounded-sm" />
      </div>
      <div className="flex flex-col flex-1 gap-2 items-end">
        <Skeleton className="flex w-8/12 h-4 bg-slate-800 rounded-sm" />
        <Skeleton className="flex w-1/2 h-4 bg-slate-800 rounded-sm" />
      </div>
    </CardFooter>
  </Card>
);

export const VoteCard: FC<{
  href: string;
  tags: string[];
  name: string;
  description?: string;
  results: { index: number; percent: number }[];
  finalResult: string;
  endTs: number;
  totalVotes: number | BN;
  decimals?: number;
  state: ProposalState;
  isLegacy?: boolean;
}> = ({
  href,
  tags,
  name,
  description = "No description provided.",
  results,
  finalResult,
  endTs,
  decimals,
  totalVotes,
  state,
  isLegacy = false,
}) => {
  const timeExpired = endTs && endTs <= Date.now().valueOf() / 1000;
  const isCancelled = state === "cancelled";
  const isActive = !isCancelled && state === "active";
  const isFailed = !isCancelled && state === "failed";
  const metMinimumVotes = toNumber(totalVotes, decimals || 0) >= 100000000;
  const completed =
    timeExpired || (timeExpired && isActive) || isCancelled || isFailed;

  return (
    <Link href={href} className="flex flex-grow">
      <Card className="flex flex-col flex-grow overflow-hidden cursor-pointer hover:opacity-80 active:opacity-70">
        <CardHeader className="flex flex-grow">
          <div className="flex flex-row justify-between mb-2">
            <div className="flex flex-row gap-1">
              {tags
                .filter((tag) => tag !== "tags")
                .map((tag, i) => (
                  <Badge
                    key={tag}
                    className={classNames(
                      "mr-1 rounded-[4px]",
                      { "bg-foreground": i === 0 },
                      {
                        "bg-transparent border-background text-foreground":
                          i > 0,
                      }
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
            {!completed && <Pill variant="success">Actively Voting</Pill>}
            {isActive && completed && (
              <Pill variant="warning">Voting Closed</Pill>
            )}
            {isCancelled && <Pill variant="warning">Vote Cancelled</Pill>}
            {isFailed && !isLegacy && !metMinimumVotes && (
              <Pill variant="warning">Quorum Miss</Pill>
            )}
          </div>
          <CardTitle className="line-clamp-1">{name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="bg-slate-950 flex flex-row justify-between py-4">
          {!completed ? (
            <div className="flex flex-row flex-grow justify-between">
              <div className="flex flex-col">
                <p className="text-muted-foreground text-xs">
                  EST. TIME REMAINING
                </p>
                <div className="text-sm">
                  <CountdownTimer endTs={endTs} />
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-muted-foreground text-xs">VOTES</p>
                <p className="text-base">
                  {humanReadable(new BN(totalVotes), decimals) || "None"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col flex-grow gap-2">
              <div className="flex flex-row rounded-full w-full h-2 overflow-hidden">
                {results.map((result, idx) => (
                  <div
                    key={result.index}
                    style={{ width: `calc(${result.percent}% + 5px)` }}
                    className={classNames(
                      "h-2 flex",
                      idx !== results.length - 1 &&
                        "border-r-[1px] border-card-background/20",
                      {
                        "bg-vote-0": result.index === 0,
                        "bg-vote-1": result.index === 1,
                        "bg-vote-2": result.index === 2,
                        "bg-vote-3": result.index === 3,
                        "bg-vote-4": result.index === 4,
                        "bg-vote-5": result.index === 5,
                        "bg-vote-6": result.index === 6,
                        "bg-vote-7": result.index === 7,
                        "bg-vote-8": result.index === 8,
                        "bg-vote-9": result.index === 9,
                        "bg-vote-10": result.index === 10,
                        "bg-vote-11": result.index === 11,
                        "bg-vote-12": result.index === 12,
                        "bg-vote-13": result.index === 13,
                      }
                    )}
                  />
                ))}
              </div>
              <div className="flex flex-row justify-between">
                {!isCancelled && (
                  <div className="flex flex-col">
                    <p className="text-muted-foreground text-xs tracking-tighter">
                      COMPLETED
                    </p>
                    <p className="text-sm">
                      {getTimeFromNowFmt(new BN(endTs))}
                    </p>
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="text-muted-foreground text-xs tracking-tighter">
                    FINAL VOTES
                  </p>
                  <p className="text-sm">
                    {humanReadable(new BN(totalVotes), decimals || 0) || "None"}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-muted-foreground text-xs tracking-tighter">
                    RESULT
                  </p>
                  <p className="text-sm capitalize">
                    {isActive && completed ? "Pending" : finalResult}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};
