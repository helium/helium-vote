import { describe, expect, it } from "vitest";
import {
  resolveDelegationEpochCounts,
  unissuedRewardsMessage,
  type DelegationEpochCountsByMint,
} from "@/lib/delegationEpochCounts";

const counts = (
  entries: Record<
    string,
    {
      claimableEpochCount: number;
      requiredUnclaimedEpochCount: number;
      unissuedRequiredEpochCount: number;
    }
  >,
): DelegationEpochCountsByMint => new Map(Object.entries(entries));

describe("resolveDelegationEpochCounts", () => {
  it("reports the api counts for a delegated position", () => {
    const resolved = resolveDelegationEpochCounts(
      counts({
        mint1: {
          claimableEpochCount: 3,
          requiredUnclaimedEpochCount: 5,
          unissuedRequiredEpochCount: 2,
        },
      }),
      "mint1",
      false,
    );

    expect(resolved).toEqual({
      hasRewards: true,
      requiredUnclaimedEpochCount: 5,
      unissuedRequiredEpochCount: 2,
    });
  });

  it("reports no rewards when the api has a claim-free position", () => {
    const resolved = resolveDelegationEpochCounts(counts({}), "mint1", true);

    expect(resolved).toEqual({
      hasRewards: false,
      requiredUnclaimedEpochCount: 0,
      unissuedRequiredEpochCount: 0,
    });
  });

  it("blocks on a required epoch whose rewards are not claimable yet", () => {
    const resolved = resolveDelegationEpochCounts(
      counts({
        mint1: {
          claimableEpochCount: 0,
          requiredUnclaimedEpochCount: 1,
          unissuedRequiredEpochCount: 1,
        },
      }),
      "mint1",
      false,
    );

    expect(resolved.hasRewards).toBe(false);
    expect(resolved.requiredUnclaimedEpochCount).toBe(1);
  });

  it("falls back to the position's own flag without api data", () => {
    expect(resolveDelegationEpochCounts(undefined, "mint1", true)).toEqual({
      hasRewards: true,
      requiredUnclaimedEpochCount: 1,
      unissuedRequiredEpochCount: 0,
    });
    expect(resolveDelegationEpochCounts(undefined, "mint1", false)).toEqual({
      hasRewards: false,
      requiredUnclaimedEpochCount: 0,
      unissuedRequiredEpochCount: 0,
    });
  });
});

describe("unissuedRewardsMessage", () => {
  it("says epoch for a single unissued epoch", () => {
    expect(unissuedRewardsMessage(1)).toBe(
      "Rewards for 1 epoch on this delegation haven't been issued yet. Undelegating claims them first, so try again once they're issued.",
    );
  });

  it("says epochs for several unissued epochs", () => {
    expect(unissuedRewardsMessage(3)).toBe(
      "Rewards for 3 epochs on this delegation haven't been issued yet. Undelegating claims them first, so try again once they're issued.",
    );
  });
});
