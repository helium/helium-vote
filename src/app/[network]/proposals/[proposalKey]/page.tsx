import { NetworkPageParams } from "@/app/[network]/page";
import { Header } from "@/components/Header";
import { Proposal } from "@/components/Proposal";
import { formMetaTags, getProposalContent } from "@/lib/utils";
import { PublicKey } from "@solana/web3.js";
import React from "react";

interface ProposalPageParams extends NetworkPageParams {
  proposalKey: string;
}

export const generateMetadata = async ({
  params,
}: {
  params: ProposalPageParams;
}) => {
  const { proposalKey } = params;
  const pKey = new PublicKey(proposalKey);
  const { name } = await getProposalContent(pKey);

  return formMetaTags({
    title: name,
    description: `Vote on ${name}`,
    url: `https://heliumvote.com/${proposalKey}`,
  });
};

export default async function ProposalPage({
  params,
}: {
  params: ProposalPageParams;
}) {
  const { proposalKey } = params;
  const pKey = new PublicKey(params.proposalKey);
  const { content, name } = await getProposalContent(pKey);

  return (
    <>
      <Header hideHero={true} hideNav={true} />
      <Proposal name={name} content={content} proposalKey={proposalKey} />
    </>
  );
}
