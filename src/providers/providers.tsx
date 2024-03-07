"use client";

import React, { FC } from "react";
import { WalletProvider } from "./WalletProvider";
import { AccountProvider } from "./AccountProvider";
import { GovernanceProvider } from "./GovernanceProvider";

export const Providers: FC<React.PropsWithChildren> = ({ children }) => (
  <WalletProvider>
    <AccountProvider>
      <GovernanceProvider>{children}</GovernanceProvider>
    </AccountProvider>
  </WalletProvider>
);
