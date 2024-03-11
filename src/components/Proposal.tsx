"use client";

import { ProposalV0 } from "@/lib/types";
import { getDerivedProposalState, humanReadable } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useMint } from "@helium/helium-react-hooks";
import {
  useProposal,
  useProposalConfig,
  useResolutionSettings,
} from "@helium/modular-governance-hooks";
import { useRegistrar } from "@helium/voter-stake-registry-hooks";
import { Separator } from "@radix-ui/react-separator";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import classNames from "classnames";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useMemo, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FaArrowLeft,
  FaChevronDown,
  FaCopy,
  FaDiscord,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { ContentSection } from "./ContentSection";
import { CountdownTimer } from "./CountdownTimer";
import { VoteBreakdown } from "./VoteBreakdown";
import { VoteOptions } from "./VoteOptions";
import { VoteResults } from "./VoteResults";
import { WalletConnectButton } from "./WalletConnectButton";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const MARKDOWN_MAX = 540;

export const ProposalSkeleton = () => (
  <>
    <Skeleton className="flex flex-row flex-shrink-0 w-full h-12 rounded-none bg-card" />
    <ContentSection className="!px-0 md:py-8">
      <Card className="p-2 rounded-none md:rounded-md">
        <CardHeader className="gap-2">
          <Skeleton className="w-2/12 h-7 bg-background rounded-sm" />
          <div className="flex flex-row mb-12">
            <div className="flex flex-row mb-1 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={`tag-${i}`}
                  className="w-20 h-7 bg-background rounded-sm"
                />
              ))}
            </div>
          </div>
          <Skeleton className="w-11/12 h-14 bg-background rounded-sm" />
          {[...Array(3)].map((_, i) => (
            <div key={`content-${i}`}>
              <div className="flex flex-col gap-4 mt-8">
                <Skeleton className="w-2/12 h-10 bg-background rounded-sm" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-6/12 h-7 bg-background rounded-sm" />
                  <Skeleton className="w-5/12 h-7 bg-background rounded-sm" />
                  <Skeleton className="w-6/12 h-7 bg-background rounded-sm" />
                  <Skeleton className="w-4/12 h-7 bg-background rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </CardHeader>
      </Card>
    </ContentSection>
  </>
);

const ProposalHipBlurb: FC<{ network: string }> = ({ network }) => (
  <div className="flex flex-col p-2.5 bg-background rounded-sm gap-3">
    <div className="relative size-12">
      <Image alt={`ve${network}`} src={`/images/ve${network}.svg`} fill />
    </div>
    <p className="text-sm">
      This HIP affects the {network.toUpperCase()} network which requires ve
      {network.toUpperCase()} positions for vote participation.
    </p>
    <Link href={`/${network}/positions`} className="underline text-sm">
      Manage Voting Power
    </Link>
  </div>
);

export const ProposalBreakdown: FC<{
  timeExpired?: boolean;
  endTs?: BN;
  isCancelled?: boolean;
  totalVotes?: BN;
  decimals?: number;
}> = ({ timeExpired, endTs, isCancelled, totalVotes, decimals }) => (
  <div className="flex flex-col p-2.5 bg-background rounded-sm gap-2">
    <div className="flex flex-col gap-1">
      <p className="text-xs">{timeExpired ? "DATE OCCURED" : "DEADLINE"}</p>
      <p className="font-normal text-sm">
        {format(new Date((endTs?.toNumber() || 0) * 1000), "PPp")}
      </p>
      <Separator className="my-1 h-[1px] bg-slate-500" />
    </div>
    {!timeExpired && !isCancelled ? (
      <div className="flex flex-col gap-1">
        <p className="text-xs">EST. TIME REMAINING</p>
        <div className="text-sm">
          <CountdownTimer endTs={endTs?.toNumber()} />
        </div>
        <Separator className="my-1 h-[1px] bg-slate-500" />
      </div>
    ) : null}
    <div className="flex flex-col gap-1">
      <p className="text-xs">TOTAL veTOKENS</p>
      <p className="font-normal text-sm">
        {humanReadable(totalVotes, decimals)}
      </p>
    </div>
  </div>
);

export const ProposalSocial: FC<{
  network: string;
  proposalKey: string;
  githubUrl?: string;
  twitterUrl?: URL;
  isCancelled?: boolean;
}> = ({ network, proposalKey, githubUrl, twitterUrl, isCancelled }) => {
  return (
    <div className="flex flex-row md:flex-col gap-2">
      <Link
        href="https://discord.com/invite/helium"
        rel="noopener noreferrer"
        target="_blank"
        className="flex flex-row"
      >
        <Button variant="secondary" className="flex-grow gap-2">
          <FaDiscord className="size-5" />
          <span className="max-md:hidden">Join the Discussion</span>
        </Button>
      </Link>
      {githubUrl && (
        <Link
          href={githubUrl}
          rel="noopener noreferrer"
          target="_blank"
          className="flex flex-row"
        >
          <Button variant="secondary" className="flex-grow gap-2">
            <FaGithub className="size-5" />
            <span className="max-md:hidden">View in Github</span>
          </Button>
        </Link>
      )}
      {twitterUrl && !isCancelled && (
        <Link
          href={twitterUrl.toString()}
          rel="noopener noreferrer"
          target="_blank"
          className="flex flex-row"
        >
          <Button variant="secondary" className="flex-grow gap-2">
            <span className="max-md:hidden">Share</span>
            <FaXTwitter className="size-4" />
          </Button>
        </Link>
      )}
      <CopyToClipboard
        text={`https://heliumvote.com/${network}/proposals/${proposalKey}`}
        onCopy={() => toast("Link copied to clipboard")}
      >
        <Button variant="secondary" className="gap-2">
          <span className="max-md:hidden">Copy</span>
          <FaCopy className="size-4" />
        </Button>
      </CopyToClipboard>
    </div>
  );
};

export const Proposal: FC<{
  name: string;
  content: string;
  proposalKey: string;
}> = ({ name: initName, content, proposalKey }) => {
  const { connected, connecting } = useWallet();
  const markdownRef = useRef<HTMLDivElement>(null);
  const [markdownExpanded, setMarkdownExpanded] = useState(false);
  const { loading: loadingGov, amountLocked, network } = useGovernance();
  const pKey = useMemo(() => new PublicKey(proposalKey), [proposalKey]);
  const { loading: loadingProposal, info: proposal } = useProposal(pKey);
  const name = proposal?.name || initName;
  const { info: proposalConfig } = useProposalConfig(proposal?.proposalConfig);
  const { info: registrar } = useRegistrar(proposalConfig?.voteController);
  const decimals = useMint(registrar?.votingMints[0].mint)?.info?.decimals;
  const { info: resolution } = useResolutionSettings(
    proposalConfig?.stateController
  );

  const votingResults = useMemo(() => {
    const totalVotes: BN = [...(proposal?.choices || [])].reduce(
      (acc, { weight }) => weight.add(acc) as BN,
      new BN(0)
    );

    const results = proposal?.choices.map((r, index) => ({
      ...r,
      index,
      percent: totalVotes?.isZero()
        ? 100 / proposal?.choices.length
        : // Calculate with 4 decimals of precision
          r.weight.mul(new BN(10000)).div(totalVotes).toNumber() *
          (100 / 10000),
    }));

    return { results, totalVotes };
  }, [proposal]);

  const markdownHeight = useMemo(
    () => markdownRef.current?.clientHeight || 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [markdownRef.current]
  );

  const derivedState = useMemo(
    () => getDerivedProposalState(proposal as ProposalV0),
    [proposal]
  );

  const endTs =
    resolution &&
    (proposal?.state.resolved
      ? proposal?.state.resolved.endTs
      : proposal?.state.voting?.startTs.add(
          resolution.settings.nodes.find(
            (node) => typeof node.offsetFromStartTs !== "undefined"
          )?.offsetFromStartTs?.offset ?? new BN(0)
        ));

  const isLoading = useMemo(
    () => connecting || loadingGov || loadingProposal || !proposal,
    [connecting, loadingGov, loadingProposal, proposal]
  );
  const timeExpired = endTs && endTs.toNumber() <= Date.now().valueOf() / 1000;
  const noVotingPower = !isLoading && (!amountLocked || amountLocked.isZero());
  const isActive = derivedState === "active";
  const isCancelled = derivedState === "cancelled";
  const isFailed = derivedState === "failed";
  const completed =
    timeExpired || (timeExpired && isActive) || isCancelled || isFailed;

  const twitterUrl = useMemo(() => {
    if (endTs) {
      const url = new URL("https://twitter.com/intent/tweet");
      const voteURL = `https://heliumvote.com/${network}/proposals/${proposalKey}`;

      url.searchParams.append(
        "text",
        completed
          ? `Voting for ${name} is closed. What did The People's Network think?`
          : `Share your thoughts on ${name}. Vote now, the deadline is ${new Date(
              endTs?.toNumber() * 1000
            )?.toLocaleString()}.`
      );
      url.searchParams.append("url", voteURL);

      return url;
    }
  }, [proposalKey, endTs, network, completed, name]);

  if (isLoading) return <ProposalSkeleton />;
  return (
    <>
      <div
        className={classNames(
          "flex flex-row flex-shrink-0 w-full h-12 items-center justify-center",
          !completed && "bg-success-foreground",
          completed && !isCancelled && "bg-primary",
          isCancelled && "bg-warning-foreground"
        )}
      >
        <p className="text-foreground font-medium">
          {!isCancelled
            ? !completed
              ? "Voting is Open"
              : "Voting is Closed"
            : "Voting has been Cancelled"}
        </p>
      </div>
      <ContentSection className="py-8 max-md:py-0">
        <Card className="p-2 rounded-md max-md:rounded-none">
          <CardHeader className="gap-2">
            <Link
              href={`/${network}`}
              className="flex flex-row items-center text-sm gap-2"
            >
              <FaArrowLeft />
              Back to Votes
            </Link>
            <div className="flex flex-row">
              {proposal?.tags
                .filter((tag) => tag !== "tags")
                .map((tag, i) => (
                  <Badge
                    key={tag}
                    className={classNames(
                      "mr-1 rounded-[4px]",
                      { "bg-foreground": i === 0 },
                      {
                        "bg-transparent border-background text-foreground":
                          i > 0,
                      }
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
            </div>
            <h1>{name}</h1>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 h-full">
            <div className="flex flex-row gap-4 justify-between">
              <div className="flex flex-col w-auto lg:w-6/12 max-md:w-12/12">
                {!completed && !connected && (
                  <div className="flex flex-row p-3 rounded-sm bg-slate-500 justify-between items-center">
                    Please connect a wallet to participate.
                    <WalletConnectButton className="h-10 rounded-md px-3" />
                  </div>
                )}
                {connected && noVotingPower && !completed && (
                  <div className="flex flex-col p-3 rounded-sm bg-slate-500">
                    <p>
                      No voting power detected. This HIP affects the{" "}
                      {network.toUpperCase()} network which requires ve
                      {network.toUpperCase()} positions for vote participation.
                    </p>
                    <div>
                      <Link
                        href={`/${network}/positions`}
                        className="underline"
                      >
                        Manage Voting Power
                      </Link>
                    </div>
                  </div>
                )}
                {connected && !noVotingPower && !completed && (
                  <VoteOptions
                    choices={votingResults.results}
                    maxChoicesPerVoter={proposal!.maxChoicesPerVoter}
                    proposalKey={pKey}
                  />
                )}
                {completed && votingResults?.totalVotes.gt(new BN(0)) && (
                  <VoteResults
                    results={votingResults.results}
                    decimals={decimals}
                  />
                )}
                <div className="flex-col gap-2 mt-6 hidden max-md:flex">
                  <ProposalHipBlurb network={network} />
                  <ProposalBreakdown
                    timeExpired={timeExpired}
                    endTs={endTs}
                    isCancelled={isCancelled}
                    totalVotes={votingResults.totalVotes}
                    decimals={decimals}
                  />
                  <ProposalSocial
                    network={network}
                    proposalKey={proposalKey}
                    githubUrl={proposal?.uri}
                    twitterUrl={twitterUrl}
                    isCancelled={isCancelled}
                  />
                </div>
                <div
                  className="w-full flex flex-col mt-5 pb-5"
                  ref={markdownRef}
                >
                  <div
                    style={{
                      maxHeight:
                        markdownExpanded || !completed
                          ? undefined
                          : MARKDOWN_MAX + "px",
                      overflow: "hidden",
                    }}
                  >
                    <Markdown className="prose prose-headings:m-0 prose-headings:font-normal prose-hr:my-8 prose-p:text-foreground clear-both dark:prose-invert">
                      {content.replace(name, "")}
                    </Markdown>
                  </div>

                  {completed &&
                    markdownHeight > MARKDOWN_MAX &&
                    !markdownExpanded && (
                      <div className="w-full flex flex-row justify-center items-center bg-card py-2">
                        <Button
                          variant="secondary"
                          onClick={() => setMarkdownExpanded(true)}
                          className="gap-2 w-full md:w-auto"
                        >
                          Show More <FaChevronDown />
                        </Button>
                      </div>
                    )}
                </div>
              </div>
              <div className="flex flex-col gap-4 w-4/12 lg:w-3/12 max-md:hidden">
                <ProposalHipBlurb network={network} />
                <ProposalBreakdown
                  timeExpired={timeExpired}
                  endTs={endTs}
                  isCancelled={isCancelled}
                  totalVotes={votingResults.totalVotes}
                  decimals={decimals}
                />
                <ProposalSocial
                  network={network}
                  proposalKey={proposalKey}
                  githubUrl={proposal?.uri}
                  twitterUrl={twitterUrl}
                  isCancelled={isCancelled}
                />
              </div>
            </div>
            {!isCancelled && completed && (
              <div className="w-12/12">
                <VoteBreakdown proposalKey={pKey} />
              </div>
            )}
          </CardContent>
        </Card>
      </ContentSection>
    </>
  );
};
