import * as anchor from "@coral-xyz/anchor";
import { useMint } from "@helium/helium-react-hooks";
import {
  useProposal,
  useProposalConfig,
  useResolutionSettings,
} from "@helium/modular-governance-hooks";
import { init } from "@helium/proposal-sdk";
import { useRegistrar } from "@helium/voter-stake-registry-hooks";
import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import classNames from "classnames";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import ContentSection from "../../../components/ContentSection";
import MetaTags from "../../../components/MetaTags";
import Page from "../../../components/Page";
import VoteOptionsSection from "../../../components/VoteOptionsSection";
import VoteResults from "../../../components/VoteResults";
import { useNetwork } from "../../../hooks/useNetwork";
import { humanReadable } from "../../../utils/formatting";
import { VoteBreakdown } from "../../../components/VoteBreakdown";
import { SecondaryButton } from "../../../components/Button";
import { FaArrowLeft } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaRegCopy } from "react-icons/fa";
import { notify } from "../../../utils/notifications";
import { FaChevronDown } from "react-icons/fa";
import CountdownTimer from "../../../components/CountdownTimer";

const MARKDOWN_MAX = 500;

const VoteDetailsPage = ({
  name: initName,
  content,
}: {
  name: string;
  content: string;
}) => {
  const router = useRouter();
  const { proposalKey } = router.query;
  const { network } = useNetwork();

  const proposalK = useMemo(() => new PublicKey(proposalKey), [proposalKey]);
  const { info: proposal } = useProposal(proposalK);
  const {
    tags,
    choices = [],
    uri,
    proposalConfig: proposalConfigKey,
  } = proposal || {};
  const name = proposal?.name || initName;
  const { info: proposalConfig } = useProposalConfig(proposalConfigKey);
  const { info: resolution } = useResolutionSettings(
    proposalConfig?.stateController
  );
  const { info: registrar } = useRegistrar(proposalConfig?.voteController);
  const decimals = useMint(registrar?.votingMints[0].mint)?.info?.decimals;
  const [showBreakdown, setshowBreakdown] = useState(false);

  const endTs =
    resolution &&
    (proposal?.state.resolved
      ? // @ts-ignore
        proposal?.state.resolved.endTs
      : // @ts-ignore
        proposal?.state.voting?.startTs.add(
          resolution.settings.nodes.find(
            (node) => typeof node.offsetFromStartTs !== "undefined"
          ).offsetFromStartTs.offset
        ));

  const votingResults = useMemo(() => {
    const totalVotes: BN = choices.reduce(
      (acc: BN, { weight }) => weight.add(acc) as BN,
      new BN(0)
    );

    const results = choices.map((r, index) => ({
      ...r,
      index,
      percent: totalVotes?.isZero()
        ? 100 / choices.length
        : (BigInt(r.weight.toString()) / BigInt(totalVotes.toString()) * BigInt(100)),
    }));
    return { results, totalVotes };
  }, [choices]);

  const completed = endTs?.toNumber() <= Date.now().valueOf() / 1000;

  const twitterUrl = useMemo(() => {
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
  }, [proposalKey, endTs, network]);

  const copyLinkToClipboard = useCallback(() => {
    const text = `https://heliumvote.com/${network}/${proposalKey}`;
    const fallbackCopyTextToClipboard = (text) => {
      if (!document) return;
      let textArea = document.createElement("textarea");
      textArea.value = text;

      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        notify({
          type: "success",
          message: "Link copied to clipboard",
        });
      } catch (err) {
        notify({
          type: "error",
          message: "Unable to copy",
        });
      }

      document.body.removeChild(textArea);
    };
    if (!navigator.clipboard) {
      // if navigator.clipboard API isn't available
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        notify({
          type: "success",
          message: "Link copied to clipboard",
        });
      },
      function (err) {
        notify({
          type: "error",
          message: "Unable to copy",
        });
        console.error("Unable to copy", err);
      }
    );
  }, [network, proposalKey]);

  const markdownRef = useRef(null);
  const [markdownHeight, setMarkdownHeight] = useState(0);
  useEffect(() => {
    if (markdownRef.current) {
      setTimeout(() => {
        setMarkdownHeight(markdownRef.current.clientHeight);
      }, 1000);
    }
  }, [setMarkdownHeight, markdownRef]);
  const [markdownExpanded, setMarkdownExpanded] = useState(false);

  return (
    <Page className="bg-gray-800">
      <MetaTags
        title={name}
        description={"Vote on " + name}
        url={`https://heliumvote.com/${proposalKey}`}
      />
      <div
        className={classNames(
          "h-6 sm:h-8 bottom-0 fixed w-full flex items-center justify-center text-xs sm:text-sm font-sans font-normal z-30",
          {
            " text-black": !completed,
            "bg-blue-500 text-white": completed,
          }
        )}
      >
        Voting {completed ? "has Closed" : "is Open"}
      </div>
      <ContentSection className="pt-10 sm:pt-0">
        <div className="mb-5 sm:mb-10">
          <Link href={`/${network}`}>
            <SecondaryButton>
              <div className="text-white flex flex-row items-center justify-center">
                <div className="text-md mr-2">
                  <FaArrowLeft />
                </div>
                Back to Votes
              </div>
            </SecondaryButton>
          </Link>
        </div>
        <div className="rounded-lg bg-opacity-25 bg-gray-600 p-4">
          <div className="flex flex-col">
            <div className="flex-col space-y-2 relative">
              {tags && (
                <div className="flex flex-row items-center justify-start space-x-1">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="border border-gray-600 flex-col justify-center items-start px-2 mx-1 rounded-lg h-7"
                    >
                      <span className="text-gray-50 text-xs font-medium">
                        {tag}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="w-full flex flex-col mt-5 pb-5" ref={markdownRef}>
                <div
                  style={{
                    maxHeight: markdownExpanded
                      ? undefined
                      : MARKDOWN_MAX + "px",
                    overflow: "hidden",
                  }}
                >
                  <ReactMarkdown className="prose grow prose-dark whitespace-pre-wrap leading-snug clear-both">
                    {content}
                  </ReactMarkdown>
                </div>

                {markdownHeight > MARKDOWN_MAX && !markdownExpanded && (
                  <div
                    style={{ marginTop: "-8px" }}
                    className="w-full flex flex-row justify-center items-center"
                  >
                    <SecondaryButton
                      onClick={() => setMarkdownExpanded(true)}
                      className="h-8 bg-gray-800 text-xs font-bold flex flex-row items-center justify-center"
                    >
                      <div className="text-white flex flex-row items-center justify-center">
                        Show More
                        <div className="text-md ml-1">
                          <FaChevronDown />
                        </div>
                      </div>
                    </SecondaryButton>
                  </div>
                )}
              </div>
              <div className="md:absolute md:right-0 md:top-0 md:mt-1">
                <div className="mb-4 flex flex-row space-x-2 md:space-x-0 md:flex-col md:space-y-2">
                  {uri && (
                    <Link
                      className="flex-grow basis-0 shrink-0"
                      href={uri}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <SecondaryButton className="text-white w-full h-8 bg-gray-800 text-xs font-bold flex flex-row justify-center items-center px-1">
                        <div className="text-lg mr-2 md:mr-1">
                          <FaGithub />
                        </div>
                        View on Github
                      </SecondaryButton>
                    </Link>
                  )}
                  <Link
                    className="flex-grow basis-0 shrink-0"
                    href={twitterUrl.toString()}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <SecondaryButton className="w-full h-8 bg-gray-800 text-xs font-bold flex flex-row items-center justify-center px-1">
                      <div className="text-white flex flex-row items-center justify-center">
                        Share
                        <div className="text-md ml-1">
                          <FaXTwitter />
                        </div>
                      </div>
                    </SecondaryButton>
                  </Link>
                  <SecondaryButton
                    onClick={copyLinkToClipboard}
                    className="flex-grow basis-0 shrink-0 h-8 bg-gray-800 text-xs font-bold flex flex-row items-center justify-center px-1"
                  >
                    <div className="text-white flex flex-row items-center justify-center">
                      Copy
                      <div className="text-md ml-1">
                        <FaRegCopy />
                      </div>
                    </div>
                  </SecondaryButton>
                </div>
              </div>
            </div>
          </div>
          {completed && (
            <div className="w-full flex flex-col lg:flex-row justify-between mb-2 mt-8">
              <p className="text-whtie text-lg font-bold text-white tracking-tighter">
                Final Results
              </p>
            </div>
          )}

          {completed && (
            <div className="bg-gray-800 p-5 flex flex-col lg:flex-row justify-between space-y-2 lg:space-y-0 align-center w-full">
              <div>
                <p className="text-white">Vote Closed</p>
                <p className="text-hv-gray-300">{`${format(
                  endTs?.toNumber() * 1000,
                  "MMM d, y"
                )} at ${format(endTs?.toNumber() * 1000, "h:mm:ss aaa")}`}</p>
              </div>
              <div className="sm:pr-20">
                <p className="text-white">Total Votes</p>
                <p className="text-hv-gray-300">
                  {humanReadable(votingResults?.totalVotes, decimals)}
                </p>
              </div>
            </div>
          )}
          {!completed && (
            <div>
              <div className="text-white bg-gray-800 p-5 flex flex-row justify-start space-x-8 md:space-x-12 align-center w-fit">
                <div className="flex flex-col space-y-2">
                  <p className="text-gray-50 text-xs font-medium">
                    TOTAL WEIGHT
                  </p>
                  <p className="font-bold">
                    {humanReadable(votingResults?.totalVotes, decimals)}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <p className="text-gray-50 text-xs font-medium">TIME LEFT</p>
                  <div className="font-bold">
                    {endTs && (
                      <CountdownTimer
                        endTs={endTs?.toNumber()}
                        key={proposalK.toBase58()}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {completed && votingResults.results?.length > 0 && (
            <div className="flex flex-col space-y-2 mt-3">
              <VoteResults
                decimals={decimals}
                completed={completed}
                outcomes={votingResults.results}
              />
            </div>
          )}

          {!completed && (
            <VoteOptionsSection
              proposalKey={proposalK}
              outcomes={votingResults?.results}
            />
          )}

          {completed && (
            <div className="mt-12">
              <p className="mb-2 text-whtie text-lg font-bold text-white tracking-tighter tracking-tighter">
                Voter Breakdown
              </p>
              <p className="text-white mb-s">
                NOTE: For MOBILE / IOT Subnetworks this is shown as 1/10 of your
                vote weight because the underlying contracts in spl-governance
                only support 64-bits of precision.
              </p>
              {!showBreakdown && (
                <button
                  className="px-6 py-3 hover:bg-hv-gray-500 transition-all duration-200 rounded-lg text-lg text-hv-green-500 whitespace-nowrap outline-none border border-solid border-transparent focus:border-hv-green-500 mx-auto mt-4 block text-center"
                  onClick={() => setshowBreakdown(!showBreakdown)}
                >
                  Load Breakdown
                </button>
              )}
              {showBreakdown && <VoteBreakdown proposalKey={proposalK} />}
            </div>
          )}
        </div>
      </ContentSection>
    </Page>
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { proposalKey } = params;
  const provider = new anchor.AnchorProvider(
    new Connection(process.env.NEXT_PUBLIC_SOLANA_URL, "confirmed"),
    {} as any,
    {}
  );
  const proposalSdk = await init(provider);
  const proposal = await proposalSdk.account.proposalV0.fetch(
    new PublicKey(proposalKey)
  );
  const res = await fetch(proposal.uri);
  const content = await res.text();

  return {
    props: {
      name: proposal.name,
      content,
    },
    revalidate: 10 * 60,
  };
}

export default VoteDetailsPage;
