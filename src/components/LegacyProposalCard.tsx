"use server";

import React, { FC } from "react";
import { ILegacyProposal } from "@/lib/types";
import { getLegacyProposalState } from "@/lib/utils";
import { VoteCard } from "./VoteCard";

export const LegacyProposalCard: FC<{
  network: string;
  proposal: ILegacyProposal;
}> = ({ network, proposal }) => {
  const derivedState = getLegacyProposalState(proposal);
  const total = proposal.outcomes.reduce((acc, o) => acc + o.hntVoted, 0);
  const votingResults = proposal.outcomes.map((o, index) => ({
    index,
    percent: (o.hntVoted / total) * 100,
  }));

  return (
    <VoteCard
      href={`/${network}/proposals/legacy/${proposal.id}`}
      state={derivedState}
      tags={Object.values(proposal.tags)}
      name={proposal.name}
      description={proposal.description}
      results={votingResults}
      finalResult={derivedState}
      endTs={proposal.deadlineTs}
      totalVotes={total}
      decimals={8}
    />
  );
};
