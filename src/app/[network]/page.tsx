import React from "react";
import { fetchLegacyProposals, fetchRealmProposals } from "@/data/votes";
import { Proposals } from "@/components/Proposals";
import { NetworkBanner } from "@/components/NetworkBanner";
import { LegacyProposalCard } from "@/components/LegacyProposalCard";
import { Header } from "@/components/Header";
import { RealmProposalCard } from "@/components/RealmProposalCard";
import { GovNetwork, govNetworks } from "@/lib/constants";
import { SITE_URL } from "@/lib/routes.mjs";
import { formMetaTags } from "@/lib/utils";

export const dynamicParams = false;

export async function generateStaticParams() {
  return govNetworks.map((network) => ({ network }));
}

// The [network] layout returns 404 for any other `network`.
export interface NetworkPageParams {
  network: GovNetwork;
}

const networkDescriptions: Record<GovNetwork, string> = {
  hnt: "Vote on Helium Improvement Proposals (HIPs) with veHNT, and browse the results of past Helium governance votes.",
  mobile: "Vote on Helium MOBILE network proposals with veMOBILE, and browse the results of past MOBILE votes.",
  iot: "Vote on Helium IOT network proposals with veIOT, and browse the results of past IOT votes.",
};

export const generateMetadata = async ({
  params,
}: {
  params: NetworkPageParams;
}) => {
  const { network } = params;

  return formMetaTags({
    title: `${network.toUpperCase()} Proposals`,
    description: networkDescriptions[network],
    url: `${SITE_URL}/${network}`,
  });
};

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
