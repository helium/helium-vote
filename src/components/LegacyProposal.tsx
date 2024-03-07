"use client";

import { ILegacyProposal } from "@/lib/types";
import { useGovernance } from "@/providers/GovernanceProvider";
import BN from "bn.js";
import classNames from "classnames";
import Link from "next/link";
import React, { FC } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { ContentSection } from "./ContentSection";
import { VoteResults } from "./VoteResults";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ProposalBreakdown, ProposalSocial } from "./Proposal";

export const LegacyProposal: FC<{
  proposalKey: string;
  proposal: ILegacyProposal;
}> = ({ proposalKey, proposal }) => {
  const { network } = useGovernance();
  const { name, description, tags, authors, deadlineTs } = proposal;
  const total = proposal.outcomes.reduce((acc, o) => acc + o.hntVoted, 0);
  const totalUniqueWallets = proposal.outcomes.reduce(
    (acc, { uniqueWallets: votes }) => acc + votes,
    0
  );
  const votingResults = proposal.outcomes.map((o, index) => ({
    index,
    name: o.value,
    weight: new BN(o.hntVoted),
    percent: (o.hntVoted / total) * 100,
  }));

  const twitterUrl = new URL("https://twitter.com/intent/tweet");
  twitterUrl.searchParams.append(
    "text",
    `Voting for ${name} is closed. What did The People's Network think?`
  );
  twitterUrl.searchParams.append(
    "url",
    `https://heliumvote.com/${network}/proposals/legacy/${proposalKey}`
  );

  return (
    <>
      <div className="flex flex-row flex-shrink-0 w-full h-12 items-center justify-center bg-primary">
        <p className="text-foreground font-medium">Voting is Closed</p>
      </div>
      <ContentSection className="py-8 max-md:py-0">
        <Card className="p-2 rounded-md max-md:rounded-none">
          <CardHeader className="gap-2">
            <Link
              href={`/${network}`}
              className="flex flex-row items-center text-sm gap-2"
            >
              <FaArrowLeft />
              Back to Votes
            </Link>
            <div className="flex flex-row mb-12">
              {Object.values(tags)
                .filter((tag) => tag !== "tags")
                .map((tag, i) => (
                  <Badge
                    key={tag}
                    className={classNames(
                      "mr-1 rounded-sm font-normal py-1.5 border-2",
                      { "bg-foreground": i === 0 },
                      {
                        "bg-transparent border-background text-foreground":
                          i > 0,
                      }
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
            <h1>{name}</h1>
            {authors && (
              <div className="flex flex-row">
                <p className="text-sm">
                  <span className="font-semibold">{`Author${
                    authors.length > 1 ? "s" : ""
                  }: `}</span>
                  {authors.map(({ nickname, link }, i, { length }) => (
                    <>
                      {link ? ( // if link, use anchor
                        <Link
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="text-primary">{nickname}</span>
                        </Link>
                      ) : (
                        //if no link, show plain text
                        <span>{nickname}</span>
                      )}
                      {length > 1 && i + 1 !== length && (
                        <span className="text-muted-foreground">, </span>
                      )}
                    </>
                  ))}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4 h-full">
            <div className="flex flex-row gap-4 justify-between">
              <div className="flex flex-col w-auto lg:w-6/12 max-md:w-12/12">
                <VoteResults results={votingResults} decimals={8} />
                <div className="flex-col gap-2 mt-6 hidden max-md:flex">
                  <ProposalBreakdown
                    timeExpired={true}
                    endTs={new BN(deadlineTs)}
                    totalVotes={new BN(totalUniqueWallets)}
                    decimals={0}
                  />
                  <ProposalSocial
                    network={network}
                    proposalKey={proposalKey}
                    githubUrl={proposal.link}
                    twitterUrl={twitterUrl}
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <h4>Description</h4>
                  {description}
                </div>
              </div>
              <div className="flex flex-col gap-4 w-4/12 lg:w-3/12 max-md:hidden">
                <ProposalBreakdown
                  timeExpired={true}
                  endTs={new BN(deadlineTs)}
                  totalVotes={new BN(totalUniqueWallets)}
                  decimals={0}
                />
                <ProposalSocial
                  network={network}
                  proposalKey={proposalKey}
                  githubUrl={proposal.link}
                  twitterUrl={twitterUrl}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </ContentSection>
    </>
  );
};
