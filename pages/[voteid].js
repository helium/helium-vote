import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import {
  fetchResults,
  fetchCurrentHeight,
  fetchVoteDetails,
  fetchVotes,
  calculateResults,
} from "../data/votes";
import Page from "../components/Page";
import ContentSection from "../components/ContentSection";
import { format, formatDistanceToNow } from "date-fns";
import VoteDetailField from "../components/VoteDetailField";
import { Balance, CurrencyType } from "@helium/currency";
import useSWR from "swr";
import CountdownTimer from "../components/CountdownTimer";
import VoteOptionsSection from "../components/VoteOptionsSection";
import VoteResultsTable from "../components/VoteResultsTable";
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

  useEffect(() => {
    const testFunc = async () => {
      const test = await calculateResults(voteid);
      console.log(test);
    };
    testFunc();
  }, [voteid]);

  const {
    data: { height },
  } = useSWR("/api/height", fetcher, {
    fallbackData: fallback.height,
  });

  const votingResults = useMemo(() => {
    if (!results) return [];

    const { outcomes: outcomesResults } = results;
    return outcomesResults
      .sort((a, b) => b.hntVoted - a.hntVoted)
      .map((r) => ({
        ...r,
        hntVoted: new Balance(r.hntVoted, CurrencyType.networkToken),
      }));
  }, [results]);

  const { id, pollster, deadline, name, link, description, outcomes } = details;

  const [blocksRemaining, setBlocksRemaining] = useState(
    initialBlocksRemaining
  );

  useEffect(() => {
    if (deadline && height)
      setBlocksRemaining(parseInt(deadline) - parseInt(height));
  }, [deadline, height]);

  return (
    <Page>
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
      <ContentSection flatBottom first>
        <div className="flex flex-col">
          <div className="flex-col space-y-2">
            <VoteDetailField value={name} title label="Vote Title" />
            <VoteDetailField value={description} label="Description" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <VoteDetailField value={id} label="Vote ID" small />
              {pollster !== undefined && (
                <VoteDetailField value={pollster} label="Pollster" small />
              )}
            </div>
          </div>
          <div className="mt-5">
            <a
              href={link}
              rel="noopener noreferrer"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 bg-gray-700 hover:bg-gray-600 transition-all duration-100 rounded-lg w-min outline-none border border-solid border-transparent focus:border-hv-blue-500"
            >
              <span className="text-sm text-hv-blue-500 whitespace-nowrap pr-2">
                More details
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-hv-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </ContentSection>

      <ContentSection flatTop>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <VoteDetailField
            value={`Block ${deadline?.toLocaleString()}`}
            label="Deadline"
          />
          <VoteDetailField
            className={classNames({ "sm:col-span-2": completed })}
            value={
              completed
                ? `Voting closed at ${format(
                    finalBlockTime * 1000,
                    "h:mm:ss aaa"
                  )} on ${format(finalBlockTime * 1000, "MMMM do, y")}`
                : `${blocksRemaining.toLocaleString()}`
            }
            label="Blocks Remaining Until Deadline"
          />
          {!completed && (
            <VoteDetailField
              value={
                <CountdownTimer
                  blocksRemaining={blocksRemaining}
                  key={blocksRemaining}
                />
              }
              label="Estimated Time Until Deadline"
            />
          )}
        </div>
      </ContentSection>

      {!completed && <VoteOptionsSection outcomes={outcomes} />}

      {votingResults?.length > 0 && (
        <div className="mx-2.5 sm:mx-0">
          <div className="flex flex-col space-y-2 max-w-5xl mx-auto mt-5">
            <div className="flex-col space-y-2">
              <div>
                <p className="text-xs font-light text-gray-500 font-sans pb-2">
                  Results
                </p>
                <VoteResultsTable votingResults={votingResults} />
                <div className="flex flex-col sm:flex-row items-end justify-start pt-2">
                  <span className="text-sm font-light text-gray-500 font-sans">
                    Last updated {formatDistanceToNow(results.timestamp)} ago
                  </span>
                  <span className="font-light text-xs text-gray-600 pl-0 sm:pl-2">
                    (Results recalculate every 10 minutes)
                  </span>
                </div>
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

  const results = completed ? await getLatest(voteid) : await getLatest(voteid);
  // : await fetchResults(voteid);

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
