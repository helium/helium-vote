import { NetworkPageParams } from "@/app/[network]/page";
import { Header } from "@/components/Header";
import { RealmProposal } from "@/components/RealmProposal";
import { fetchRealmProposal } from "@/data/votes";
import { IRealmProposal } from "@/lib/types";
import { formProposalMetaTags } from "@/lib/utils";
import React from "react";

interface RealmProposalPageParams extends NetworkPageParams {
  proposalKey: string;
}

interface GistFiles {
  [fileName: string]: {
    content: string;
  };
}

interface GistResponse {
  files: GistFiles;
}

const getContent = async (gist: string) => {
  const url = gist.replace(/^http:\/\//, "https://");
  const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  const data: GistResponse = await response.json();
  const file = Object.values(data.files)[0];
  return file.content;
};

export const generateMetadata = ({
  params,
}: {
  params: RealmProposalPageParams;
}) => {
  const { proposalKey } = params;
  const proposal: IRealmProposal | null = fetchRealmProposal(proposalKey);
  return formProposalMetaTags(
    proposal && {
      name: proposal.name,
      description: proposal.summary,
      path: `/${proposal.network}/proposals/realm/${proposalKey}`,
    }
  );
};

const RealmProposalPage = async ({
  params,
}: {
  params: RealmProposalPageParams;
}) => {
  const { proposalKey } = params;
  const proposal: IRealmProposal = fetchRealmProposal(proposalKey);
  const content = await getContent(proposal.gist);

  return (
    <>
      <Header hideHero={true} hideNav={true} />
      <RealmProposal
        content={content}
        proposalKey={proposalKey}
        proposal={proposal}
      />
    </>
  );
};

export default RealmProposalPage;
