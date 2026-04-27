"use client";

import { apiContract } from "@helium/blockchain-api";
import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { ContractRouterClient } from "@orpc/contract";
import React, { createContext, useContext, useMemo } from "react";

const BlockchainApiContext = createContext<ContractRouterClient<
  typeof apiContract
> | null>(null);

export const BlockchainApiProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const client = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_HELIUM_TRANSACTION_API;

    if (!url || url.trim() === "") {
      console.error(
        "Missing blockchain API URL configuration. Please set NEXT_PUBLIC_HELIUM_TRANSACTION_API in your .env file."
      );
      return null;
    }

    try {
      const link = new RPCLink({
        url: `${url.trim()}/rpc`,
        headers: () => ({
          "Content-Type": "application/json",
        }),
        interceptors: [
          onError((error) => {
            console.error(error);
          }),
        ],
      });
      const orpcClient: ContractRouterClient<typeof apiContract> =
        createORPCClient(link);

      return orpcClient;
    } catch (error) {
      console.error("Failed to create blockchain API client:", error);
      return null;
    }
  }, []);

  return (
    <BlockchainApiContext.Provider value={client}>
      {children}
    </BlockchainApiContext.Provider>
  );
};

export const useBlockchainApi = (): ContractRouterClient<
  typeof apiContract
> => {
  const context = useContext(BlockchainApiContext);

  if (!context) {
    throw new Error(
      "useBlockchainApi must be used within a BlockchainApiProvider. Make sure NEXT_PUBLIC_HELIUM_TRANSACTION_API is set in your .env file."
    );
  }

  return context;
};
