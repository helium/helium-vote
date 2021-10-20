import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  fetchResults,
  fetchCurrentHeight,
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
import VoteResultsTable from "../components/VoteResultsTable";
import VoteResults from "../components/VoteResults";
import { redis } from "../utils/redis";
import client from "../data/client";
import classNames from "classnames";

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
    author,
    deadline,
    name,
    link,
    description,
    outcomes: outcomesInitial,
  } = details;

  // to give each one an index so the colour code stays consistent, but we can still sort by votes
  const outcomes = outcomesInitial.map((o, i) => ({ ...o, index: i }));

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

  const nickname = author?.nickname;

  const [blocksRemaining, setBlocksRemaining] = useState(
    initialBlocksRemaining
  );

  useEffect(() => {
    if (deadline && height)
      setBlocksRemaining(parseInt(deadline) - parseInt(height));
  }, [deadline, height]);

  return (
    <Page>
      <div
        className={classNames(
          "h-6 sm:h-8 top-0 fixed w-full flex items-center justify-center text-xs sm:text-sm font-sans font-normal",
          {
            "bg-hv-green-500 text-black": !completed,
            "bg-hv-blue-700 text-white": completed,
          }
        )}
      >
        Voting {completed ? "has Closed" : "is Open"}
      </div>
      <Head>
        <title>{name}</title>
        <link rel="icon" href="/favicon.png" />
        <meta property="og:title" content={name} />
        <meta property="og:site_name" content="Helium Vote" />
        <meta property="og:url" content="https://heliumvote.com" />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://heliumvote.com/images/og.png"
        />
      </Head>
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
            <h2 className="text-3xl sm:text-6xl font-sans text-white font-semibold tracking-tighter">
              {name}
            </h2>
            <div>
              {nickname !== undefined && (
                <div className="pt-5">
                  <p className="text-sm text-white text-md">
                    Author:{" "}
                    <span className="text-hv-green-500">{nickname}</span>
                  </p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-between align-start mt-5">
                <p className="font-sans max-w-md break-words text-md leading-tight tracking-tight text-hv-gray-300">
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
                  {votingResults?.totalUniqueWallets?.toLocaleString()}
                </p>
              </div>
            </>
          )}
        </div>
      </ContentSection>

      {!completed && <VoteOptionsSection outcomes={outcomes} />}

      {votingResults.outcomesResults?.length > 0 && (
        <div className="">
          <div className="flex flex-col space-y-2 max-w-5xl mx-auto mt-5 px-4 sm:px-10">
            <div className="flex-col space-y-2 mt-10 sm:mt-16">
              <VoteResults
                outcomes={outcomes}
                completed={completed}
                votingResults={votingResults}
              />
              {/* <VoteResultsTable votingResults={votingResults} /> */}
              <div className="flex flex-col items-end justify-start pt-2">
                <span className="text-sm font-light text-gray-500 font-sans">
                  Last updated {formatDistanceToNow(results.timestamp)} ago
                </span>
                <span className="font-light text-xs text-gray-600">
                  (Results recalculate every 10 minutes)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
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

  const { height } = await fetchCurrentHeight();
  const details = await fetchVoteDetails(voteid);

  const { deadline } = details;
  const completed = height > deadline;
  const blocksRemaining = deadline - height;

  const { time: finalBlockTime } = completed
    ? await client.blocks.get(deadline)
    : { time: null };

  const getLatest = async (voteid) => {
    // just fetch the latest cache instead of recalculating
    const value = await redis.get(voteid);
    if (!value) return null;
    return JSON.parse(value);
  };

  const results = completed
    ? await getLatest(voteid)
    : await fetchResults(voteid);

  // revalidate: 1 means it will check at most every 1 second if the Redis cache has reached 10 minutes old yet. if not, it'll serve the statically saved version of the latest Redis cache. so it'll only call calculateResults() at most once every 10 minutes, and it'll do it in the background with getStaticProps so it won't slow down for the unlucky first visitor after the 10 minute threshold is crossed.
  return {
    props: {
      fallback: { results, height },
      blocksRemaining,
      completed,
      finalBlockTime,
      details,
    },
    revalidate: 10,
  };
}

export default VoteDetailsPage;
