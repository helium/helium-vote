import { HNT_MINT, IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";
import { useQueryString } from "./useQueryString";
import { useCallback } from "react";

const networksToMint = {
  Helium: HNT_MINT,
  'Helium Mobile': MOBILE_MINT,
  'Helium IOT': IOT_MINT,
};

export const useNetwork = () => {
  const [network, setNetwork] = useQueryString("network", "Helium");
  const mint = networksToMint[network];
  const setMint = useCallback((mint) => {
    setNetwork(
      Object.entries(networksToMint).find(([_, m]) => mint.equals(m))[0]
    );
  }, []);
  return {
    network,
    setNetwork,
    mint,
    setMint
  }
}
