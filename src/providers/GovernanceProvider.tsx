"use client";

import { Wallet } from "@coral-xyz/anchor";
import { useAnchorProvider, useMint } from "@helium/helium-react-hooks";
import { organizationKey } from "@helium/organization-sdk";
import { HNT_MINT, IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";
import {
  HeliumVsrStateProvider,
  getSubDaos,
  useHeliumVsrState,
  useRegistrar,
  useSubDaos,
} from "@helium/voter-stake-registry-hooks";
import { getRegistrarKey, VoteService } from "@helium/voter-stake-registry-sdk";
import { PublicKey } from "@solana/web3.js";
import { useParams } from "next/navigation";
import { FC, ReactNode, createContext, useContext, useMemo } from "react";
import { useAsync } from "react-async-hook";

type GovNetwork = "hnt" | "mobile" | "iot";
type NetworkToName = { [K in GovNetwork]: string };
type NetworkToMint = { [K in GovNetwork]: PublicKey };

const networkToName: NetworkToName = {
  hnt: "Helium",
  mobile: "Helium MOBILE",
  iot: "Helium IOT",
};

const networksToMint: NetworkToMint = {
  hnt: HNT_MINT,
  mobile: MOBILE_MINT,
  iot: IOT_MINT,
};

export interface IGovernanceContextState {
  loading: boolean;
  mint: PublicKey;
  network: GovNetwork;
  networkName: string;
  organization: PublicKey;
  mintAcc?: ReturnType<typeof useMint>["info"];
  subDaos?: ReturnType<typeof useSubDaos>["result"];
  registrar?: ReturnType<typeof useRegistrar>["info"];
}

const GovernanceContext = createContext<IGovernanceContextState>(
  {} as IGovernanceContextState
);

const GovernanceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const anchorProvider = useAnchorProvider();
  const params = useParams();
  const network: GovNetwork = (params.network as GovNetwork) || "hnt";
  const networkName = useMemo(() => networkToName[network], [network]);
  const mint = useMemo(() => networksToMint[network], [network]);
  const registrarKey = useMemo(() => mint && getRegistrarKey(mint), [mint]);
  const { loading: loadingMint, info: mintAcc } = useMint(mint);
  const { loading: loadingRegistrar, info: registrar } =
    useRegistrar(registrarKey);

  const organization = useMemo(
    () => organizationKey(networkName)[0],
    [networkName]
  );

  const { loading: loadingSubdaos, result: subDaos } = useAsync(
    async (provider: ReturnType<typeof useAnchorProvider>) =>
      provider && getSubDaos(provider),
    [anchorProvider]
  );

  const loading = useMemo(
    () => loadingRegistrar || loadingMint || loadingSubdaos,
    [loadingRegistrar, loadingMint, loadingSubdaos]
  );

  const ret = useMemo(
    () => ({
      loading,
      network,
      networkName,
      mint,
      mintAcc,
      organization,
      registrar,
      subDaos,
    }),
    [
      loading,
      network,
      networkName,
      mint,
      mintAcc,
      organization,
      registrar,
      subDaos,
    ]
  );

  return (
    <GovernanceContext.Provider value={ret}>
      <HeliumVsrStateProvider
        mint={mint}
        wallet={anchorProvider?.wallet as Wallet}
        connection={anchorProvider?.connection}
        heliumVoteUri={process.env.NEXT_PUBLIC_HELIUM_VOTE_URI}
      >
        {children}
      </HeliumVsrStateProvider>
    </GovernanceContext.Provider>
  );
};

const useGovernance = () => {
  const context = useContext(GovernanceContext);
  if (context === undefined) {
    throw new Error("useGovernance must be used within a GovernanceProvider");
  }

  const { mint, positions, voteService, ...heliumVsrState } = useHeliumVsrState();

  const numActiveVotes = useMemo(
    () => positions?.reduce((acc, p) => acc + p.numActiveVotes, 0) || 0,
    [positions]
  );

  const loading = useMemo(
    () => context.loading || heliumVsrState.loading,
    [context.loading, heliumVsrState.loading]
  );

  return {
    ...context,
    ...heliumVsrState,
    // Ensure voteService is always defined.
    voteService:
      voteService ??
      new VoteService({
        baseURL: process.env.NEXT_PUBLIC_HELIUM_VOTE_URI,
        registrar: getRegistrarKey(HNT_MINT),
      }),
    numActiveVotes,
    positions,
    loading,
  };
};

export { GovernanceProvider, useGovernance };
