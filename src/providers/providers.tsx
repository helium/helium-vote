"use client";

import React, { FC } from "react";
import { WalletProvider } from "./WalletProvider";
import { AccountProvider } from "./AccountProvider";
import { GovernanceProvider } from "./GovernanceProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Providers: FC<React.PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <AccountProvider>
        <GovernanceProvider>{children}</GovernanceProvider>
      </AccountProvider>
    </WalletProvider>
  </QueryClientProvider>
);
