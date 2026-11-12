import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config.mjs";

describe("redirects", () => {
  it("sends both old forms of each Legacy Proposal URL to its page", async () => {
    const redirects = await nextConfig.redirects!();
    const ids = new Set<string>(
      nextConfig.serverRuntimeConfig!.legacyProposals.map(
        ({ id }: { id: string }) => id
      )
    );

    for (const id of ids) {
      for (const source of [`/${id}`, `/legacy/${id}`]) {
        expect(redirects).toContainEqual({
          source,
          destination: `/hnt/proposals/legacy/${id}`,
          permanent: true,
        });
      }
    }
    expect(redirects).toHaveLength(2 * ids.size + 1);
  });

  it("keeps the temporary root redirect", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toContainEqual({
      source: "/",
      destination: "/hnt",
      permanent: false,
    });
  });
});
