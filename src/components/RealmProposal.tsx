"use client";

import { IRealmProposal } from "@/lib/types";
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
import Markdown from "react-markdown";

export const RealmProposal: FC<{
  proposalKey: string;
  proposal: IRealmProposal;
  content: string;
}> = ({ proposalKey, proposal, content }) => {
  const { network } = useGovernance();
  const { name, summary, tags, endTs } = proposal;
  const total = proposal.outcomes.reduce((acc, o) => acc + o.votes, 0);
  const votingResults = proposal.outcomes.map((o, index) => ({
    index,
    name: o.value,
    weight: new BN(o.votes),
    percent: (o.votes / total) * 100,
  }));

  const twitterUrl = new URL("https://twitter.com/intent/tweet");
  twitterUrl.searchParams.append(
    "text",
    `Voting for ${name} is closed. What did The People's Network think?`
  );
  twitterUrl.searchParams.append(
    "url",
    `https://heliumvote.com/${network}/proposals/realm/${proposalKey}`
  );

  return (
    <>
      <div className="flex flex-row flex-shrink-0 w-full h-12 items-center justify-center bg-primary">
        <p className="text-foreground font-medium">Voting is Closed</p>
      </div>
      <ContentSection className="py-8 max-md:py-0 max-md:px-0">
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
          </CardHeader>
          <CardContent className="flex flex-col gap-4 h-full">
            <div className="flex flex-row gap-4 justify-between">
              <div className="flex flex-col w-auto lg:w-6/12 max-md:w-12/12">
                <VoteResults results={votingResults} decimals={0} />
                <div className="flex-col gap-2 mt-6 hidden max-md:flex">
                  <ProposalBreakdown
                    timeExpired={true}
                    endTs={new BN(endTs)}
                    decimals={0}
                  />
                  <ProposalSocial
                    network={network}
                    proposalKey={proposalKey}
                    githubUrl={proposal.github}
                    twitterUrl={twitterUrl}
                  />
                </div>
                <div className="w-full flex flex-col mt-5">
                  <Markdown className="prose prose-headings:m-0 prose-headings:font-normal prose-hr:my-8 prose-p:text-foreground clear-both dark:prose-invert">
                    {content.replace(name, "")}
                  </Markdown>
                </div>
              </div>
              <div className="flex flex-col gap-4 w-4/12 lg:w-3/12 max-md:hidden">
                <ProposalBreakdown
                  timeExpired={true}
                  endTs={new BN(endTs)}
                  decimals={0}
                />
                <ProposalSocial
                  network={network}
                  proposalKey={proposalKey}
                  githubUrl={proposal.github}
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
