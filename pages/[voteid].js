import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  calculateResults,
  fetchCurrentHeight,
  fetchVoteDetails,
  fetchVotes,
} from "../data/votes";
import Page from "../components/Page";
import ContentSection from "../components/ContentSection";
import classNames from "classnames";
import { addMinutes, formatDistanceToNow } from "date-fns";
import VoteOption from "../components/VoteOption";
import VoteDetailField from "../components/VoteDetailField";
import cache from "../utils/cache";
import { Balance, CurrencyType } from "@helium/currency";

const VoteDetailsPage = ({ results, height, details }) => {
  const router = useRouter();
  const { voteid } = router.query;

  const { outcomes: outcomesResults, timestamp: resultsTimestamp } = results;
  const votingResults = outcomesResults
    .sort((a, b) => a.hntVoted - b.hntVoted)
    .map((r) => ({
      ...r,
      hntVoted: new Balance(r.hntVoted, CurrencyType.networkToken),
    }));

  const { id, pollster, deadline, name, link, description, outcomes } = details;

  const [humanizedDeadline, setHumanizedDeadline] = useState("");
  const [blocksRemaining, setBlocksRemaining] = useState(0);

  useEffect(() => {
    if (deadline && height)
      setBlocksRemaining(parseInt(deadline) - parseInt(height));
  }, [deadline, height]);

  useEffect(() => {
    if (blocksRemaining !== 0) {
      const now = new Date(Date.now());
      const string =
        blocksRemaining > 0
          ? formatDistanceToNow(addMinutes(now, parseInt(blocksRemaining)))
          : "Voting closed";

      setHumanizedDeadline(string);
    }
  }, [deadline, height, blocksRemaining]);

  const [expandedId, setExpandedId] = useState(null);

  const handleExpandClick = (id) => {
    setExpandedId(id);
  };

  return (
    <Page>
      <ContentSection flatBottom>
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
            value={`${blocksRemaining.toLocaleString()}`}
            label="Blocks Remaining Until Deadline"
          />
          <VoteDetailField
            value={humanizedDeadline}
            label="Estimated Time Until Deadline"
          />
        </div>
      </ContentSection>
      <div className="flex flex-col space-y-2 max-w-5xl mx-auto mt-5">
        <div className="flex-col space-y-2">
          <div>
            <p className="text-xs font-light text-gray-500 font-sans pb-2">
              Outcomes
            </p>
            <div className="w-full space-y-2">
              {outcomes?.map((o) => (
                <VoteOption
                  key={o.address}
                  outcome={o}
                  expandedId={expandedId}
                  handleExpandClick={handleExpandClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {votingResults?.length > 0 && (
        <div className="flex flex-col space-y-2 max-w-5xl mx-auto mt-5">
          <div className="flex-col space-y-2">
            <div>
              <p className="text-xs font-light text-gray-500 font-sans pb-2">
                Results
              </p>
              <div className="w-full bg-white bg-opacity-5 rounded-xl p-4">
                <div className="grid grid-cols-12">
                  {votingResults.map((r) => {
                    return (
                      <React.Fragment key={r.value}>
                        <div className="text-white text-md col-span-4">
                          {r.value}
                        </div>
                        <div className="text-white text-md col-span-8">
                          {r.hntVoted.toString(2)}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
                <p className="text-xs font-light text-gray-500 font-sans pt-2">
                  Last updated {formatDistanceToNow(resultsTimestamp)} ago
                  (refreshes every 10 minutes)
                </p>
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
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { voteid } = params;

  const height = await fetchCurrentHeight();
  const details = await fetchVoteDetails(voteid);

  const results = await cache.fetch(
    // the key to look for in the Redis cache
    voteid,
    // the function to call if the key is either not there, or the data is expired
    () => calculateResults(voteid),
    // the time until the data expires (in seconds)
    60 * 10
  );

  return { props: { results, height, details }, revalidate: 10 };
}

export default VoteDetailsPage;
