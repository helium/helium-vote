"use client";

import { realmProposals } from "@/data/realmProposals";
import { ProposalState, ProposalV0 } from "@/lib/types";
import { getDerivedProposalState } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useOrganizationProposals } from "@helium/modular-governance-hooks";
import { organizationKey } from "@helium/organization-sdk";
import React, { FC, useMemo } from "react";
import { ProposalCard } from "./ProposalCard";
import { VoteCard, VoteCardSkeleton } from "./VoteCard";
import { Card } from "./ui/card";
import { ContentSection } from "./ContentSection";

// LegacyProposals are passed in as children from the page
// They render as server components
export const Proposals: FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
}) => {
  const { loading: loadingGov, mint, network, networkName } = useGovernance();
  const organization = useMemo(
    () => organizationKey(networkName)[0],
    [networkName]
  );
  const { loading, accounts: proposalsWithDups } =
    useOrganizationProposals(organization);

  const undupedProposals = useMemo(() => {
    const seen = new Set();
    return (proposalsWithDups || [])
      .filter((p) => {
        const has = seen.has(p.info?.name);
        seen.add(p.info?.name);
        return !has;
      })
      .filter((p) => !!p.info);
  }, [proposalsWithDups]);

  const activeProposals = useMemo(
    () =>
      undupedProposals.filter(
        (proposal) =>
          getDerivedProposalState(proposal.info as ProposalV0) === "active"
      ),
    [undupedProposals]
  );

  const unactiveProposals = useMemo(
    () =>
      undupedProposals.filter(
        (proposal) =>
          getDerivedProposalState(proposal.info as ProposalV0) !== "active"
      ),
    [undupedProposals]
  );

  const realmsProposals = useMemo(() => {
    if (mint) {
      return realmProposals[mint.toBase58()];
    }
  }, [mint]);

  const isLoading = useMemo(
    () => loading || loadingGov || !proposalsWithDups,
    [loading, loadingGov, proposalsWithDups]
  );

  if (isLoading)
    return (
      <ContentSection className="flex-1 px-4 md:px-0">
        <section className="flex flex-col gap-4">
          <h4>Open Votes</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <VoteCardSkeleton key={i} />
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-4 mt-4">
          <h5>Closed Votes</h5>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <VoteCardSkeleton key={i} />
            ))}
          </div>
        </section>
      </ContentSection>
    );

  return (
    <ContentSection className="flex-1 px-4 md:px-0">
      <section className="flex flex-col gap-4">
        <h4>Open Votes</h4>
        {activeProposals.length === 0 ? (
          <Card className="py-10">
            <div className="flex flex-col items-center justify-center p-11">
              <h3 className="text-xl text-muted-foreground">No Active Votes</h3>
              <p className="text-sm text-center text-muted-foreground">
                There are no active votes for this network at this time
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {activeProposals.map((proposal) => (
              <ProposalCard
                key={proposal.publicKey.toBase58()}
                proposal={proposal.info as ProposalV0}
                proposalKey={proposal.publicKey}
              />
            ))}
          </div>
        )}
      </section>
      {unactiveProposals.length > 0 || React.Children.count(children) > 0 ? (
        <section className="flex flex-col gap-4 mt-4">
          <h5>Closed Votes</h5>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {unactiveProposals.map((proposal, i) => (
              <ProposalCard
                key={proposal.publicKey.toBase58()}
                proposal={proposal.info as ProposalV0}
                proposalKey={proposal.publicKey}
              />
            ))}
            {realmsProposals?.map((proposal, i) => {
              const total = proposal.outcomes.reduce(
                (acc, o) => acc + o.votes,
                0
              );

              return (
                <VoteCard
                  key={`realm-${i}`}
                  href={proposal.href}
                  tags={proposal.tags}
                  name={proposal.name}
                  description={proposal.summary}
                  results={proposal.outcomes.map((o, index) => ({
                    index,
                    percent: (o.votes / total) * 100,
                  }))}
                  finalResult={proposal.status}
                  endTs={proposal.endTs}
                  decimals={0}
                  state={proposal.status as ProposalState}
                  totalVotes={total}
                />
              );
            })}
            {network === "hnt" && children}
          </div>
        </section>
      ) : null}
    </ContentSection>
  );
};
