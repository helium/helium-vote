import { networksToMint } from "@/lib/constants";
import { PublicKey } from "@solana/web3.js";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback } from "react";

export function useNetwork() {
  const path = usePathname();
  const network = path.split("/")[0];
  const router = useRouter();
  const mint = networksToMint[network || ""];

  const setMint = useCallback(
    (mint: PublicKey) => {
      const newNetwork = Object.entries(networksToMint).find(([_, m]) =>
        mint.equals(m)
      )?.[0];
      // Construct new path
      const newPath = router.asPath.replace(network, newNetwork || network);

      router.push(newPath);
    },
    [network, router]
  );

  return {
    network,
    mint,
    setMint,
  };
}
