import { describe, expect, it, vi } from "vitest";

vi.mock("@/data/votes", () => ({}));

import { govNetworks } from "@/lib/constants";
import { generateMetadata } from "../[network]/page";

describe("NetworkPage generateMetadata", () => {
  it("gives each Network a description", () => {
    for (const network of govNetworks) {
      expect(generateMetadata({ params: { network } }).description).toMatch(
        /\S/
      );
    }
  });
});
