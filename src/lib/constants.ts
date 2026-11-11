import { subDaoKey } from "@helium/helium-sub-daos-sdk";
import { organizationKey } from "@helium/organization-sdk";
import { HNT_MINT, IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";
import { PublicKey } from "@solana/web3.js";

// Make a smaller batch for the sake of ledger.
export const MAX_TRANSACTIONS_PER_SIGNATURE_BATCH = 5;

export type GovNetwork = "hnt" | "mobile" | "iot";

export const govNetworks: GovNetwork[] = ["hnt", "mobile", "iot"];

// The modular-governance Organization name for each Network.
export const networkToName: { [K in GovNetwork]: string } = {
  hnt: "Helium",
  mobile: "Helium MOBILE",
  iot: "Helium IOT",
};

// Parses a route segment into a Network. Gives undefined for any other text.
export const parseGovNetwork = (raw: string): GovNetwork | undefined =>
  govNetworks.find((network) => network === raw);

// Gives the Network whose Organization owns a Proposal, or undefined when no
// Network owns it.
export const organizationNetwork = (
  organization: PublicKey
): GovNetwork | undefined =>
  govNetworks.find((network) =>
    organizationKey(networkToName[network])[0].equals(organization)
  );

export const networksToMint: { [key: string]: PublicKey } = {
  hnt: HNT_MINT,
  mobile: MOBILE_MINT,
  iot: IOT_MINT,
};

export const IOT_SUB_DAO_KEY = subDaoKey(IOT_MINT)[0];

export const MOBILE_SUB_DAO_KEY = subDaoKey(MOBILE_MINT)[0];
