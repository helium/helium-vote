import { describe, expect, it, vi } from "vitest";

vi.mock("next/config", async () => {
  const { default: nextConfig } = await import("../../../next.config.mjs");
  return { default: () => nextConfig };
});

import { SITE_URL } from "@/lib/routes.mjs";
import { generateMetadata } from "../[network]/proposals/realm/[proposalKey]/page";

// A MOBILE Realm Proposal in next.config.mjs.
const MOBILE_PROPOSAL = "5pPPhWfuMx7cHNW4Um9PTuceJLw7RrqwJ7LKQ8Ldc98q";

describe("RealmProposalPage generateMetadata", () => {
  it("uses the Network of the Proposal in the canonical url", () => {
    const tags = generateMetadata({
      params: { network: "hnt", proposalKey: MOBILE_PROPOSAL },
    });
    expect(tags.alternates?.canonical).toBe(
      `${SITE_URL}/mobile/proposals/realm/${MOBILE_PROPOSAL}`
    );
  });
});
