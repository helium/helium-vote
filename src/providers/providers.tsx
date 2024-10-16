"use client";

import React, { FC } from "react";
import { WalletProvider } from "./WalletProvider";
import { AccountProvider } from "./AccountProvider";
import { GovernanceProvider } from "./GovernanceProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Providers: FC<React.PropsWithChildren> = ({ children }) => {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
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
          <GovernanceProvider>{children}</GovernanceProvider>
        </AccountProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
};
