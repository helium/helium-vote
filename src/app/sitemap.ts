import { fetchLegacyProposals, fetchRealmProposals } from "@/data/votes";
import { GovNetwork, govNetworks, networkToName } from "@/lib/constants";
import { legacyProposalPath, SITE_URL } from "@/lib/routes.mjs";
import { readOnlyProvider } from "@/lib/utils";
import { AnchorProvider } from "@anchor-lang/core";
import {
  init as initOrganization,
  organizationKey,
  proposalKey,
} from "@helium/organization-sdk";
import { init as initProposal } from "@helium/proposal-sdk";
import { PublicKey } from "@solana/web3.js";
import { MetadataRoute } from "next";

export const revalidate = 3600;

// Lists the Proposal keys of one Network's Organization, newest first.
// Proposals that share a name are listed once, as the newest of them, as the
// proposal list in the UI does.
const fetchProposalKeys = async (
  provider: AnchorProvider,
  network: GovNetwork
): Promise<PublicKey[]> => {
  const organizationSdk = await initOrganization(provider);
  const proposalSdk = await initProposal(provider);
  const organization = organizationKey(networkToName[network])[0];
  const { numProposals } =
    await organizationSdk.account.organizationV0.fetch(organization);

  const keys = Array.from(
    { length: numProposals },
    (_, index) => proposalKey(organization, numProposals - 1 - index)[0]
  );
  // Anchor splits the keys into RPC calls of the size the RPC accepts.
  const proposals = await proposalSdk.account.proposalV0.fetchMultiple(keys);

  const seenNames = new Set<string>();
  return keys.filter((_, index) => {
    const proposal = proposals[index];
    if (!proposal || seenNames.has(proposal.name)) return false;
    seenNames.add(proposal.name);
    return true;
  });
};

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const staticEntries: MetadataRoute.Sitemap = [
    ...govNetworks.map((network) => ({ url: `${SITE_URL}/${network}` })),
    ...fetchLegacyProposals().map(({ id }) => ({
      url: `${SITE_URL}${legacyProposalPath(id)}`,
    })),
    ...govNetworks.flatMap((network) =>
      fetchRealmProposals(network).map(({ publicKey }) => ({
        url: `${SITE_URL}/${network}/proposals/realm/${publicKey}`,
      }))
    ),
  ];

  const provider = readOnlyProvider();

  const proposalEntries = await Promise.all(
    govNetworks.map(async (network) => {
      try {
        const keys = await fetchProposalKeys(provider, network);
        return keys.map((key) => ({
          url: `${SITE_URL}/${network}/proposals/${key.toBase58()}`,
        }));
      } catch (error) {
        console.error(`sitemap: could not list ${network} proposals`, error);
        return [];
      }
    })
  );

  return [...staticEntries, ...proposalEntries.flat()];
};

export default sitemap;
