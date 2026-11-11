import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchMultiple, initOrganization } = vi.hoisted(() => ({
  fetchMultiple: vi.fn(),
  initOrganization: vi.fn(),
}));

vi.mock("@/data/votes", () => ({
  fetchLegacyProposals: () => [{ id: "legacy1" }],
  fetchRealmProposals: (network: string) =>
    network === "iot" ? [{ publicKey: "realm1" }] : [],
}));

vi.mock("@helium/organization-sdk", () => ({
  init: initOrganization,
  organizationKey: () => ["organization"],
  proposalKey: (_organization: string, index: number) => [
    { toBase58: () => `proposal${index}` },
  ],
}));

vi.mock("@helium/proposal-sdk", () => ({
  init: async () => ({ account: { proposalV0: { fetchMultiple } } }),
}));

import sitemap from "../sitemap";

const NUM_PROPOSALS = 150;

const urls = async () => (await sitemap()).map(({ url }) => url);

describe("sitemap", () => {
  beforeEach(() => {
    initOrganization.mockResolvedValue({
      account: {
        organizationV0: {
          fetch: async () => ({ numProposals: NUM_PROPOSALS }),
        },
      },
    });
    // proposal1 repeats the name of proposal0, and proposal2 does not exist.
    fetchMultiple.mockReset();
    fetchMultiple.mockImplementation(async (keys: { toBase58(): string }[]) =>
      keys.map((key) => {
        const index = Number(key.toBase58().replace("proposal", ""));
        if (index === 2) return null;
        return { name: index === 1 ? "proposal0" : key.toBase58() };
      })
    );
  });

  it("lists networks, Legacy, Realm and modular Proposals", async () => {
    const result = await urls();
    expect(result).toEqual(
      expect.arrayContaining([
        "https://heliumvote.com/hnt",
        "https://heliumvote.com/hnt/proposals/legacy/legacy1",
        "https://heliumvote.com/iot/proposals/realm/realm1",
        "https://heliumvote.com/mobile/proposals/proposal149",
      ])
    );
  });

  it("lists a name once, as its newest Proposal, and skips missing Proposals", async () => {
    const result = await urls();
    expect(result).toContain("https://heliumvote.com/hnt/proposals/proposal1");
    expect(result).not.toContain(
      "https://heliumvote.com/hnt/proposals/proposal0"
    );
    expect(result).not.toContain(
      "https://heliumvote.com/hnt/proposals/proposal2"
    );
  });

  it("keeps the static entries when the RPC fails", async () => {
    initOrganization.mockRejectedValue(new Error("rpc down"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(await urls()).toEqual([
      "https://heliumvote.com/hnt",
      "https://heliumvote.com/mobile",
      "https://heliumvote.com/iot",
      "https://heliumvote.com/hnt/proposals/legacy/legacy1",
      "https://heliumvote.com/iot/proposals/realm/realm1",
    ]);
  });
});
