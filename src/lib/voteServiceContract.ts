// Local structural mirror of the additive `votesForProposal` casting-proxy
// fields. The vote-service rows now carry the casting proxy wallet(s)/name(s)
// for owner rows that voted via proxy (empty for direct votes).
// TODO: import from @helium/blockchain-api once the skip-report release ships.

export type CastingProxy = { wallet: string; name: string | null };

export type VoteRow = { castingProxies?: CastingProxy[] };
