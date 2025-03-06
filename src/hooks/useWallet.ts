import { useWallet as useWalletAdapter } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useSearchParams } from "next/navigation";

export const useWallet = () => {
  const searchParams = useSearchParams();
  const { publicKey, ...rest } = useWalletAdapter();
  return {
    publicKey: searchParams.get("viewAs")
      ? new PublicKey(searchParams.get("viewAs") as string)
      : publicKey,
    ...rest,
  };
};
