import * as anchor from "@coral-xyz/anchor";
import { useProposal, useProposalConfig, useResolutionSettings } from "@helium/modular-governance-hooks";
import { init } from "@helium/proposal-sdk";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import classNames from "classnames";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useAsync } from "react-async-hook";
import ReactMarkdown from "react-markdown";
import ContentSection from "../components/ContentSection";
import CopyableText from "../components/CopyableText";
import MetaTags from "../components/MetaTags";
import Page from "../components/Page";
import VoteOptionsSection from "../components/VoteOptionsSection";
import VoteResults from "../components/VoteResults";
import { fetchVotes } from "../data/votes";

const VoteDetailsPage = ({
  name: initName,
}: {
  name: string,
}) => {
  const router = useRouter();
  const { proposalKey } = router.query;

  const proposalK = useMemo(() => new PublicKey(proposalKey), [proposalKey]);
  const { info: proposal } = useProposal(
    proposalK,
  );
  const { tags, choices = [], state, uri, proposalConfig: proposalConfigKey } = proposal || {};
  const name = proposal?.name || initName;
  const { info: proposalConfig } = useProposalConfig(proposalConfigKey);
  const { info: resolution } = useResolutionSettings(proposalConfig?.stateController);

  const { result: content } = useAsync(async (uri: string) => {
    const res = await fetch(uri);
    return res.text();
  }, [uri])

  const endTs =
    resolution &&
    // @ts-ignore
    state.voting.startTs.add(
      resolution.settings.nodes.find(
        (node) => typeof node.offsetFromStartTs !== "undefined"
      ).offsetFromStartTs.offset
    );

  const votingResults = useMemo(() => {
    const totalVotes: BN = choices.reduce(
      (acc: BN, { weight }) => weight.add(acc) as BN,
      new BN(0)
    );

    const results = choices
      .map((r, index) => ({
        ...r,
        index,
        percent: totalVotes?.isZero()
          ? 100 / choices.length
          : (r.weight.toNumber() / totalVotes.toNumber()) * 100,
      }))
      .sort((a, b) => b.percent - a.percent);
    return { results, totalVotes };
  }, [choices]);

  const completed = endTs?.toNumber() <= (Date.now().valueOf() / 1000);

  const twitterUrl = useMemo(() => {
    const url = new URL("https://twitter.com/intent/tweet");
    const voteURL = `https://heliumvote.com/${proposalKey}`;

    url.searchParams.append(
      "text",
      completed
        ? `Voting for ${name} is closed. What did The People's Network think?`
        : `Share your thoughts on ${name}. Vote now, the deadline is ${new Date(endTs?.toNumber() * 1000)?.toLocaleString()}.`
    );
    url.searchParams.append("url", voteURL);

    return url;
  }, [proposalKey]);

  return (
    <Page>
      <MetaTags
        title={name}
        description={"Vote on " + name}
        url={`https://heliumvote.com/${proposalKey}`}
      />
      <div
        className={classNames(
          "h-6 sm:h-8 top-0 fixed w-full flex items-center justify-center text-xs sm:text-sm font-sans font-normal z-30",
          {
            "bg-hv-green-500 text-black": !completed,
            "bg-hv-blue-500 text-white": completed,
          }
        )}
      >
        Voting {completed ? "has Closed" : "is Open"}
      </div>
      <ContentSection className="pt-10 sm:pt-0">
        <div className="mb-5 sm:mb-10">
          <Link
            href="/"
            className="text-hv-gray-200 hover:text-hv-gray-300 outline-none border border-solid border-hv-green-500 border-opacity-0 focus:border-opacity-100 transition-all duration-200 rounded-sm"
          >
            {"<- "}Back to Votes
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="flex-col space-y-2">
            {tags && (
              <div className="flex flex-row items-center justify-start space-x-2 pb-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="py-0.5 px-2 mx-1 bg-white rounded-lg"
                  >
                    <span className="text-xs sm:text-sm text-hv-gray-1100 font-reg">
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row mt-5">
              <ReactMarkdown className="prose grow prose-dark whitespace-pre-wrap leading-snug">
                {content}
              </ReactMarkdown>

              <div className="flex-none mt-4 sm:mt-0">
                {uri && (
                  <a
                    href={uri}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex items-center justify-between px-3 py-2 bg-hv-gray-475 hover:bg-hv-gray-500 transition-all duration-100 rounded-lg w-min outline-none border border-solid border-transparent focus:border-hv-green-500"
                  >
                    <span className="text-sm text-hv-green-500 whitespace-nowrap pr-10">
                      More Details
                    </span>
                    <img
                      className="w-4 h-4 mr-4"
                      src="/images/external-link.svg"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection className="mt-4 sm:mt-14">
        <div className="bg-hv-gray-775 rounded-xl p-5 flex flex-col lg:flex-row justify-between space-y-2 lg:space-y-0 align-center w-full">
          {!completed ? (
            <>
              <div className="sm:pr-20">
                <p className="text-white">Total Weight</p>
                <p className="text-hv-gray-300">
                  {votingResults?.totalVotes?.toLocaleString()}
                </p>
              </div>
            </>
          ) : (
            <>
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
                  {votingResults?.totalVotes?.toLocaleString()}
                </p>
              </div>
            </>
          )}
        </div>
      </ContentSection>
      <ContentSection>
        {tags && tags.includes("Temp Check") && (
          <div className="border-solid border-2 border-yellow-400 bg-yellow-400 rounded-lg mt-10 leading-none">
            <div className="py-2 px-4">
              <span className="text-xs sm:text-sm text-black font-bold">
                Temperature Check
              </span>
              <span className="text-xs sm:text-sm text-black font-light">
                {" "}
                This vote acts as a check in order to gauge community sentiment.
              </span>
            </div>
          </div>
        )}
      </ContentSection>

      {!completed && <VoteOptionsSection outcomes={votingResults?.results} />}

      {votingResults.results?.length > 0 && (
        <div className="flex flex-col space-y-2 max-w-5xl mx-auto mt-5 px-4 sm:px-10">
          <div className="flex-col space-y-2 mt-10 sm:mt-16">
            <VoteResults
              completed={completed}
              outcomes={votingResults.results}
            />
          </div>
        </div>
      )}

      <ContentSection className="mt-10 sm:mt-14">
        <div className="bg-hv-gray-775 rounded-xl px-4 sm:px-7 py-4 sm:py-7 flex flex-row justify-between align-center w-full">
          <p className="text-lg sm:text-2xl text-white font-semibold tracking-tighter">
            Share this Vote
          </p>
          <div className="flex flex-row items-center justify-center space-x-4">
            <a
              href={twitterUrl.toString()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="28"
                height="23"
                viewBox="0 0 28 23"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 sm:w-5 sm:h-5 text-hv-gray-375 transition-all duration-100 hover:text-white"
              >
                <g clipPath="url(#clip0_7:320)">
                  <path
                    d="M8.84047 22.5781C19.3368 22.5781 25.0764 14.1842 25.0764 6.90554C25.0764 6.66713 25.0714 6.42979 25.0603 6.19352C26.1745 5.41598 27.143 4.44568 27.9067 3.34113C26.8843 3.77983 25.784 4.07517 24.6297 4.20834C25.8079 3.52639 26.7124 2.44761 27.1391 1.16156C26.0365 1.7925 24.8155 2.25108 23.5155 2.49862C22.4742 1.4279 20.9917 0.758301 19.3501 0.758301C16.1989 0.758301 13.6433 3.22515 13.6433 6.26601C13.6433 6.69827 13.6934 7.11872 13.7913 7.52198C9.04854 7.29162 4.84312 5.09971 2.02894 1.76673C1.53886 2.58078 1.25628 3.52638 1.25628 4.53535C1.25628 6.44643 2.26369 8.13359 3.79566 9.12055C2.85945 9.09262 1.97999 8.84454 1.21122 8.43161C1.21038 8.45473 1.21038 8.47726 1.21038 8.50196C1.21038 11.1696 3.17736 13.397 5.7885 13.9017C5.30899 14.0279 4.80445 14.0956 4.28378 14.0956C3.91664 14.0956 3.55896 14.0607 3.21129 13.9962C3.93778 16.1849 6.04439 17.7776 8.54205 17.8222C6.58898 19.2999 4.12858 20.18 1.45458 20.18C0.994546 20.18 0.540071 20.1547 0.0933838 20.1037C2.61886 21.6663 5.61772 22.5781 8.84076 22.5781"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_7:320">
                    <rect
                      width="28"
                      height="22"
                      fill="currentColor"
                      transform="translate(0 0.668213)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </a>
            <div className="cursor-pointer flex items-center justify-center">
              <CopyableText
                iconClasses="w-4 h-4 sm:w-5 sm:h-5"
                customIcon={
                  <svg
                    width="20"
                    height="23"
                    viewBox="0 0 20 23"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 sm:w-5 sm:h-5 text-hv-gray-375 transition-all duration-100 hover:text-white"
                  >
                    <path
                      d="M14.1199 0.0947266H2.11987C1.01987 0.0947266 0.119873 0.994727 0.119873 2.09473V16.0947H2.11987V2.09473H14.1199V0.0947266ZM17.1199 4.09473H6.11987C5.01987 4.09473 4.11987 4.99473 4.11987 6.09473V20.0947C4.11987 21.1947 5.01987 22.0947 6.11987 22.0947H17.1199C18.2199 22.0947 19.1199 21.1947 19.1199 20.0947V6.09473C19.1199 4.99473 18.2199 4.09473 17.1199 4.09473ZM17.1199 20.0947H6.11987V6.09473H17.1199V20.0947Z"
                      fill="currentColor"
                    />
                  </svg>
                }
                textToCopy={`https://heliumvote.com/${proposalKey}`}
              ></CopyableText>
            </div>
          </div>
        </div>
      </ContentSection>
    </Page>
  );
};

export async function getStaticPaths() {
  const votes = fetchVotes();

  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { proposalKey } = params;
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const proposalSdk = await init(provider);
  const proposal = await proposalSdk.account.proposalV0.fetch(proposalKey)

  return {
    props: {
      name: proposal.name,
    },
    revalidate: 10 * 60,
  };
}

export default VoteDetailsPage;
