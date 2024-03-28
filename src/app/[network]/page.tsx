import React from "react";
import { fetchLegacyProposals, fetchRealmProposals } from "@/data/votes";
import { Proposals } from "@/components/Proposals";
import { NetworkBanner } from "@/components/NetworkBanner";
import { LegacyProposalCard } from "@/components/LegacyProposalCard";
import { Header } from "@/components/Header";
import { RealmProposalCard } from "@/components/RealmProposalCard";

export async function generateStaticParams() {
  const networks = ["hnt", "mobile", "iot"];
  return networks.map((network) => ({ network }));
}

export interface NetworkPageParams {
  network: string;
}

export default async function NetworkPage({
  params,
}: {
  params: NetworkPageParams;
}) {
  const { network } = params;
  const legacyProposals = fetchLegacyProposals();
  const realmProposals = fetchRealmProposals(network);

  return (
    <div className="flex flex-col gap-8">
      <Header />
      <NetworkBanner />
      <Proposals>
        {realmProposals.map((proposal) => (
          <RealmProposalCard
            key={proposal.publicKey}
            network={network}
            proposal={proposal}
          />
        ))}
        {network === "hnt" &&
          legacyProposals
            .reverse()
            .map((proposal) => (
              <LegacyProposalCard
                key={proposal.id}
                network={network}
                proposal={proposal}
              />
            ))}
      </Proposals>
    </div>
  );
}
