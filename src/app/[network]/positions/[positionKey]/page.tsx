"use client";

import { Header } from "@/components/Header";
import {
  PositionAction,
  PositionManager,
} from "@/components/PositionManager/PositionManager";
import { WalletBoundary } from "@/components/WalletBoundary";
import { useGovernance } from "@/providers/GovernanceProvider";
import { PublicKey } from "@solana/web3.js";
import { redirect } from "next/navigation";
import React, { useMemo } from "react";

export interface PositionsPageParams {
  params: {
    network: string;
    positionKey: string;
  };
  searchParams: { action: PositionAction } | null | undefined;
}

export default function PositionsPage({
  params,
  searchParams,
}: PositionsPageParams) {
  const { positionKey } = params;
  const { action } = searchParams || {};
  const { positions } = useGovernance();
  const positionK = useMemo(() => {
    try {
      return new PublicKey(positionKey);
    } catch {
      redirect(`/${params.network}/positions`);
    }
  }, [positionKey, params.network]);
  const position = useMemo(
    () => positions?.find((p) => p.pubkey.equals(positionK)),
    [positions, positionK]
  );

  return (
    <>
      <Header hideHero={true} route="/$network/positions" />
      <WalletBoundary>
        {position && (
          <PositionManager position={position} initAction={action} />
        )}
      </WalletBoundary>
    </>
  );
}
