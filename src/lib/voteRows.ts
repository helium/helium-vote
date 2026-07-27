import BN from "bn.js";
import { toNumber } from "@helium/spl-utils";
import { CastingProxy, VoteRow } from "@/lib/voteServiceContract";

export type VoteRowInput = VoteRow & {
  voter: string;
  choiceName: string;
  weight: string;
  proxyName?: string;
};

export type GroupedVote = {
  voter: string;
  choices: string[];
  totalWeight: BN;
  proxyName?: string;
  castingProxies: CastingProxy[];
};

export const groupVoteRows = (
  rows: VoteRowInput[],
  decimals: number,
): GroupedVote[] => {
  const byVoter: Record<string, GroupedVote> = {};
  for (const vote of rows) {
    const entry = (byVoter[vote.voter] ??= {
      voter: vote.voter,
      choices: [],
      totalWeight: new BN(0),
      proxyName: vote.proxyName,
      castingProxies: [],
    });
    entry.choices.push(vote.choiceName);
    // Each row carries the wallet's full vote power for that choice,
    // so summing rows would multiply it by the number of choices
    entry.totalWeight = BN.max(entry.totalWeight, new BN(vote.weight));
    for (const proxy of vote.castingProxies ?? []) {
      if (!entry.castingProxies.some((p) => p.wallet === proxy.wallet)) {
        entry.castingProxies.push(proxy);
      }
    }
  }
  return Object.values(byVoter).sort((a, b) =>
    toNumber(b.totalWeight.sub(a.totalWeight), decimals),
  );
};
