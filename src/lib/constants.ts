import { HNT_MINT, IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";
import { PublicKey } from "@solana/web3.js";

// Make a smaller batch for the sake of ledger.
export const MAX_TRANSACTIONS_PER_SIGNATURE_BATCH = 5;

export const networksToMint: { [key: string]: PublicKey } = {
  hnt: HNT_MINT,
  mobile: MOBILE_MINT,
  iot: IOT_MINT,
};
