"use client";

import { useGovernance } from "@/providers/GovernanceProvider";
import React, { FC, useMemo } from "react";
import { Button } from "./ui/button";
import { FaStar, FaCircleArrowRight } from "react-icons/fa6";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import BN from "bn.js";
import { useClaimAllPositionsRewards } from "@helium/voter-stake-registry-hooks";
import { PositionCard, PositionCardSkeleton } from "./PositionCard";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { CreatePositionButton } from "./CreatePositionButton";
import { onInstructions } from "@/lib/utils";
import {
  useAnchorProvider,
  useSolanaUnixNow,
} from "@helium/helium-react-hooks";
import { ContentSection } from "./ContentSection";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import { useRouter } from "next/navigation";
import { AssignProxyModal } from "./AssignProxyModal";
import { ProxyButton } from "./ProxyButton";
import { useAssignProxies } from "@helium/voter-stake-registry-hooks";

export const Positions: FC = () => {
  const provider = useAnchorProvider();
  const { connecting } = useWallet();
  const {
    loading: loadingGov,
    positions,
    refetch: refetchState,
    network,
  } = useGovernance();
  const isHNT = network === "hnt";
  const router = useRouter();

  const sortedPositions = useMemo(
    () =>
      loadingGov
        ? []
        : positions?.sort((a, b) => {
            if (a.hasGenesisMultiplier || b.hasGenesisMultiplier) {
              if (b.hasGenesisMultiplier) {
                return a.amountDepositedNative.gt(b.amountDepositedNative)
                  ? -1
                  : 1;
              }
              return 0;
            }

            if (a.isDelegated || b.isDelegated) {
              if (a.isDelegated && !b.isDelegated) return -1;
              if (b.isDelegated && !a.isDelegated) return 1;

              return a.amountDepositedNative.gt(b.amountDepositedNative)
                ? -1
                : 1;
            }

            return a.amountDepositedNative.gt(b.amountDepositedNative) ? -1 : 1;
          }),
    [positions, loadingGov]
  );

  const proxiedPositions = useMemo(
    () => sortedPositions?.filter((p) => p.isProxiedToMe),
    [sortedPositions]
  );
  const unProxiedPositions = useMemo(
    () => sortedPositions?.filter((p) => !p.isProxiedToMe),
    [sortedPositions]
  );
  const decayedPositions = useMemo(
    () =>
      unProxiedPositions
        ?.filter((p) => p.lockup.kind.cliff)
        .filter((p) => p.lockup.endTs.lte(new BN(Date.now() / 1000))),
    [unProxiedPositions]
  );

  const notDecayedPositions = useMemo(
    () =>
      unProxiedPositions?.filter(
        (p) =>
          p.lockup.kind.constant || p.lockup.endTs.gt(new BN(Date.now() / 1000))
      ),
    [unProxiedPositions]
  );

  const positionsWithRewards = useMemo(
    () => unProxiedPositions?.filter((p) => p.hasRewards),
    [unProxiedPositions]
  );

  const { loading: claimingAllRewards, claimAllPositionsRewards } =
    useClaimAllPositionsRewards();

  const { mutateAsync: assignProxies } = useAssignProxies();

  const handleClaimRewards = async () => {
    if (positionsWithRewards) {
      try {
        await claimAllPositionsRewards({
          positions: positionsWithRewards,
          onInstructions: onInstructions(provider, {
            useFirstEstimateForAll: true,
            maxInstructionsPerTx: 8,
          }),
        });

        toast("Rewards claimed!");
        refetchState();
      } catch (e: any) {
        console.error(e);
        if (!(e instanceof WalletSignTransactionError)) {
          toast(e.message || "Claiming rewards failed, please try again");
        }
      }
    }
  };

  const hasRewards = positionsWithRewards && positionsWithRewards?.length > 0;
  const isLoading = useMemo(
    () => !connecting && loadingGov,
    [connecting, loadingGov]
  );

  const unexpiredPositions = useMemo(
    () =>
      positions?.filter(
        (p) =>
          (p.lockup.kind.constant ||
            p.lockup.endTs.gt(new BN(Date.now() / 1000))) &&
          !p.isProxiedToMe,
      ),
    [positions],
  );

  if (isLoading) {
    return (
      <ContentSection className="flex-1 py-8">
        <section className="flex flex-col h-full gap-4">
          <h4>All Positions</h4>
          <Card className="h-full bg-card/45 border border-slate-900">
            <CardHeader className="flex flex-grow rounded-t-md bg-card border-b border-slate-900">
              <div className="flex flex-row">
                <Skeleton className="w-3/12 h-5 bg-slate-800" />
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 py-4">
              {[...Array(5)].map((_, i) => (
                <PositionCardSkeleton key={`placeholder-${i}`} />
              ))}
            </CardContent>
          </Card>
        </section>
      </ContentSection>
    );
  }

  return (
    <ContentSection className="flex-1 py-4">
      <section className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between md:items-center">
          <h4>All Positions</h4>
          <div className="flex max-md:flex-col gap-2">
            <CreatePositionButton showText disabled={!isHNT} />
            {network === "hnt" && (
              <>
                {Array.isArray(sortedPositions) &&
                  sortedPositions.length > 0 && (
                    <AssignProxyModal
                      includeProxied
                      onSubmit={async (args) => {
                        await assignProxies({
                          ...args,
                          onInstructions: onInstructions(provider, {
                            useFirstEstimateForAll: true,
                          }),
                        });
                        refetchState();
                      }}
                    >
                      <ProxyButton includeProxied size="sm">Proxy All</ProxyButton>
                    </AssignProxyModal>
                  )}
                <Button
                  variant="secondary"
                  className="text-foreground flex flex-row gap-2 items-center"
                  disabled={!unexpiredPositions?.length}
                  onClick={() =>
                    router.push(`/${network}/positions/delegate-all`)
                  }
                >
                  <FaCircleArrowRight className="size-4" />
                  Delegate All
                </Button>
                <Button
                  variant="default"
                  className="text-foreground flex flex-row gap-2 items-center"
                  disabled={!hasRewards || claimingAllRewards}
                  onClick={handleClaimRewards}
                >
                  {claimingAllRewards ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <FaStar className="size-4" />
                  )}
                  {claimingAllRewards ? "Claiming Rewards..." : "Claim Rewards"}
                </Button>
              </>
            )}
          </div>
        </div>
        {!notDecayedPositions?.length && !decayedPositions?.length && (
          <Card className="flex flex-col flex-1 p-8">
            <div className="flex flex-col flex-grow items-center justify-center gap-4">
              <div className="flex flex-col items-center">
                {isHNT && (
                  <>
                    <h4 className="text-xl text-muted-foreground">
                      No positions
                    </h4>
                    <p className="text-sm text-center text-muted-foreground">
                      You have no active positions, create one to participate in
                      voting
                    </p>
                  </>
                )}
                {!isHNT && (
                  <>
                    <p className="text-sm text-center text-muted-foreground">
                      As of January 30th 2025, only new HNT positions can be
                      created
                    </p>
                  </>
                )}
              </div>
              <CreatePositionButton className="m-0" disabled={!isHNT} />
            </div>
          </Card>
        )}
        {decayedPositions && decayedPositions.length > 0 && (
          <Card className="flex flex-col flex-grow bg-card/45 overflow-hidden border border-slate-900">
            <CardHeader className="flex flex-row justify-between items-center bg-card border-b border-slate-900">
              <CardTitle>Decayed</CardTitle>
              {/* TODO: add hooks to do this */}
              {/* <button className="flex flex-row items-center">
                  <FaBolt className="size-4 mr-2" />
                  Reclaim All
                </button> */}
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 py-4">
              {decayedPositions.map((position) => (
                <PositionCard
                  key={position.pubkey.toBase58()}
                  position={position}
                />
              ))}
            </CardContent>
          </Card>
        )}
        {notDecayedPositions && notDecayedPositions.length > 0 && (
          <Card className="flex flex-col flex-grow bg-card/45 overflow-hidden border border-slate-900">
            <CardHeader className="flex flex-row justify-between items-center bg-card border-b border-slate-900">
              <CardTitle>Not Decayed</CardTitle>
              {/* TODO: add hooks to do this */}
              {/* <div className="flex flex-row gap-4">
                  <button className="flex flex-row items-center">
                    <FaBolt className="size-4 mr-2" />
                    Pause All
                  </button>
                  <button className="flex flex-row items-center">
                    <FaBolt className="size-4 mr-2" />
                    Decay All
                  </button>
                </div> */}
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 py-4">
              {notDecayedPositions.map((position) => (
                <PositionCard
                  key={position.pubkey.toBase58()}
                  position={position}
                />
              ))}
            </CardContent>
          </Card>
        )}
        {proxiedPositions && proxiedPositions.length > 0 && (
          <Card className="flex flex-col flex-grow bg-card/45 overflow-hidden border border-slate-900">
            <CardHeader className="flex flex-row justify-between items-center bg-card border-b border-slate-900">
              <CardTitle>Proxied to Me</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 py-4">
              {proxiedPositions.map((position) => (
                <PositionCard
                  canDelegate={false}
                  key={position.pubkey.toBase58()}
                  position={position}
                />
              ))}
            </CardContent>
          </Card>
        )}
      </section>
    </ContentSection>
  );
};
