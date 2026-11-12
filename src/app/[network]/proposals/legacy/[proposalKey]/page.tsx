import { NetworkPageParams } from "@/app/[network]/page";
import { Header } from "@/components/Header";
import { LegacyProposal } from "@/components/LegacyProposal";
import { fetchLegacyProposal } from "@/data/votes";
import { legacyProposalPath } from "@/lib/routes.mjs";
import { formProposalMetaTags } from "@/lib/utils";
import React from "react";

interface LegacyProposalPageParams extends NetworkPageParams {
  proposalKey: string;
}

export const generateMetadata = ({
  params,
}: {
  params: LegacyProposalPageParams;
}) => {
  const { proposalKey } = params;
  const proposal = fetchLegacyProposal(proposalKey);
  return formProposalMetaTags(
    proposal && {
      name: proposal.name,
      description: proposal.description,
      path: legacyProposalPath(proposalKey),
    }
  );
};

const LegacyProposalPage = async ({
  params,
}: {
  params: LegacyProposalPageParams;
}) => {
  const { proposalKey } = params;
  const proposal = fetchLegacyProposal(proposalKey);

  return (
    <>
      <Header hideHero={true} hideNav={true} />
      <LegacyProposal proposalKey={proposalKey} proposal={proposal} />
    </>
  );
};

export default LegacyProposalPage;
