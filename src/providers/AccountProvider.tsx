"use client";

import { AccountProvider as HeliumAccountProvider } from "@helium/account-fetch-cache-hooks";
import { useConnection } from "@solana/wallet-adapter-react";
import React, { FC } from "react";

export const AccountProvider: FC<React.PropsWithChildren> = ({ children }) => {
  const { connection } = useConnection();
  return (
    <HeliumAccountProvider connection={connection} commitment="confirmed">
      {children}
    </HeliumAccountProvider>
  );
};
