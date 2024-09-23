"use client";

import { useProposalInfo } from "@/hooks/useProposalInfo";
import { humanReadable } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { Separator } from "@radix-ui/react-separator";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import classNames from "classnames";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { FC, useMemo } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  FaArrowLeft,
  FaCopy,
  FaDiscord,
  FaGithub,
  FaXTwitter,
} from "react-icons/fa6";
import {
  IoStopwatchOutline,
  IoFlagOutline,
  IoFlashOutline,
} from "react-icons/io5";
import { toast } from "sonner";
import { ContentSection } from "./ContentSection";
import { CountdownTimer } from "./CountdownTimer";
import { Markdown } from "./Markdown";
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
    <Skeleton className="flex flex-row flex-shrink-0 w-full h-12 rounded-none bg-slate-850" />
    <ContentSection className="md:py-8 max-md:!px-0 max-sm:!px-0">
      <div className="flex flex-row gap-4 justify-center">
        <div className="flex flex-col gap-4 w-7/12 max-md:w-full">
          <Card className="p-2 rounded-none md:rounded-md bg-slate-850">
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
        </div>
        <div className="flex flex-col gap-4 w-3/12 max-md:hidden">
          <Card className="flex flex-col gap-2 p-2 rounded-none md:rounded-md bg-slate-950/40">
            <Skeleton className="w-7 h-7 bg-background rounded-full" />
            <Skeleton className="w-full h-7 bg-background rounded-sm" />
            <Skeleton className="w-8/12 h-7 bg-background rounded-sm" />
          </Card>
          <Card className="flex flex-col gap-2 p-2 rounded-none md:rounded-md bg-slate-950/40">
            <Skeleton className="w-7 h-7 bg-background rounded-full" />
            <Skeleton className="w-full h-7 bg-background rounded-sm" />
            <Skeleton className="w-8/12 h-7 bg-background rounded-sm" />
          </Card>
          <div className="flex flex-row gap-2"></div>
        </div>
      </div>
    </ContentSection>
  </>
);

const ProposalHipBlurb: FC<{ network: string }> = ({ network }) => (
  <div className="flex flex-col p-3 rounded-md gap-3 bg-slate-950/40">
    <div className="relative size-10">
      <Image alt={`ve${network}`} src={`/images/ve${network}.svg`} fill />
    </div>
    <p className="text-xs">
      This HIP affects the {network.toUpperCase()} network which requires ve
      {network.toUpperCase()} positions for vote participation.
    </p>
    <Link href={`/${network}/positions`} className="underline text-xs">
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
  <div className="flex flex-col p-3 rounded-md gap-2 bg-slate-950/40">
    <div className="flex gap-2">
      <IoFlagOutline className="size-5 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">
          {timeExpired ? "DATE OCCURRED" : "DEADLINE"}
        </p>
        <p className="font-normal text-xs">
          {format(new Date((endTs?.toNumber() || 0) * 1000), "PPp")}
        </p>
      </div>
    </div>
    {!timeExpired && !isCancelled ? (
      <>
        <Separator className="my-1 h-[1px] bg-slate-500" />
        <div className="flex gap-2">
          <IoStopwatchOutline className="size-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">EST. TIME REMAINING</p>
            <div className="text-xs">
              <CountdownTimer endTs={endTs?.toNumber()} />
            </div>
          </div>
        </div>
      </>
    ) : null}
    {totalVotes && (
      <>
        <Separator className="my-1 h-[1px] bg-slate-500" />
        <div className="flex gap-2">
          <IoFlashOutline className="size-5 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">TOTAL veTOKENS</p>
            <p className="font-normal text-xs">
              {humanReadable(totalVotes, decimals)}
            </p>
          </div>
        </div>
      </>
    )}
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
    <div className="flex flex-row gap-2">
      <Link
        href="https://discord.com/invite/helium"
        rel="noopener noreferrer"
        target="_blank"
        className="flex flex-1"
      >
        <Button
          variant="secondary"
          size="sm"
          className="flex-grow bg-slate-950/40 hover:bg-slate-950/70"
        >
          <FaDiscord className="size-5" />
        </Button>
      </Link>
      {githubUrl && (
        <Link
          href={githubUrl}
          rel="noopener noreferrer"
          target="_blank"
          className="flex flex-1"
        >
          <Button
            variant="secondary"
            size="sm"
            className="flex-grow bg-slate-950/40 hover:bg-slate-950/70"
          >
            <FaGithub className="size-5" />
          </Button>
        </Link>
      )}
      {twitterUrl && !isCancelled && (
        <Link
          href={twitterUrl.toString()}
          rel="noopener noreferrer"
          target="_blank"
          className="flex flex-1"
        >
          <Button
            variant="secondary"
            size="sm"
            className="flex-grow bg-slate-950/40 hover:bg-slate-950/70"
          >
            <FaXTwitter className="size-4" />
          </Button>
        </Link>
      )}
      <div className="flex flex-1">
        <CopyToClipboard
          text={`https://heliumvote.com/${network}/proposals/${proposalKey}`}
          onCopy={() => toast("Link copied to clipboard")}
        >
          <Button
            variant="secondary"
            size="sm"
            className="flex-grow bg-slate-950/40 hover:bg-slate-950/70"
          >
            <FaCopy className="size-4" />
          </Button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export const Proposal: FC<{
  name: string;
  content: string;
  proposalKey: string;
}> = ({ name: initName, content, proposalKey }) => {
  const { connected, connecting } = useWallet();
  const { network } = useGovernance();
  const pKey = useMemo(() => new PublicKey(proposalKey), [proposalKey]);
  const {
    voted,
    completed,
    isCancelled,
    noVotingPower,
    timeExpired,
    isLoading,
    votingResults,
    proposal,
    decimals,
    endTs,
  } = useProposalInfo(pKey);

  const name = proposal?.name || initName;

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

  if (connecting || isLoading)
    return (
      <div className="flex flex-col w-full h-full bg-slate-900">
        <ProposalSkeleton />
      </div>
    );

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
      <div className="flex flex-col w-full h-full bg-slate-900">
        <ContentSection className="py-12 max-md:py-0 max-md:!px-0 max-sm:!px-0">
          <div className="flex flex-row w-full gap-4 justify-center">
            <div className="flex flex-col gap-4 max-md:gap-0 w-7/12 max-md:w-full">
              <Card className="flex flex-col p-2 rounded-md max-md:rounded-none bg-slate-850">
                <CardHeader className="flex gap-2">
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
                <CardContent className="flex flex-col gap-4">
                  <div className="flex flex-row gap-4">
                    <div className="flex flex-col w-full">
                      {!completed && !connected && (
                        <div className="flex flex-grow w-full p-3 rounded-sm bg-slate-500 items-center justify-between">
                          Please connect a wallet to participate.
                          <WalletConnectButton className="h-10 rounded-md px-3" />
                        </div>
                      )}
                      {connected && noVotingPower && !completed && (
                        <div className="flex flex-col p-3 rounded-sm bg-slate-500">
                          <p>
                            No voting power detected. This HIP affects the{" "}
                            {network.toUpperCase()} network which requires ve
                            {network.toUpperCase()} positions for vote
                            participation.
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
                      {connected &&
                        !noVotingPower &&
                        !completed &&
                        proposal &&
                        votingResults && (
                          <VoteOptions
                            choices={votingResults.results}
                            maxChoicesPerVoter={proposal!.maxChoicesPerVoter}
                            proposalKey={pKey}
                          />
                        )}
                      {(completed || (connected && !noVotingPower && voted)) &&
                        votingResults &&
                        votingResults?.totalVotes.gt(new BN(0)) && (
                          <div className="flex-col gap-2 mt-6">
                            <VoteResults
                              results={votingResults.results}
                              decimals={decimals}
                            />
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="hidden max-md:flex flex-col gap-4 px-4 bg-slate-850">
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
              {!isCancelled && completed && (
                <Card className="flex flex-grow px-6 py-4 rounded-md max-md:rounded-none bg-slate-850">
                  <VoteBreakdown proposalKey={pKey} />
                </Card>
              )}
              <Card className="flex flex-grow px-6 rounded-md max-md:rounded-none bg-slate-850">
                <Markdown initialExpanded={completed}>
                  {content.replace(name, "")}
                </Markdown>
              </Card>
            </div>
            <div className="flex flex-col gap-4 w-3/12 max-md:hidden">
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
        </ContentSection>
      </div>
    </>
  );
};
