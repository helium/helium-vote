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
import QRCode from "react-qr-code";
import { addMinutes, formatDistanceToNow } from "date-fns";

const VoteDetailField = ({ value, label, title = false, small = false }) => {
  return (
    <div className="flex flex-col">
      <p className="text-xs font-light text-gray-500 font-sans">{label}</p>
      {title ? (
        <h2 className="text-4xl font-sans text-white">{value}</h2>
      ) : (
        <p
          className={classNames("font-sans break-all text-gray-300", {
            "text-sm": small,
            "text-lg": !small,
          })}
        >
          {value}
        </p>
      )}
    </div>
  );
};

const VoteOption = ({ outcome }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full bg-white bg-opacity-5 rounded-xl p-4 flex space-y-2 flex-col items-start justify-start">
      <div className="flex justify-between items-center w-full">
        <p className="text-white text-3xl">{outcome.value}</p>
        <button
          className="flex flex-row items-center justify-between px-3 py-2 bg-gray-700 hover:bg-gray-600 outline-none border border-solid border-transparent focus:border-hv-blue-500 transition-all duration-100 rounded-lg w-min"
          onClick={() => setExpanded((curr) => !curr)}
        >
          <span className="text-sm text-hv-blue-500 whitespace-nowrap pr-2">
            {expanded ? "Hide" : "Show"} voting instructions
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={classNames("h-3 w-3 text-hv-blue-500", {
              "rotate-180": expanded,
            })}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      {expanded && (
        <>
          <p className="text-gray-400 text-sm pb-4">
            To vote for this option, scan the QR code to burn $1 worth of HNT. By submitting this transaction, the wallet balance of the sender address will be added to the votes (1 HNT = 1 Vote). Burning more HNT will not affect the number of votes. 
          </p>
          <div className="space-y-4 flex flex-col items-center justify-start">
            <span className="flex flex-col items-center space-y-2">
              <p className="text-gray-300 text-sm">
                1. Scan this QR code with the Helium app:
              </p>
              <div className="flex justify-center items-center p-4 rounded-lg bg-white">
                <QRCode value={outcome.address} size={175} />
              </div>
            </span>
            <span className="text-lg text-gray-500">OR</span>
            <span className="flex flex-col items-center space-y-2">
              <p className="text-gray-300 text-sm">
                2. Execute the following command with the CLI:
              </p>
              <div className="bg-hv-gray-900 rounded-lg p-2 flex flex-col items-start justify-start">
                <p className="text-hv-blue-500 font-mono break-all">{`helium-wallet burn --0.0000004 --payee ${outcome.address} --commit`}</p>
              </div>
            </span>
          </div>
        </>
      )}
    </div>
  );
};

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

  console.log(results);

  useEffect(() => {
    const getResults = async (voteid) => {
      const results = await calculateResults(voteid);
      setResults(results);
    };
    getResults(voteid);
  }, [voteid]);

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
                <VoteOption key={o.address} outcome={o} />
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
