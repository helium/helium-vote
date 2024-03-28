"use client";

import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import React, { FC, useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { toast } from "sonner";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export const WalletProvider: FC<React.PropsWithChildren> = ({ children }) => {
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(
    () =>
      process.env.NEXT_PUBLIC_SOLANA_URL ||
      clusterApiUrl(WalletAdapterNetwork.Mainnet),
    []
  );

  const wallets = useMemo(
    () => [
      // Ledger and backpack use wallet standard
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider
        wallets={wallets}
        autoConnect
        onError={(err) => err.message.length && toast(err.message)}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};
