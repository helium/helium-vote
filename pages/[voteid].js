import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  calculateResults,
  fetchCurrentHeight,
  fetchVoteDetails,
} from "../data/votes";
import Page from "../components/Page";
import ContentSection from "../components/ContentSection";
import classNames from "classnames";
import { addMinutes, formatDistanceToNow } from "date-fns";
import VoteOption from "../components/VoteOption";
import VoteDetailField from "../components/VoteDetailField";

const VoteDetailsPage = () => {
  const router = useRouter();
  const { voteid } = router.query;

  const [loading, setLoading] = useState(false);
  const [voteDetails, setVoteDetails] = useState({});
  const [currentHeight, setHeight] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const height = await fetchCurrentHeight();
      const details = await fetchVoteDetails(voteid);
      setHeight(height);
      setVoteDetails(details);
      setLoading(false);
    };
    if (voteid) getData();
  }, [voteid]);

  const { id, pollster, deadline, name, link, description, outcomes } =
    voteDetails;

  const [humanizedDeadline, setHumanizedDeadline] = useState("");
  const [blocksRemaining, setBlocksRemaining] = useState(0);

  useEffect(() => {
    if (deadline && currentHeight)
      setBlocksRemaining(parseInt(deadline) - parseInt(currentHeight));
  }, [deadline, currentHeight]);

  useEffect(() => {
    if (blocksRemaining !== 0) {
      const now = new Date(Date.now());
      const string =
        blocksRemaining > 0
          ? formatDistanceToNow(addMinutes(now, parseInt(blocksRemaining)))
          : "Voting closed";

      setHumanizedDeadline(string);
    }
  }, [deadline, currentHeight, blocksRemaining]);

  const [results, setResults] = useState([]);

  useEffect(() => {
    const getResults = async (voteid) => {
      const results = await calculateResults(voteid);
      setResults(results);
    };
    getResults(voteid);
  }, [voteid]);

  const [expandedId, setExpandedId] = useState(null);

  const handleExpandClick = (id) => {
    setExpandedId(id);
  };

  if (loading) {
    return (
      <Page>
        <ContentSection>
          <div className="flex flex-col space-y-2">
            <div className="flex-col space-y-2">
              <VoteDetailField value="Loading..." label="Loading..." />
            </div>
          </div>
        </ContentSection>
      </Page>
    );
  }

  return (
    <Page>
      <ContentSection flatBottom>
        <div className="flex flex-col">
          <div className="flex-col space-y-2">
            <VoteDetailField value={name} title label="Vote Title" />
            <VoteDetailField value={description} label="Description" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <VoteDetailField value={id} label="Vote ID" small />
              <VoteDetailField value={pollster} label="Pollster" small />
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
          <div className="">
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
      {results?.length > 0 && (
        <ContentSection>
          <p className="text-xs font-light text-gray-400 font-sans pb-2">
            Results
          </p>
          {results.map((r) => {
            return <div className="text-white text-md">{r.name}</div>;
          })}
        </ContentSection>
      )}
    </Page>
  );
};

export default VoteDetailsPage;
