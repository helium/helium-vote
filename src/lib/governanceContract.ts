import type { SkipReason, SkippedPosition } from "@helium/blockchain-api";

export type { SkipReason, SkippedPosition };

// oRPC error code thrown when every position was skipped. The package exports
// the error *definition* (status/message/data schema); the code string clients
// see is its key.
export const ALL_POSITIONS_SKIPPED = "ALL_POSITIONS_SKIPPED";

// Older servers (during the deploy window) omit `skipped` entirely.
export const readSkipped = (response: unknown): SkippedPosition[] =>
  (response as { skipped?: SkippedPosition[] })?.skipped ?? [];

// Read the skip report off a thrown ALL_POSITIONS_SKIPPED oRPC error.
export const readSkippedFromError = (error: unknown): SkippedPosition[] =>
  (error as { data?: { skipped?: SkippedPosition[] } })?.data?.skipped ?? [];

export const isAllPositionsSkippedError = (error: unknown): boolean =>
  (error as { code?: string })?.code === ALL_POSITIONS_SKIPPED;
