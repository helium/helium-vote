// Local structural mirrors of the additive `governance.vote` skip-report fields.
// TODO: import from @helium/blockchain-api once the skip-report release ships.

export type SkipReason = "maxChoicesReached" | "alreadyVotedThisChoice";

export interface SkippedPosition {
  positionMint: string;
  reason: SkipReason;
}

// oRPC error code thrown when every position was skipped.
export const ALL_POSITIONS_SKIPPED = "ALL_POSITIONS_SKIPPED";

// Older servers (during the deploy window) omit `skipped` entirely.
export const readSkipped = (response: unknown): SkippedPosition[] =>
  (response as { skipped?: SkippedPosition[] })?.skipped ?? [];

// Read the skip report off a thrown ALL_POSITIONS_SKIPPED oRPC error.
export const readSkippedFromError = (error: unknown): SkippedPosition[] =>
  (error as { data?: { skipped?: SkippedPosition[] } })?.data?.skipped ?? [];

export const isAllPositionsSkippedError = (error: unknown): boolean =>
  (error as { code?: string })?.code === ALL_POSITIONS_SKIPPED;
