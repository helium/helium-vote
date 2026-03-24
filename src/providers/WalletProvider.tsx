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
import { CoinbaseWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useWrappedReownAdapter } from "@jup-ag/jup-mobile-adapter";

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

  const { reownAdapter, jupiterAdapter } = useWrappedReownAdapter({
    appKitOptions: {
      metadata: {
        name: "Helium Vote",
        description: "Helium Network governance and voting",
        url: "https://heliumvote.com",
        icons: ["https://heliumvote.com/images/logo-roundel.svg"],
      },
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
      features: {
        analytics: false,
      },
      enableWallets: false,
    },
  });

  const wallets = useMemo(
    () => [
      // Solflare, Ledger, and Backpack use wallet standard
      new CoinbaseWalletAdapter(),
      reownAdapter,
      jupiterAdapter,
    ],
    [reownAdapter, jupiterAdapter]
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
