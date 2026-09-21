"use client";

import {
  resolveDelegationEpochCounts,
  type DelegationEpochCounts,
  type DelegationEpochCountsByMint,
} from "@/lib/delegationEpochCounts";
import { useBlockchainApi } from "@/providers/BlockchainApiProvider";
import { PositionWithMeta } from "@helium/voter-stake-registry-hooks";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useWallet } from "./useWallet";

export const delegationEpochCountsKey = (wallet?: string) => [
  "delegationEpochCounts",
  wallet,
];

// The blockchain API builds claim and undelegate from the same helper that
// produces these counts, so gating the UI on them can't disagree with the
// build.
export const useDelegationEpochCounts = () => {
  const client = useBlockchainApi();
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58();

  const { data } = useQuery<DelegationEpochCountsByMint>({
    queryKey: delegationEpochCountsKey(wallet),
    enabled: !!wallet,
    queryFn: async () => {
      const positions = await client.governance.getPositions({
        wallet: wallet!,
      });

      return new Map(
        positions.flatMap((p) =>
          p.delegation
            ? [
                [
                  p.positionMint,
                  {
                    claimableEpochCount: p.delegation.claimableEpochCount,
                    requiredUnclaimedEpochCount:
                      p.delegation.requiredUnclaimedEpochCount,
                    unissuedRequiredEpochCount:
                      p.delegation.unissuedRequiredEpochCount,
                  },
                ] as const,
              ]
            : [],
        ),
      );
    },
  });

  return useCallback(
    (position: PositionWithMeta): DelegationEpochCounts =>
      resolveDelegationEpochCounts(
        data,
        position.mint.toBase58(),
        position.hasRewards,
      ),
    [data],
  );
};

export const usePositionEpochCounts = (
  position: PositionWithMeta,
): DelegationEpochCounts => useDelegationEpochCounts()(position);
