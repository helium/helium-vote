import { IdlAccounts } from "@coral-xyz/anchor/dist/cjs/program/namespace/types";
import { useMint } from "@helium/helium-react-hooks";
import {
  useProposalConfig,
  useResolutionSettings,
} from "@helium/modular-governance-hooks";
import { Proposal } from "@helium/modular-governance-idls/lib/types/proposal";
import { useHeliumVsrState } from "@helium/voter-stake-registry-hooks";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useMemo } from "react";
import { useNetwork } from "../hooks/useNetwork";
import { VoteCard } from "./VoteCard";

export const ProposalVoteCard = ({
  proposal,
  proposalKey,
}: {
  proposal: IdlAccounts<Proposal>["proposalV0"];
  proposalKey: PublicKey;
}) => {
  const id = proposalKey;
  const { mint } = useHeliumVsrState();
  const {
    tags,
    choices,
    name,
    proposalConfig: proposalConfigKey,
    state,
  } = proposal;
  const { info: proposalConfig } = useProposalConfig(proposalConfigKey);
  const decimals = useMint(mint)?.info.decimals;
  const { info: resolution } = useResolutionSettings(
    proposalConfig?.stateController
  );
  const { network } = useNetwork();
  const totalVotes = useMemo(() => {
    return choices.reduce(
      (acc: BN, { weight }) => weight.add(acc) as BN,
      new BN(0)
    );
  }, [choices]);

  const endTs =
    resolution &&
    (proposal?.state.resolved
      ? proposal?.state.resolved.endTs
      : proposal?.state.voting?.startTs.add(
          resolution.settings.nodes.find(
            (node) => typeof node.offsetFromStartTs !== "undefined"
          ).offsetFromStartTs.offset
        ));

  const votingResults = useMemo(() => {
    const totalVotes: BN = proposal?.choices.reduce(
      (acc, { weight }) => weight.add(acc) as BN,
      new BN(0)
    );

    const results = proposal?.choices
      .map((r, index) => ({
        ...r,
        index,
        percent: totalVotes?.isZero()
          ? 100 / proposal?.choices.length
          : (r.weight.toNumber() / totalVotes.toNumber()) * 100,
      }))
      .sort((a, b) => b.percent - a.percent);
    return { results, totalVotes };
  }, [proposal?.choices]);

  return (
    <VoteCard
      href={`/${network}/proposals/${proposalKey.toBase58()}`}
      name={name}
      tags={tags || []}
      endTs={endTs?.toNumber()}
      id={id.toBase58()}
      results={
        // Hide results while voting in progress
        Object.keys(state)[0] === "voting" ? undefined : votingResults?.results
      }
      totalVotes={totalVotes}
      decimals={decimals}
    />
  );
};
