import { PublicKey } from "@solana/web3.js";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/utils", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/utils")>()),
  getProposalContent: async () => ({
    content: "",
    name: "HIP 1",
    network: "mobile",
  }),
}));

import { SITE_URL } from "@/lib/routes.mjs";
import { generateMetadata } from "../[network]/proposals/[proposalKey]/page";

describe("ProposalPage generateMetadata", () => {
  it("uses the Network that owns the Proposal in the canonical url", async () => {
    const proposalKey = PublicKey.default.toBase58();
    const tags = await generateMetadata({
      params: { network: "hnt", proposalKey },
    });
    expect(tags.alternates?.canonical).toBe(
      `${SITE_URL}/mobile/proposals/${proposalKey}`
    );
  });
});
