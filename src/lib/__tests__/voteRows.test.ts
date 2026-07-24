import { describe, expect, it } from "vitest";
import { VoteRowInput, groupVoteRows } from "@/lib/voteRows";

const row = (over: Partial<VoteRowInput> = {}): VoteRowInput => ({
  voter: "w1",
  choiceName: "A",
  weight: "100",
  proxyName: "",
  ...over,
});

describe("groupVoteRows", () => {
  it("takes the max weight across a wallet's per-choice rows instead of summing", () => {
    const grouped = groupVoteRows(
      [
        row({ choiceName: "A", weight: "100" }),
        row({ choiceName: "B", weight: "100" }),
      ],
      0,
    );
    expect(grouped).toHaveLength(1);
    expect(grouped[0].choices).toEqual(["A", "B"]);
    expect(grouped[0].totalWeight.toString()).toBe("100");
  });

  it("dedupes casting proxies by wallet across a voter's rows", () => {
    const proxy = { wallet: "px", name: "Proxy" };
    const grouped = groupVoteRows(
      [
        row({ choiceName: "A", castingProxies: [proxy] }),
        row({ choiceName: "B", castingProxies: [proxy] }),
      ],
      0,
    );
    expect(grouped[0].castingProxies).toEqual([proxy]);
  });

  it("sorts voters by weight descending", () => {
    const grouped = groupVoteRows(
      [
        row({ voter: "small", weight: "1" }),
        row({ voter: "big", weight: "9" }),
      ],
      0,
    );
    expect(grouped.map((g) => g.voter)).toEqual(["big", "small"]);
  });
});
