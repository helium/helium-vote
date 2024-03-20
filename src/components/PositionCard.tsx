"use client";

import {
  getMinDurationFmt,
  getTimeLeftFromNowFmt,
  humanReadable,
} from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useSolanaUnixNow } from "@helium/helium-react-hooks";
import { PositionWithMeta } from "@helium/voter-stake-registry-hooks";
import BN from "bn.js";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC, useMemo } from "react";
import { Pill } from "./Pill";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const PositionCardSkeleton: FC<{ compact?: boolean }> = () => {
  const { network } = useGovernance();
  const canDelegate = network === "hnt";

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="flex flex-grow">
        <div className="flex flex-row justify-between items-center">
          <Skeleton className="size-8 bg-slate-800 rounded-full" />
          <Skeleton className="w-40 h-7 bg-slate-800 rounded-full" />
        </div>
        <Skeleton className="w-full h-7 bg-slate-800 rounded-sm" />
      </CardHeader>
      <CardFooter className="bg-slate-950 flex flex-col p-0">
        <div className="flex flex-row w-full gap-2 justify-between p-4">
          <div className="flex flex-col flex-1 gap-2">
            <Skeleton className="flex w-8/12 h-4 bg-slate-800 rounded-sm" />
            <Skeleton className="flex w-1/2 h-4 bg-slate-800 rounded-sm" />
          </div>
          <div className="flex flex-col flex-1 gap-2  items-end">
            <Skeleton className="flex w-8/12 h-4 bg-slate-800 rounded-sm" />
            <Skeleton className="flex w-1/2 h-4 bg-slate-800 rounded-sm" />
          </div>
        </div>
        {canDelegate && (
          <div className="flex-flex-row w-full p-1">
            <div className="flex flex-row w-full bg-card flex-1 gap-2 p-4 rounded-b-sm">
              <Skeleton className="flex w-8/12 h-4 bg-slate-800 rounded-sm" />
              <Skeleton className="flex w-1/2 h-4 bg-slate-800 rounded-sm" />
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export const PositionCard: FC<{
  position: PositionWithMeta;
  className?: string;
  compact?: boolean;
  onClick?: () => void;
}> = ({ position, className = "", compact = false, onClick }) => {
  const path = usePathname();
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

  const lockedTokens =
    mintAcc && humanReadable(position.amountDepositedNative, mintAcc.decimals);

  const votingPower = isDecayed
    ? "0"
    : humanReadable(position.votingPower, mintAcc?.decimals);

  const delegatedSubDaoMetadata = position.delegatedSubDao
    ? subDaos?.find((sd) => sd.pubkey.equals(position.delegatedSubDao!))
        ?.dntMetadata
    : null;

  const upperNetwork = network.toUpperCase();
  const isLoading = useMemo(() => loadingGov, [loadingGov]);

  if (!compact && isLoading)
    return <PositionCardSkeleton compact={!canDelegate} />;

  if (compact) {
    return (
      <div
        onClick={onClick ? onClick : () => {}}
        className={classNames(
          "flex flex-row gap-2 px-6 py-4 max-md:px-2 max-md:py-2 justiy-center items-center rounded-md",
          !className && "bg-gradient-to-b from-background to-background/30",
          className
        )}
      >
        <div className="size-10 rounded-full relative mr-4 max-md:mr-1">
          <Image alt={`${network} icon`} src={`/images/${network}.svg`} fill />
        </div>
        {isLoading && (
          <div className="flex flex-col flex-1 text-xs gap-1">
            <Skeleton className="w-8/12 h-3 bg-slate-700 rounded-sm" />
            <Skeleton className="w-4/12 h-3 bg-slate-700 rounded-sm" />
          </div>
        )}
        {!isLoading && (
          <div className="flex flex-col flex-1 text-xs">
            <div className="flex flex-row flex-wrap gap-1 font-light">
              <span className="font-medium">
                {lockedTokens} {network.toUpperCase()}
              </span>
              <span>for</span>
              <span className="font-medium">
                {getMinDurationFmt(
                  position.lockup.startTs,
                  position.lockup.endTs
                )}
              </span>
              <span>{isConstant ? "paused" : "decaying"}</span>
              <span>with</span>
              <span className="font-medium">
                {isConstant
                  ? getMinDurationFmt(
                      position.lockup.startTs,
                      position.lockup.endTs
                    )
                  : getTimeLeftFromNowFmt(position.lockup.endTs)}
              </span>
              <span>left</span>
              <span className="hidden max-md:flex">containing</span>
              <span className="hidden max-md:flex font-medium">
                {votingPower} ve{upperNetwork}
              </span>
            </div>
            <div className="flex max-md:hidden flex-row gap-2 font-normal items-center">
              <div className="flex flex-row gap-1 font-light">
                <span>containing</span>
                <span className="font-medium">
                  {votingPower} ve{upperNetwork}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={`${path}/${position.pubkey.toBase58()}`}>
      <Card className="flex flex-col cursor-pointer hover:opacity-80 active:opacity-60 overflow-hidden">
        <CardHeader className="gap-2 space-y-0">
          <div className="flex flex-row justify-between">
            <div className="relative size-8">
              <Image alt={`%{network}`} src={`/images/${network}.svg`} fill />
            </div>
            <div className="flex flex-row gap-1">
              {isDecayed && <Pill variant="success">100% Decayed</Pill>}
              {!isConstant && <Pill variant="info">Paused</Pill>}
              {!isConstant && !isDecayed && (
                <Pill variant="warning">
                  {decayedPercentage.toString()}% Decayed
                </Pill>
              )}
            </div>
          </div>
          <CardTitle className="flex flex-row items-center justify-between">
            <div className="flex flex-wrap gap-2 py-1">
              {lockedTokens} for
              <span className="font-light">
                {getMinDurationFmt(
                  position.lockup.startTs,
                  position.lockup.endTs
                )}
              </span>
            </div>
            {hasGenesisMultiplier && (
              <Pill variant="purple" className="self-start">
                Landrush
              </Pill>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-slate-950 flex flex-row flex-grow justify-between py-4 gap-8">
          <div className="flex flex-col">
            <p className="text-muted-foreground text-xs">VOTING POWER</p>
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm">{votingPower}</p>
              {hasGenesisMultiplier && (
                <Pill variant="purple" className="border-0 px-2 py-0.5">
                  x3
                </Pill>
              )}
            </div>
          </div>
          <div className="flex flex-col flex-grow max-md:items-end">
            <p className="text-muted-foreground text-xs">TIME LEFT</p>
            <p className="text-sm">
              {isConstant
                ? getMinDurationFmt(
                    position.lockup.startTs,
                    position.lockup.endTs
                  )
                : getTimeLeftFromNowFmt(position.lockup.endTs)}
            </p>
          </div>
        </CardContent>
        {canDelegate && (
          <CardFooter className="flex flex-row flex-grow justify-between gap-2 py-2 border-4 border-slate-950 rounded-b-md min-h-14">
            <p className="text-muted-foreground text-xs">DELEGATED TO</p>
            {!isDecayed && delegatedSubDaoMetadata ? (
              <div className="flex flex-row justify-center items-center gap-2 py-1">
                <div className="relative size-6">
                  <Image
                    alt="delegated-subdao"
                    src={delegatedSubDaoMetadata.json?.image}
                    fill
                  />
                </div>
                <p className="text-xs">{delegatedSubDaoMetadata.symbol}</p>
              </div>
            ) : !isDecayed ? (
              <Link
                href={`${path}/${position.pubkey.toBase58()}?action=delegate`}
              >
                <Button variant="default" size="xs" className="text-foreground">
                  Delegate Now
                </Button>
              </Link>
            ) : (
              <p className="text-xs">UNDELEGATED</p>
            )}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
};
