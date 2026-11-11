import { describe, expect, it } from "vitest";
import { truncateDescription } from "../utils";

describe("truncateDescription", () => {
  it("flattens whitespace in a short description", () => {
    expect(truncateDescription("  Vote on\n\nHIP 1  ")).toBe("Vote on HIP 1");
  });

  it("cuts a long description at a word boundary", () => {
    const text = "word ".repeat(50);
    const truncated = truncateDescription(text);
    expect(truncated.length).toBeLessThanOrEqual(160);
    expect(truncated).toMatch(/word…$/);
  });

  it("cuts mid-word when the first 160 characters hold no space", () => {
    for (const text of ["a".repeat(500), "a".repeat(300) + " word word"]) {
      const truncated = truncateDescription(text);
      expect(truncated).toBe("a".repeat(159) + "…");
    }
  });
});
