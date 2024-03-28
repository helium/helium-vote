"use client";

import { ProposalState, ProposalV0 } from "@/lib/types";
import { getDerivedProposalState } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useMint } from "@helium/helium-react-hooks";
import {
  useProposalConfig,
  useResolutionSettings,
} from "@helium/modular-governance-hooks";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import BN from "bn.js";
import MarkdownIt from "markdown-it";
import React, { FC, useMemo } from "react";
import { useAsync } from "react-async-hook";
import { VoteCard, VoteCardSkeleton } from "./VoteCard";

const markdownParser = MarkdownIt();

export const ProposalCard: FC<{
  proposal: ProposalV0;
  proposalKey: PublicKey;
}> = ({ proposal, proposalKey }) => {
  const { mint, network } = useGovernance();
  const decimals = useMint(mint)?.info?.decimals;
  const { proposalConfig: proposalConfigKey } = proposal;
  const { info: proposalConfig } = useProposalConfig(proposalConfigKey);
  const { info: resolution } = useResolutionSettings(
    proposalConfig?.stateController
  );

  const derivedState = getDerivedProposalState(proposal);

  const {
    error: descError,
    loading: descLoading,
    result: desc,
  } = useAsync(async () => {
    if (proposal && proposal.uri) {
      const { data } = await axios.get(proposal.uri);
      const htmlContent = markdownParser.render(data);
      const firstParagraphMatch = htmlContent.match(/<p>(.*?)<\/p>/i);
      return firstParagraphMatch
        ? firstParagraphMatch[0].replace(/<[^>]+>/g, "")
        : "No description found for this proposal.";
    }
  }, [proposal]);

  const endTs =
    resolution &&
    (proposal?.state.resolved
      ? proposal?.state.resolved.endTs
      : proposal?.state.voting?.startTs.add(
          resolution.settings.nodes.find(
            (node) => typeof node.offsetFromStartTs !== "undefined"
          )?.offsetFromStartTs?.offset ?? new BN(0)
        ));

  const votingResults = useMemo(() => {
    const totalVotes: BN = [...(proposal?.choices || [])].reduce(
      (acc, { weight }) => weight.add(acc) as BN,
      new BN(0)
    );

    const results = proposal?.choices
      .map((r, index) => ({
        ...r,
        index,
        percent: totalVotes?.isZero()
          ? 100 / proposal?.choices.length
          : // Calculate wi
            r.weight.mul(new BN(10000)).div(totalVotes).toNumber() *
            (100 / 10000),
      }))
      .sort((a, b) =>
        a.percent < b.percent ? -1 : a.percent > b.percent ? 1 : 0
      );
    return { results, totalVotes };
  }, [proposal]);

  const isCanclled = derivedState === "cancelled";
  const isLoading = useMemo(
    () => descLoading || (!isCanclled && !endTs),
    [descLoading, isCanclled, endTs]
  );
  if (isLoading) return <VoteCardSkeleton />;

  return (
    <VoteCard
      href={`${network}/proposals/${proposalKey.toBase58()}`}
      tags={proposal?.tags}
      name={proposal?.name}
      description={desc}
      results={votingResults?.results}
      finalResult={derivedState as ProposalState}
      endTs={endTs?.toNumber() || 0}
      totalVotes={votingResults?.totalVotes || 0}
      decimals={decimals}
      state={derivedState as ProposalState}
    />
  );
};
