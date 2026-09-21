export type DelegationEpochCounts = {
  // The blockchain API would build a claim right now, so a claim button never
  // opens a no-op.
  hasRewards: boolean;
  // Unclaimed epochs undelegating must claim first, issued or not.
  requiredUnclaimedEpochCount: number;
  // The subset of those whose rewards are not issued yet; undelegate is
  // rejected while this is non-zero, so the user has to wait rather than claim.
  unissuedRequiredEpochCount: number;
};

export type DelegationEpochCountsByMint = Map<
  string,
  {
    claimableEpochCount: number;
    requiredUnclaimedEpochCount: number;
    unissuedRequiredEpochCount: number;
  }
>;

export const resolveDelegationEpochCounts = (
  countsByMint: DelegationEpochCountsByMint | undefined,
  positionMint: string,
  // PositionWithMeta.hasRewards, a local bitmap scan that ignores rewards
  // issuance.
  fallbackHasRewards: boolean,
): DelegationEpochCounts => {
  // Without API counts (query failed or still loading), keep the local bitmap
  // gating: it blocks more than the chain does, which is the safe direction.
  if (!countsByMint) {
    return {
      hasRewards: fallbackHasRewards,
      requiredUnclaimedEpochCount: fallbackHasRewards ? 1 : 0,
      unissuedRequiredEpochCount: 0,
    };
  }

  const counts = countsByMint.get(positionMint);

  return {
    hasRewards: (counts?.claimableEpochCount ?? 0) > 0,
    requiredUnclaimedEpochCount: counts?.requiredUnclaimedEpochCount ?? 0,
    unissuedRequiredEpochCount: counts?.unissuedRequiredEpochCount ?? 0,
  };
};

export const unissuedRewardsMessage = (unissuedEpochCount: number) =>
  `Rewards for ${unissuedEpochCount} ${
    unissuedEpochCount === 1 ? "epoch" : "epochs"
  } on this delegation haven't been issued yet. Undelegating claims them first, so try again once they're issued.`;
