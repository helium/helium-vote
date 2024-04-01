import React, { FC } from "react";
import classNames from "classnames";
import { humanReadable } from "@/lib/utils";
import BN from "bn.js";

export const VoteResults: FC<{
  results?: { index: number; percent: number; name: string; weight: BN }[];
  decimals?: number;
}> = ({ results = [], decimals = 0 }) => (
  <div className="flex flex-col gap-2">
    <h5>Vote Results</h5>
    {results
      ?.sort((a, b) => b.percent - a.percent)
      .map((r) => (
        <div key={r.index} className="flex flex-col gap-1">
          <p className="font-normal">{r.name}</p>
          <div className="flex flex-row rounded-full items-center w-full h-3 overflow-hidden bg-background">
            <div
              style={{ width: `calc(${r.percent}% + 5px)` }}
              className={classNames("h-3 flex", {
                "bg-vote-0": r.index === 0,
                "bg-vote-1": r.index === 1,
                "bg-vote-2": r.index === 2,
                "bg-vote-3": r.index === 3,
                "bg-vote-4": r.index === 4,
                "bg-vote-5": r.index === 5,
                "bg-vote-6": r.index === 6,
                "bg-vote-7": r.index === 7,
                "bg-vote-8": r.index === 8,
                "bg-vote-9": r.index === 9,
                "bg-vote-10": r.index === 10,
                "bg-vote-11": r.index === 11,
                "bg-vote-12": r.index === 12,
                "bg-vote-13": r.index === 13,
              })}
            />
          </div>
          <div className="flex flex-row items-center justify-between">
            <p className="text-muted-foreground">
              {humanReadable(r.weight, decimals) || "None"}
            </p>
            <p className="font-normal">{r.percent.toFixed(2)}%</p>
          </div>
        </div>
      ))}
  </div>
);
