import { HNT_MINT, IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";
import { GetServerSidePropsContext } from "next";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

const networksToMint = {
  helium: HNT_MINT,
  mobile: MOBILE_MINT,
  iot: IOT_MINT,
};

export const useNetwork = () => {
  const router = useRouter();
  const network = (router.query.network as string) || "helium";
  const mint = networksToMint[network || ""];

  const setMint = useCallback(
    (mint) => {
      const newNetwork = Object.entries(networksToMint).find(([_, m]) =>
        mint.equals(m)
      )[0];
      // Construct new path
      const newPath = router.asPath.replace(
        router.query.network as string,
        newNetwork
      );

      router.push(newPath);
    },
    [router.query.network]
  );

  return {
    network,
    mint,
    setMint,
  };
};

export async function getServerSideNetwork(context: GetServerSidePropsContext) {
  const network: string = (context.params.network as string) || "helium";
  const mint = networksToMint[network];

  // If mint is not found, you can handle it here, for example, return a 404 page
  if (!mint) {
    return {
      mint: HNT_MINT,
      network: "Helium",
    };
  }

  return {
    network,
    mint,
  };
}
