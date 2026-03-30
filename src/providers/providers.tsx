"use client";

import React, { FC } from "react";
import { WalletProvider, WalletAdapterProvider } from "./WalletProvider";
import { AccountProvider } from "./AccountProvider";
import { GovernanceProvider } from "./GovernanceProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Providers: FC<React.PropsWithChildren> = ({ children }) => {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
    []
  );
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <AccountProvider>
          <WalletAdapterProvider>
            <GovernanceProvider>{children}</GovernanceProvider>
          </WalletAdapterProvider>
        </AccountProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
};
