import type { ProposalWithVotes } from "@helium/voter-stake-registry-sdk";

// The SDK defines `CastingProxy` but doesn't re-export it from its index, so
// derive it from the exported `ProposalWithVotes` vote rows.
export type CastingProxy =
  ProposalWithVotes["votes"][number]["castingProxies"][number];

// The SDK's `Vote` type declares `castingProxies` as required, but deployed
// vote-service instances may predate the column — keep it optional here so
// readers stay defensive during the rollout window.
export type VoteRow = { castingProxies?: CastingProxy[] };
