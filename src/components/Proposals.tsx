"use client";

import { ProposalV0 } from "@/lib/types";
import { getDerivedProposalState } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useOrganizationProposals } from "@helium/modular-governance-hooks";
import { organizationKey } from "@helium/organization-sdk";
import React, { FC, useMemo } from "react";
import { ContentSection } from "./ContentSection";
import { ProposalCard } from "./ProposalCard";
import { VoteCardSkeleton } from "./VoteCard";
import { Card } from "./ui/card";

export const Proposals: FC<React.PropsWithChildren<{ className?: string }>> = ({
  children,
}) => {
  const { loading: loadingGov, networkName } = useGovernance();
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

  const inactiveProposals = useMemo(
    () =>
      undupedProposals.filter(
        (proposal) =>
          getDerivedProposalState(proposal.info as ProposalV0) !== "active"
      ),
    [undupedProposals]
  );

  const isLoading = useMemo(() => loading || loadingGov, [loading, loadingGov]);

  if (isLoading)
    return (
      <ContentSection className="flex-1">
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
    <ContentSection className="flex-1">
      <section className="flex flex-col gap-4">
        <h4>Open Votes</h4>
        {activeProposals.length === 0 ? (
          <Card className="py-2">
            <div className="flex flex-col items-center justify-center p-6">
              <h3 className="text-xl text-muted-foreground">No Active Votes</h3>
              <p className="text-sm text-center text-muted-foreground">
                There are currently no active votes on this network.
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
      {inactiveProposals.length > 0 || children ? (
        <section className="flex flex-col gap-4 my-4">
          <h5>Closed Votes</h5>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {inactiveProposals.map((proposal, i) => (
              <ProposalCard
                key={proposal.publicKey.toBase58()}
                proposal={proposal.info as ProposalV0}
                proposalKey={proposal.publicKey}
              />
            ))}
            {children}
          </div>
        </section>
      ) : null}
    </ContentSection>
  );
};
