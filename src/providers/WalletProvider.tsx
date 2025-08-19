"use client";

import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import React, { FC, useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { toast } from "sonner";
import {
  CoinbaseWalletAdapter,
  SolflareWalletAdapter,
  WalletConnectWalletAdapter,
} from "@solana/wallet-adapter-wallets";

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
      new CoinbaseWalletAdapter(),
      new WalletConnectWalletAdapter({
        network: WalletAdapterNetwork.Mainnet,
        options: {
          projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
        },
      }),
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
