"use client";

import {
  ellipsisMiddle,
  getMinDurationFmt,
  getTimeLeftFromNowFmt,
  humanReadable,
} from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useSolanaUnixNow } from "@helium/helium-react-hooks";
import {
  PositionWithMeta,
  useKnownProxy,
} from "@helium/voter-stake-registry-hooks";
import BN from "bn.js";
import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC, useMemo } from "react";
import { Pill } from "./Pill";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { PublicKey } from "@solana/web3.js";

export const PositionCardSkeleton: FC<{ compact?: boolean }> = () => {
  const { network } = useGovernance();
  const canDelegate = network === "hnt";

  return (
    <Card className="flex max-md:flex-col overflow-hidden">
      <CardHeader className="gap-2 space-y-0 w-3/12 max-md:w-full">
        <div className="flex flex-row justify-between items-center">
          <Skeleton className="size-8 bg-slate-800 rounded-full" />
          <Skeleton className="w-40 h-7 bg-slate-800 rounded-full" />
        </div>
        <Skeleton className="w-full h-7 bg-slate-800 rounded-sm" />
      </CardHeader>
      <CardContent className="bg-slate-950 flex flex-grow p-4 items-center max-md:flex-col max-md:items-start max-md:p-0">
        <div className="flex flex-row w-full gap-2 max-md:justify-between p-4">
          <div className="flex flex-col flex-1 gap-2">
            <Skeleton className="flex w-8/12 h-4 bg-slate-800 rounded-sm" />
            <Skeleton className="flex w-1/2 h-4 bg-slate-800 rounded-sm" />
          </div>
          <div className="flex flex-col flex-1 gap-2 max-md:items-end">
            <Skeleton className="flex w-8/12 h-4 bg-slate-800 rounded-sm" />
            <Skeleton className="flex w-1/2 h-4 bg-slate-800 rounded-sm" />
          </div>
        </div>
        {canDelegate && (
          <div className="flex-flex-row w-full p-1">
            <div className="flex flex-row w-full max-md:bg-card flex-1 gap-2 p-4 rounded-b-sm">
              <Skeleton className="flex w-8/12 h-4 bg-slate-800 rounded-sm" />
              <Skeleton className="flex w-1/2 h-4 bg-slate-800 rounded-sm" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const PositionCard: FC<{
  position: PositionWithMeta;
  className?: string;
  compact?: boolean;
  onClick?: () => void;
  canDelegate?: boolean;
}> = ({
  canDelegate: canDelegateIn = true,
  position,
  className = "",
  compact = false,
  onClick,
}) => {
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
  const canDelegate = canDelegateIn && network === "hnt";
  const { knownProxy } = useKnownProxy(position?.proxy?.nextVoter);

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

  const renderTags = () => (
    <div className="flex flex-row gap-1">
      {hasGenesisMultiplier && (
        <Pill variant="purple" className="self-start">
          Landrush
        </Pill>
      )}
      {isDecayed && (
        <Pill variant="success">
          100%{" "}
          <span className="flex sm:flex md:hidden lg:flex">&nbsp;Decayed</span>
        </Pill>
      )}
      {isConstant && <Pill variant="info">Paused</Pill>}
      {!isConstant && !isDecayed && (
        <Pill variant="warning">
          {decayedPercentage.toString()}%
          <span className="flex sm:flex md:hidden lg:flex">&nbsp;Decayed</span>
        </Pill>
      )}
    </div>
  );

  return (
    <Link
      href={`${path}/${position.pubkey.toBase58()}${
        position.isProxiedToMe ? "?action=proxy" : ""
      }`}
    >
      <Card className="flex cursor-pointer hover:opacity-80 active:opacity-60 overflow-hidden max-md:flex-col">
        <CardHeader className="gap-2 space-y-0 w-3/12 max-md:w-full">
          <div className="flex flex-row flex-1 gap-4">
            <div className="flex flex-shrink-0 relative size-6">
              <Image alt={`%{network}`} src={`/images/${network}.svg`} fill />
            </div>
            <CardTitle className="flex flex-col gap-1">
              {`${lockedTokens} ${network.toUpperCase()}`}{" "}
              <span className="font-light text-sm text-white/70">
                {getMinDurationFmt(
                  position.lockup.startTs,
                  position.lockup.endTs
                )}
              </span>
            </CardTitle>
          </div>
          <div className="hidden max-md:flex">{renderTags()}</div>
        </CardHeader>
        <CardContent className="bg-slate-950 flex flex-grow p-4 max-md:flex-col max-md:items-start max-md:p-0">
          <div className="flex w-6/12 lg:w-4/12 max-md:w-full max-md:p-4">
            <div className="flex flex-col w-6/12 gap-2">
              <p className="text-muted-foreground text-xs">VOTING POWER</p>
              <div className="flex flex-row gap-1 relative">
                <p className="text-sm">{votingPower}</p>
                {hasGenesisMultiplier && (
                  <Pill variant="purple" className="absolute">
                    x3
                  </Pill>
                )}
              </div>
            </div>
            <div className="flex flex-col w-6/12 gap-2 max-md:items-end">
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
          </div>
          <hr className="hidden max-md:flex h-0.5 w-full bg-slate-600" />
          <div
            className={classNames(
              "flex flex-col w-3/12 lg:w-2/12 max-md:p-4 max-md:w-full max-md:flex-row max-md:items-center max-md:justify-between",
              !position.proxy ? "gap-1" : "gap-1.5"
            )}
          >
            <p className="text-muted-foreground text-xs">PROXIED TO</p>
            {position.proxy &&
            !position.proxy.nextVoter.equals(PublicKey.default) ? (
              <Link
                href={`/${network}/proxies/${position.proxy.nextVoter.toBase58()}`}
              >
                <Pill variant="pink" className="hover:bg-pink/70">
                  {knownProxy?.name ||
                    ellipsisMiddle(position.proxy.nextVoter.toBase58())}
                </Pill>
              </Link>
            ) : (
              <Link href={`${path}/${position.pubkey.toBase58()}?action=proxy`}>
                <Button
                  variant="secondary"
                  size="xxs"
                  className="text-foreground"
                >
                  Proxy Now
                </Button>
              </Link>
            )}
          </div>
          {canDelegate && (
            <div
              className={classNames(
                "flex flex-col w-3/12 lg:w-2/12 max-md:w-full max-md:flex-row max-md:items-center max-md:justify-between max-md:bg-slate-850 max-md:p-4 max-md:border-4 max-md:border-slate-950 max-md:rounded-b-md",
                !delegatedSubDaoMetadata ? "gap-1" : "gap-2"
              )}
            >
              <p className="text-muted-foreground text-xs">DELEGATED TO</p>
              {!isDecayed && delegatedSubDaoMetadata ? (
                <div className="flex flex-row items-center gap-2">
                  <div className="relative size-5">
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
                  <Button
                    variant="secondary"
                    size="xxs"
                    className="text-foreground"
                  >
                    Delegate Now
                  </Button>
                </Link>
              ) : (
                <p className="text-sm">Undelegated</p>
              )}
            </div>
          )}
          <div className="flex max-md:hidden flex-col flex-grow items-end">
            {renderTags()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
