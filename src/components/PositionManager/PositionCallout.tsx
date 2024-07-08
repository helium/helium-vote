"use client";

import {
  getMinDurationFmt,
  getPositionVoteMultiplier,
  getTimeLeftFromNowFmt,
  humanReadable,
} from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useSolanaUnixNow } from "@helium/helium-react-hooks";
import { PositionWithMeta } from "@helium/voter-stake-registry-hooks";
import BN from "bn.js";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { FC, useMemo } from "react";
import { FaBolt } from "react-icons/fa6";
import { Pill } from "../Pill";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { PositionAction } from "./PositionManager";

export const PositionCallout: FC<{
  position: PositionWithMeta;
  isClaiming?: boolean;
  isReclaiming?: boolean;
  isProxy?: boolean;
  setManagerAction: (action: PositionAction) => void;
  handleClaimRewards: () => Promise<void>;
}> = ({
  position,
  isClaiming,
  isReclaiming,
  isProxy,
  setManagerAction,
  handleClaimRewards,
}) => {
  const { lockup, hasGenesisMultiplier } = position;
  const { loading: loadingGov, network, mintAcc, subDaos } = useGovernance();
  const unixNow = useSolanaUnixNow() || Date.now() / 1000;
  const lockupKind = Object.keys(lockup.kind)[0] as string;
  const isConstant = lockupKind === "constant";
  const isDecayed = !isConstant && lockup.endTs.lte(new BN(unixNow));
  const elapsedTime = new BN(unixNow).sub(lockup.startTs);
  const totalTime = lockup.endTs.sub(lockup.startTs);
  const decayedPercentage = elapsedTime.muln(100).div(totalTime);
  const canDelegate = network === "hnt";

  const delegatedSubDaoMetadata = position.delegatedSubDao
    ? subDaos?.find((sd) => sd.pubkey.equals(position.delegatedSubDao!))
        ?.dntMetadata
    : null;

  const voteMultiplier = getPositionVoteMultiplier(position);
  const votingPower = isDecayed
    ? "0"
    : humanReadable(position.votingPower, mintAcc?.decimals);

  const lockedTokens =
    mintAcc && humanReadable(position.amountDepositedNative, mintAcc.decimals);

  const isLoading = useMemo(() => loadingGov, [loadingGov]);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-3 min-w-80">
        <div className="flex flex-row justify-between items-center">
          <Skeleton className="size-14 bg-slate-800 rounded-full" />
          <div className="flex flex-col gap-2 flex-grow items-end">
            <Skeleton className="w-6/12 h-5 bg-slate-800 rounded-sm" />
            <Skeleton className="w-2/12 h-5 bg-slate-800 rounded-sm" />
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <Skeleton className="w-full h-10 bg-slate-800 rounded-sm" />
        </div>
        <div className="flex flex-row justify-between gap-2">
          <Skeleton className="w-full h-10 flex-1 bg-slate-800 rounded-sm" />
          <Skeleton className="w-full h-10 flex-1 bg-slate-800 rounded-sm" />
          <Skeleton className="w-full h-10 flex-1 bg-slate-800 rounded-sm" />
        </div>
        <div className="flex flex-row justify-between gap-2">
          <Skeleton className="w-full h-10 flex-1 bg-slate-800 rounded-sm" />
          <Skeleton className="w-full h-10 flex-1 bg-slate-800 rounded-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between items-center">
        <div className="relative size-14">
          <Image alt={`%{network}`} src={`/images/${network}.svg`} fill />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-base font-normal text-right">
            {isConstant
              ? getMinDurationFmt(
                  position.lockup.startTs,
                  position.lockup.endTs
                )
              : getTimeLeftFromNowFmt(position.lockup.endTs)}{" "}
            time left
          </p>
          <div className="flex flex-row justify-end gap-2">
            {isDecayed && <Pill variant="success">100% Decayed</Pill>}
            {isConstant && <Pill variant="info">Paused</Pill>}
            {!isConstant && !isDecayed && (
              <Pill variant="warning">
                {decayedPercentage.toString()}% Decayed
              </Pill>
            )}
            {hasGenesisMultiplier && <Pill variant="purple">Landrush</Pill>}
          </div>
        </div>
      </div>
      <div className="flex flex-row max-md:flex-col justify-between">
        <h5>
          {lockedTokens} for{" "}
          {getMinDurationFmt(position.lockup.startTs, position.lockup.endTs)}
        </h5>
        {delegatedSubDaoMetadata && (
          <div className="flex flex-row items-center gap-2">
            <p className="text-xs text-muted-foreground">DELEGATED TO</p>
            <div className="flex flex-row justify-center items-center gap-2 py-1">
              <div className="relative size-6">
                <Image
                  alt="delegated-subdao"
                  src={delegatedSubDaoMetadata.json?.image}
                  fill
                />
              </div>
              <p>{delegatedSubDaoMetadata.symbol}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row max-md:justify-between gap-4">
        <div className="flex flex-col flex-1">
          <div className="flex flex-row gap-1 text-muted-foreground text-xs max-md:flex-col max-md:gap-0">
            <span>VOTING</span>
            <span>POWER</span>
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="text-base">{votingPower}</p>
            {hasGenesisMultiplier && (
              <Pill variant="purple" className="border-0">
                x3
              </Pill>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex flex-row gap-1 text-muted-foreground text-xs max-md:flex-col max-md:gap-0">
            <span>VOTE</span>
            <span>MULTIPLIER</span>
          </div>
          <p className="text-base">
            {voteMultiplier}
            {voteMultiplier === "0" ? "" : "x"}
          </p>
        </div>
        <div className="flex flex-col flex-1">
          <div className="flex flex-row gap-1 text-muted-foreground text-xs max-md:flex-col max-md:gap-0">
            <span>LOCKUP</span>
            <span>AMOUNT</span>
          </div>
          <p className="text-base">
            {lockedTokens} {network.toUpperCase()}
          </p>
        </div>
      </div>
      {!isProxy && (
        <>
          {!isDecayed ? (
            <div className="flex flex-row justify-between gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setManagerAction("flip")}
              >
                {isConstant ? "Decay Postion" : "Pause Position"}
              </Button>
              {canDelegate && (
                <Button
                  variant="secondary"
                  className="flex-1 gap-2"
                  disabled={!position.hasRewards || isClaiming}
                  onClick={handleClaimRewards}
                >
                  {isClaiming && <Loader2 className="size-5 animate-spin" />}
                  {isClaiming ? "Claiming Rewards..." : "Claim Rewards"}
                </Button>
              )}
            </div>
          ) : (
            <div className="flex flex-row justify-between gap-2">
              <Button
                className="flex-1 text-foreground gap-2"
                disabled={isReclaiming}
                onClick={() => setManagerAction("reclaim")}
              >
                {isReclaiming && <Loader2 className="size-5 animate-spin" />}
                {!isReclaiming && <FaBolt className="size-4" />}
                {isReclaiming ? "Reclaiming Position..." : "Reclaim Position"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
