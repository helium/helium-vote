"use client";

import { VoteChoiceWithMeta } from "@/lib/types";
import { cn, ellipsisMiddle } from "@/lib/utils";
import BN from "bn.js";
import React, { FC } from "react";
import { FaCircle, FaCircleCheck } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { useKnownProxy } from "@/hooks/useKnownProxy";
import { Pill } from "./Pill";

export const VoteOption: FC<{
  option: VoteChoiceWithMeta;
  myWeight?: BN;
  canVote: boolean;
  voters: PublicKey[];
  canRelinquishVote: boolean;
  voting: boolean;
  className?: string;
  onVote?: () => Promise<void>;
  onRelinquishVote?: () => Promise<void>;
}> = ({
  option,
  myWeight,
  voters,
  canVote,
  canRelinquishVote,
  voting,
  onVote,
  onRelinquishVote,
  className = "",
}) => (
  <div
    onClick={
      canVote ? onVote : canRelinquishVote ? onRelinquishVote : undefined
    }
    className={cn(
      "flex flex-col gap-2 px-4 rounded-sm bg-slate-500 border-2 border-background cursor-pointer hover:bg-slate-500/80 active:bg-slate-500/60",
      voting && "bg-primary/15 border-primary hover:bg-inherit",
      myWeight && "bg-slate-500/25 border-slate-500",
      className,
      voters.length > 0 ? "pt-4 pb-2" : "py-6"
    )}
  >
    <div className="flex flex-row gap-2  items-center">
      {voting ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <FaCircle
          className={cn("size-5 border rounded-full", {
            "fill-vote-0": option.index === 0,
            "fill-vote-1": option.index === 1,
            "fill-vote-2": option.index === 2,
            "fill-vote-3": option.index === 3,
            "fill-vote-4": option.index === 4,
            "fill-vote-5": option.index === 5,
            "fill-vote-6": option.index === 6,
            "fill-vote-7": option.index === 7,
            "fill-vote-8": option.index === 8,
            "fill-vote-9": option.index === 9,
            "fill-vote-10": option.index === 10,
            "fill-vote-11": option.index === 11,
            "fill-vote-12": option.index === 12,
            "fill-vote-13": option.index === 13,
          })}
        />
      )}
      <p className="font-normal flex-grow">{option.name}</p>
      {myWeight && <FaCircleCheck className="size-5 fill-success-foreground" />}
    </div>

    { voters.length > 0 && <div className="flex flex-wrap flex-row items-center gap-2">
      <div className="text-right text-white text-xs leading-none">Voted by</div>
      {voters.map((v) => (
        <Voter key={v.toBase58()} voter={v} />
      ))}
    </div> }
  </div>
);

const Voter: FC<{ voter: PublicKey }> = ({ voter }) => {
  const { knownProxy } = useKnownProxy(voter);
  return (
    <Pill variant="blue" className="rounded text-xs">
      {knownProxy?.name || ellipsisMiddle(voter.toBase58())}
    </Pill>
  );
};

