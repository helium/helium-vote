import { describe, expect, it, vi } from "vitest";
import { SkippedPosition } from "@/lib/governanceContract";
import {
  findUncoveredMints,
  partitionSkips,
  runCoverageVerification,
} from "@/lib/voteCoverage";

const skip = (
  positionMint: string,
  reason: SkippedPosition["reason"]
): SkippedPosition => ({ positionMint, reason });

describe("partitionSkips", () => {
  it("splits skips by reason", () => {
    const { maxChoices, alreadyVoted } = partitionSkips([
      skip("a", "maxChoicesReached"),
      skip("b", "alreadyVotedThisChoice"),
      skip("c", "maxChoicesReached"),
    ]);

    expect(maxChoices.map((s) => s.positionMint)).toEqual(["a", "c"]);
    expect(alreadyVoted.map((s) => s.positionMint)).toEqual(["b"]);
  });

  it("tolerates undefined", () => {
    const { maxChoices, alreadyVoted } = partitionSkips(undefined);
    expect(maxChoices).toEqual([]);
    expect(alreadyVoted).toEqual([]);
  });
});

describe("findUncoveredMints", () => {
  const choice = 2;

  it("flags a mint with a missing marker", () => {
    const result = findUncoveredMints({
      positionMints: ["a"],
      skipped: [],
      markersByMint: new Map([["a", null]]),
      choice,
    });
    expect(result).toEqual(["a"]);
  });

  it("flags a mint whose marker lacks the choice", () => {
    const result = findUncoveredMints({
      positionMints: ["a"],
      skipped: [],
      markersByMint: new Map([["a", [0, 1]]]),
      choice,
    });
    expect(result).toEqual(["a"]);
  });

  it("treats a mint whose marker includes the choice as covered", () => {
    const result = findUncoveredMints({
      positionMints: ["a"],
      skipped: [],
      markersByMint: new Map([["a", [2]]]),
      choice,
    });
    expect(result).toEqual([]);
  });

  it("excludes maxChoicesReached skips from expected coverage", () => {
    const result = findUncoveredMints({
      positionMints: ["a", "b"],
      skipped: [skip("a", "maxChoicesReached")],
      // "a" has no marker but must not count as uncovered
      markersByMint: new Map([["b", [2]]]),
      choice,
    });
    expect(result).toEqual([]);
  });

  it("still verifies alreadyVotedThisChoice skips via the marker", () => {
    const covered = findUncoveredMints({
      positionMints: ["a"],
      skipped: [skip("a", "alreadyVotedThisChoice")],
      markersByMint: new Map([["a", [2]]]),
      choice,
    });
    expect(covered).toEqual([]);

    const uncovered = findUncoveredMints({
      positionMints: ["a"],
      skipped: [skip("a", "alreadyVotedThisChoice")],
      markersByMint: new Map([["a", null]]),
      choice,
    });
    expect(uncovered).toEqual(["a"]);
  });

  it("tolerates undefined skipped", () => {
    const result = findUncoveredMints({
      positionMints: ["a"],
      skipped: undefined,
      markersByMint: new Map([["a", [2]]]),
      choice,
    });
    expect(result).toEqual([]);
  });
});

describe("runCoverageVerification", () => {
  const choice = 1;

  it("does not resubmit when the first diff is clean", async () => {
    const fetchMarkers = vi.fn().mockResolvedValue(new Map([["a", [1]]]));
    const resubmit = vi.fn();

    const result = await runCoverageVerification({
      positionMints: ["a"],
      choice,
      fetchMarkers,
      resubmit,
      initialSkipped: [],
    });

    expect(resubmit).not.toHaveBeenCalled();
    expect(fetchMarkers).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      covered: true,
      uncoveredMints: [],
      expectedCount: 1,
    });
  });

  it("resubmits exactly once and reports covered when the retry lands", async () => {
    const fetchMarkers = vi
      .fn()
      .mockResolvedValueOnce(new Map([["a", null]]))
      .mockResolvedValueOnce(new Map([["a", [1]]]));
    const resubmit = vi.fn().mockResolvedValue([]);

    const result = await runCoverageVerification({
      positionMints: ["a"],
      choice,
      fetchMarkers,
      resubmit,
      initialSkipped: [],
    });

    expect(resubmit).toHaveBeenCalledTimes(1);
    expect(fetchMarkers).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      covered: true,
      uncoveredMints: [],
      expectedCount: 1,
    });
  });

  it("retries once then reports the persisting shortfall", async () => {
    const fetchMarkers = vi.fn().mockResolvedValue(new Map([["a", null]]));
    const resubmit = vi.fn().mockResolvedValue([]);

    const result = await runCoverageVerification({
      positionMints: ["a"],
      choice,
      fetchMarkers,
      resubmit,
      initialSkipped: [],
    });

    expect(resubmit).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      covered: false,
      uncoveredMints: ["a"],
      expectedCount: 1,
    });
  });

  it("reports coverage from the markers when a partial submit still landed every mint", async () => {
    // The submit throw is handled by the hook; verification only sees markers.
    // Here every expected mint has its choice on-chain despite the throw, so no
    // retry fires and the vote is reported as covered.
    const fetchMarkers = vi.fn().mockResolvedValue(
      new Map([
        ["a", [1]],
        ["b", [1]],
        ["c", [1]],
      ])
    );
    const resubmit = vi.fn();

    const result = await runCoverageVerification({
      positionMints: ["a", "b", "c"],
      choice,
      fetchMarkers,
      resubmit,
      initialSkipped: [],
    });

    expect(resubmit).not.toHaveBeenCalled();
    expect(fetchMarkers).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      covered: true,
      uncoveredMints: [],
      expectedCount: 3,
    });
  });

  it("retries only the mints a partial submit missed and reports what stays uncovered", async () => {
    // "a"/"c" landed on the partial submit; "b" is missing. The retry lands "b"
    // but "c" is now missing — the final diff reflects the second read.
    const fetchMarkers = vi
      .fn()
      .mockResolvedValueOnce(
        new Map([
          ["a", [1]],
          ["b", null],
          ["c", [1]],
        ])
      )
      .mockResolvedValueOnce(
        new Map([
          ["a", [1]],
          ["b", [1]],
          ["c", null],
        ])
      );
    const resubmit = vi.fn().mockResolvedValue([]);

    const result = await runCoverageVerification({
      positionMints: ["a", "b", "c"],
      choice,
      fetchMarkers,
      resubmit,
      initialSkipped: [],
    });

    expect(resubmit).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      covered: false,
      uncoveredMints: ["c"],
      expectedCount: 3,
    });
  });

  it("excludes maxChoices skips reported by the retry from the final diff", async () => {
    // "a" lands on retry; "b" comes back as maxChoicesReached and must not
    // count against coverage.
    const fetchMarkers = vi
      .fn()
      .mockResolvedValueOnce(
        new Map([
          ["a", null],
          ["b", null],
        ])
      )
      .mockResolvedValueOnce(
        new Map([
          ["a", [1]],
          ["b", null],
        ])
      );
    const resubmit = vi
      .fn()
      .mockResolvedValue([skip("b", "maxChoicesReached")]);

    const result = await runCoverageVerification({
      positionMints: ["a", "b"],
      choice,
      fetchMarkers,
      resubmit,
      initialSkipped: [],
    });

    expect(resubmit).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      covered: true,
      uncoveredMints: [],
      expectedCount: 1,
    });
  });
});
