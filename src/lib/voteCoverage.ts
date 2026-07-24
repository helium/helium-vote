import { SkippedPosition } from "@/lib/governanceContract";

export const partitionSkips = (
  skipped: SkippedPosition[] | undefined,
): { maxChoices: SkippedPosition[]; alreadyVoted: SkippedPosition[] } => {
  const maxChoices: SkippedPosition[] = [];
  const alreadyVoted: SkippedPosition[] = [];
  for (const s of skipped ?? []) {
    if (s.reason === "maxChoicesReached") maxChoices.push(s);
    else alreadyVoted.push(s);
  }
  return { maxChoices, alreadyVoted };
};

// Mints skipped for maxChoicesReached can never register this choice, so they
// are excluded from the set we expect to see covered on-chain.
const expectedMints = (
  positionMints: string[],
  skipped: SkippedPosition[] | undefined,
): string[] => {
  const excluded = new Set(
    partitionSkips(skipped).maxChoices.map((s) => s.positionMint),
  );
  return positionMints.filter((m) => !excluded.has(m));
};

const markerCoversChoice = (
  choices: number[] | null | undefined,
  choice: number,
): boolean => !!choices && choices.includes(choice);

export const findUncoveredMints = (args: {
  positionMints: string[];
  skipped: SkippedPosition[] | undefined;
  markersByMint: Map<string, number[] | null>;
  choice: number;
}): string[] => {
  const { positionMints, skipped, markersByMint, choice } = args;
  return expectedMints(positionMints, skipped).filter(
    (mint) => !markerCoversChoice(markersByMint.get(mint), choice),
  );
};

// maxChoicesReached is permanent, so unioning the retry's report with the
// initial one can only add exclusions — never resurrect a covered mint.
const mergeSkips = (
  initial: SkippedPosition[] | undefined,
  retry: SkippedPosition[] | undefined,
): SkippedPosition[] | undefined => {
  if (!retry) return initial;
  const byMint = new Map<string, SkippedPosition>();
  for (const s of initial ?? []) byMint.set(s.positionMint, s);
  for (const s of retry) byMint.set(s.positionMint, s);
  return [...byMint.values()];
};

export const runCoverageVerification = async (args: {
  positionMints: string[];
  choice: number;
  fetchMarkers: (mints: string[]) => Promise<Map<string, number[] | null>>;
  resubmit: () => Promise<SkippedPosition[] | undefined>;
  initialSkipped: SkippedPosition[] | undefined;
}): Promise<{
  covered: boolean;
  uncoveredMints: string[];
  expectedCount: number;
}> => {
  const { positionMints, choice, fetchMarkers, resubmit, initialSkipped } =
    args;

  let skipped = initialSkipped;
  const check = async () =>
    findUncoveredMints({
      positionMints,
      skipped,
      markersByMint: await fetchMarkers(positionMints),
      choice,
    });

  let uncoveredMints = await check();
  if (uncoveredMints.length > 0) {
    skipped = mergeSkips(skipped, await resubmit());
    uncoveredMints = await check();
  }

  return {
    covered: uncoveredMints.length === 0,
    uncoveredMints,
    expectedCount: expectedMints(positionMints, skipped).length,
  };
};
