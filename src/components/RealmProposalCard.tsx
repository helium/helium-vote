"use server";

import React, { FC } from "react";
import { IRealmProposal } from "@/lib/types";
import { VoteCard } from "./VoteCard";

export const RealmProposalCard: FC<{
  network: string;
  proposal: IRealmProposal;
}> = ({ network, proposal }) => {
  const total = proposal.outcomes.reduce((acc, o) => acc + o.votes, 0);
  const votingResults = proposal.outcomes.map((o, index) => ({
    index,
    percent: (o.votes / total) * 100,
  }));

  return (
    <VoteCard
      href={`/${network}/proposals/realm/${proposal.publicKey}`}
      state={proposal.status}
      tags={Object.values(proposal.tags)}
      name={proposal.name}
      description={proposal.summary}
      results={votingResults}
      finalResult={proposal.status}
      endTs={proposal.endTs}
      totalVotes={total}
      decimals={0}
    />
  );
};
