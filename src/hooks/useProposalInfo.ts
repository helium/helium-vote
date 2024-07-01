"use client";

import { ProposalV0 } from "@/lib/types";
import { getDerivedProposalState } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useMint } from "@helium/helium-react-hooks";
import {
  useProposal,
  useProposalConfig,
  useResolutionSettings,
} from "@helium/modular-governance-hooks";
import { useRegistrar, useVote } from "@helium/voter-stake-registry-hooks";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useMemo } from "react";
import { useProposalStatus } from "./useProposalStatus";

export function useProposalInfo(pKey: PublicKey) {
  const { connecting } = useWallet();

  const {
    loading: loadingGov,
    amountLocked,
    amountProxyLocked,
  } = useGovernance();
  const { loading: loadingProposal, info: proposal } = useProposal(pKey);
  const { loading: loadingVote, voteWeights } = useVote(pKey);
  const { info: proposalConfig } = useProposalConfig(proposal?.proposalConfig);
  const { info: registrar } = useRegistrar(proposalConfig?.voteController);
  const decimals = useMint(registrar?.votingMints[0].mint)?.info?.decimals;

  const totalLocked = amountLocked?.add(amountProxyLocked || new BN(0));

  const {
    isLoading: isLoadingStatus,
    isActive,
    isCancelled,
    isFailed,
    completed,
    timeExpired,
    resolution,
    endTs,
    votingResults,
  } = useProposalStatus(proposal);
  const isLoading =
    connecting ||
    loadingGov ||
    isLoadingStatus ||
    loadingProposal ||
    loadingVote;
  const noVotingPower = !isLoading && (!totalLocked || totalLocked.isZero());
  const voted = !loadingVote && voteWeights?.some((n) => n.gt(new BN(0)));

  return {
    voted,
    completed,
    isFailed,
    isCancelled,
    isActive,
    noVotingPower,
    timeExpired,
    isLoading,
    votingResults,
    proposal,
    proposalConfig,
    registrar,
    decimals,
    resolution,
    endTs,
  };
}
