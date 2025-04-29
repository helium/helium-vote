import { subDaoKey } from "@helium/helium-sub-daos-sdk";
import { HNT_MINT, IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";
import { PublicKey } from "@solana/web3.js";

// Make a smaller batch for the sake of ledger.
export const MAX_TRANSACTIONS_PER_SIGNATURE_BATCH = 5;

export const networksToMint: { [key: string]: PublicKey } = {
  hnt: HNT_MINT,
  mobile: MOBILE_MINT,
  iot: IOT_MINT,
};

export const IOT_SUB_DAO_KEY = subDaoKey(IOT_MINT)[0];

export const MOBILE_SUB_DAO_KEY = subDaoKey(MOBILE_MINT)[0];
