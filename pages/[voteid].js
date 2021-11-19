import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  fetchCurrentHeight,
  fetchResults,
  fetchVoteDetails,
  fetchVotes,
} from "../data/votes";
import Page from "../components/Page";
import ContentSection from "../components/ContentSection";
import { format, formatDistanceToNow } from "date-fns";
import { Balance, CurrencyType } from "@helium/currency";
import useSWR from "swr";
import CountdownTimer from "../components/CountdownTimer";
import VoteOptionsSection from "../components/VoteOptionsSection";
import VoteResults from "../components/VoteResults";
import client from "../data/client";
import classNames from "classnames";
import CopyableText from "../components/CopyableText";
import MetaTags from "../components/MetaTags";
import { getBackgroundColor } from "../utils/colors";

const fetcher = (url) => fetch(url).then((r) => r.json());

const VoteDetailsPage = ({
  fallback,
  details,
  completed,
  finalBlockTime,
  blocksRemaining: initialBlocksRemaining,
}) => {
  const router = useRouter();
  const { voteid } = router.query;

  const { data: results } = useSWR(`/api/results/${voteid}`, fetcher, {
    fallbackData: fallback.results,
  });

  const {
    data: { height },
  } = useSWR("/api/height", fetcher, {
    fallbackData: fallback.height,
  });

  const {
    id,
    authors,
    deadline,
    name,
    tags,
    link,
    description,
    outcomes: outcomesInitial,
  } = details;

  // to give each one an index so the colour code stays consistent, but we can still sort by votes
  const outcomes = outcomesInitial?.map((o, i) => ({ ...o, index: i }));

  const votingResults = useMemo(() => {
    if (!results) return [];

    const { outcomes } = results;

    const totalUniqueWallets = outcomes.reduce(
      (acc, { uniqueWallets: votes }) => acc + votes,
      0
    );
    const totalHntVoted = outcomes.reduce(
      (acc, { hntVoted }) => acc + hntVoted,
      0
    );

    const outcomesResults = outcomes
      .map((r) => ({
        ...r,
        hntPercent:
          r.uniqueWallets === 0 ? 0 : (r.hntVoted / totalHntVoted) * 100,
        walletsPercent:
          r.uniqueWallets === 0
            ? 0
            : (r.uniqueWallets / totalUniqueWallets) * 100,
        hntVoted: new Balance(r.hntVoted, CurrencyType.networkToken),
      }))
      .sort((a, b) => b.hntVoted.floatBalance - a.hntVoted.floatBalance);
    return { totalUniqueWallets, totalHntVoted, outcomesResults };
  }, [results]);

  const [blocksRemaining, setBlocksRemaining] = useState(
    initialBlocksRemaining
  );

  useEffect(() => {
    if (deadline && height)
      setBlocksRemaining(parseInt(deadline) - parseInt(height));
  }, [deadline, height]);

  const twitterUrl = useMemo(() => {
    const url = new URL("https://twitter.com/intent/tweet");
    const voteURL = `https://heliumvote.com/${voteid}`;

    url.searchParams.append(
      "text",
      completed
        ? `Voting for ${name} is closed. What did The People's Network think?`
        : `Share your thoughts on ${name}. Are you ${outcomes[0]?.value} or ${
            outcomes[1]?.value
          }? Vote now, block deadline is ${deadline?.toLocaleString()}.`
    );
    url.searchParams.append("url", voteURL);

    return url;
  }, [voteid]);

  return (
    <Page>
      <MetaTags
        title={name}
        description={description}
        url={`https://heliumvote.com/${voteid}`}
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
          <Link href="/">
            <a className="text-hv-gray-200 hover:text-hv-gray-300 outline-none border border-solid border-hv-green-500 border-opacity-0 focus:border-opacity-100 transition-all duration-200 rounded-sm">
              {"<- "}Back to Votes
            </a>
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="flex-col space-y-2">
            {tags && (
              <div className="flex flex-row items-center justify-start space-x-2 pb-2">
                {tags?.primary && (
                  <div className="py-0.5 px-2 bg-white rounded-lg">
                    <span className="text-xs sm:text-sm text-hv-gray-1100 font-light">
                      {tags.primary}
                    </span>
                  </div>
                )}
                {tags?.secondary && (
                  <div className="py-0.5 px-2 bg-hv-gray-775 rounded-lg">
                    <span className="text-xs sm:text-sm text-hv-gray-350 font-light">
                      {tags.secondary}
                    </span>
                  </div>
                )}
              </div>
            )}
            <h2 className="text-3xl sm:text-6xl font-sans text-white font-semibold tracking-tighter">
              {name}
            </h2>
            <div>
              {authors && (
                <div className="pt-5">
                  <p className="text-sm text-white text-md">
                    {`Author${authors.length > 1 ? "s" : ""}: `}
                    {authors.map(({ nickname, link }, i, { length }) => (
                      <>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="text-hv-green-500">{nickname}</span>
                        </a>
                        {length > 1 && i + 1 !== length && (
                          <span className="text-hv-gray-200">, </span>
                        )}
                      </>
                    ))}
                  </p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-between align-start mt-5">
                <p className="font-sans max-w-lg break-words text-md leading-snug tracking-tight text-hv-gray-300">
                  {description}
                </p>
                <div className="mt-4 sm:mt-0">
                  <a
                    href={link}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentSection>

      <ContentSection className="mt-4 sm:mt-14">
        <div className="bg-hv-gray-775 rounded-xl p-5 flex flex-col lg:flex-row justify-between space-y-2 lg:space-y-0 align-center w-full">
          {!completed ? (
            <>
              <div>
                <p className="text-white">Deadline</p>
                <p className="text-hv-gray-300">
                  Block {deadline.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-white">Blocks before deadline</p>
                <p className="text-hv-gray-300">
                  {blocksRemaining.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-white">Est. Time Remaining</p>
                <p className="text-hv-gray-300">
                  <CountdownTimer
                    blocksRemaining={blocksRemaining}
                    key={blocksRemaining}
                  />
                </p>
              </div>
              <div className="sm:pr-20">
                <p className="text-white">Total Votes</p>
                <p className="text-hv-gray-300">
                  {votingResults?.totalUniqueWallets?.toLocaleString()}
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-white">Voting Closed</p>
                <p className="text-hv-gray-300">
                  Block {deadline.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-white">Blocks since vote</p>
                <p className="text-hv-gray-300">
                  {Math.abs(blocksRemaining).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-white">Vote Closed</p>
                <p className="text-hv-gray-300">{`${format(
                  finalBlockTime * 1000,
                  "MMM d, y"
                )} at ${format(finalBlockTime * 1000, "h:mm:ss aaa")}`}</p>
              </div>
              <div className="sm:pr-20">
                <p className="text-white">Total Votes</p>
                <p className="text-hv-gray-300">
                  {votingResults && votingResults.totalUniqueWallets
                    ? votingResults.totalUniqueWallets.toLocaleString()
                    : "Calculating..."}
                </p>
              </div>
            </>
          )}
        </div>
      </ContentSection>

      {!completed && <VoteOptionsSection outcomes={outcomes} />}

      {votingResults.outcomesResults?.length > 0 ? (
        <div className="flex flex-col space-y-2 max-w-5xl mx-auto mt-5 px-4 sm:px-10">
          <div className="flex-col space-y-2 mt-10 sm:mt-16">
            <VoteResults
              outcomes={outcomes}
              completed={completed}
              votingResults={votingResults}
            />
            <div className="flex flex-col items-end justify-start pt-2">
              <span className="text-sm font-light text-hv-gray-200 font-sans">
                Last updated {formatDistanceToNow(results.timestamp)} ago
              </span>
              <span className="font-light text-xs text-hv-gray-200">
                (Results recalculate roughly every 10 minutes)
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-2 max-w-5xl mx-auto mt-5 px-4 sm:px-10">
          <div className="flex-col space-y-2 mt-10 sm:mt-16">
            <div className="pt-0">
              <div className="w-full flex flex-col lg:flex-row justify-between mb-5 sm:mb-10">
                <p className="text-xl sm:text-3xl text-white font-semibold tracking-tighter">
                  Results loading...
                </p>
              </div>
              <div className="flex flex-col space-y-5">
                {outcomes.map((r, i) => {
                  const bg = r?.color ? "custom" : getBackgroundColor(i);

                  return (
                    <div
                      key={r.value}
                      className="w-full flex flex-col relative"
                    >
                      <div className="w-full rounded-xl bg-hv-gray-500 flex flex-row items-start justify-start">
                        <div
                          className={classNames("w-1.5 rounded-l-xl h-3", {
                            "bg-hv-green-500": bg === "green",
                            "bg-hv-blue-500": bg === "blue",
                            "bg-hv-purple-500": bg === "purple",
                          })}
                          style={
                            bg === "custom" ? { backgroundColor: r?.color } : {}
                          }
                        />
                        <div
                          className={classNames("h-3 rounded-r-xl", {
                            "bg-hv-green-500": bg === "green",
                            "bg-hv-blue-500": bg === "blue",
                            "bg-hv-purple-500": bg === "purple",
                          })}
                          style={
                            bg === "custom"
                              ? {
                                  backgroundColor: r?.color,
                                  width: `${1 / outcomes.length}%`,
                                }
                              : { width: `${1 / outcomes.length}%` }
                          }
                        />
                      </div>
                      <div className="w-full flex flex-col items-start lg:flex-row lg:items-center justify-between pt-1.5">
                        <h3 className="font-sans text-lg text-white font-semibold tracking-tighter">
                          <span className="flex flex-row items-center justify-start space-x-2">
                            <span>{r.value}</span>
                          </span>
                        </h3>
                        <div className="space-x-2 flex flex-col lg:flex-row">
                          <div className="text-hv-gray-400 text-lg font-light font-sans flex flex-col lg:flex-row space-x-0 lg:space-x-2">
                            <span>Loading...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <ContentSection className="mt-10 sm:mt-14">
        <div className="bg-hv-gray-775 rounded-xl px-4 sm:px-7 py-4 sm:py-7 flex flex-row justify-between align-center w-full">
          <p className="text-lg sm:text-2xl text-white font-semibold tracking-tighter">
            Share this Vote
          </p>
          <div className="flex flex-row items-center justify-center space-x-4">
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
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
                textToCopy={`https://heliumvote.com/${voteid}`}
              ></CopyableText>
            </div>
          </div>
        </div>
      </ContentSection>
    </Page>
  );
};

export async function getStaticPaths() {
  const votes = await fetchVotes();
  const paths = votes.map(({ id }) => ({ params: { voteid: id } }));

  return {
    // paths,
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  const { voteid } = params;

  // const { height } = await fetchCurrentHeight();

  const height = await client.blocks.getHeight();
  const details = await fetchVoteDetails(voteid);

  const results = await fetchResults(voteid);

  const { deadline } = details;
  const completed = height > deadline;
  const blocksRemaining = deadline - height;

  const { time: finalBlockTime } = completed
    ? await client.blocks.get(deadline)
    : { time: null };

  return {
    props: {
      fallback: {
        results,
        height,
      },
      blocksRemaining,
      completed,
      finalBlockTime,
      details,
    },
    revalidate: 60,
  };
}

export default VoteDetailsPage;
