import Head from "next/head";
import Page from "../components/Page";
import { fetchCurrentHeight, fetchVotes } from "../data/votes";
import Link from "next/link";
import ContentSection from "../components/ContentSection";
import { useState } from "react";
import classNames from "classnames";
import CountdownTimer from "../components/CountdownTimer";
import MetaTags from "../components/MetaTags";

const VoteCard = ({ vote, height }) => {
  const { name, description, id, deadline } = vote;

  const blocksRemaining = deadline - height;

  return (
    <div className="flex-shrink-0 min-w-96 w-full sm:w-96 sm:p-5">
      <Link href={`/${id}`}>
        <a className="group h-full w-full flex flex-col transition-all duration-150 outline-none border border-solid border-opacity-0 focus:border-opacity-50 border-hv-green-500 rounded-3xl">
          <span className="pt-5 px-5 rounded-t-3xl bg-hv-gray-450 group-hover:bg-hv-gray-400 transition-all duration-150">
            <p className="text-white text-xl tracking-tight leading-tight pb-2">
              {name}
            </p>
            <p className="text-hv-gray-300 h-14 overflow-hidden text-sm leading-tight">
              {description?.substring(0, 80)}...
            </p>
          </span>
          <div className="rounded-b-3xl bg-hv-gray-500 group-hover:bg-hv-gray-550 transition-all duration-150 p-5 flex flex-col">
            <span className="text-sm text-hv-gray-200">
              Est. Time Remaining
            </span>
            <span className="text-sm text-white">
              <CountdownTimer blocksRemaining={blocksRemaining} key={id} />
            </span>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default function Home({ height, activeVotes, completedVotes }) {
  const [voteFilterTab, setVoteFilterTab] = useState(0);
  const [filteredVotesList, setFilteredVotesList] = useState(activeVotes);

  const handleVoteFilterChange = (e, id) => {
    e.preventDefault();

    const newList = id === 0 ? activeVotes : completedVotes;

    setFilteredVotesList(newList);
    setVoteFilterTab(id);
  };

  return (
    <Page>
      <MetaTags />
      <ContentSection className="sm:pt-20">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between">
              <div className="flex flex-col">
                <span className="space-y-4">
                  <a
                    href="https://github.com/helium/helium-vote"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-block outline-none border-hv-green-500 border-opacity-0 border border-solid rounded-md focus:border-opacity-100 opacity-40 hover:opacity-75 transition-all duration-150"
                  >
                    <span className="flex flex-row items-center justify-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="text-md text-gray-500 font-semibold pl-2">
                        @helium/helium-vote
                      </span>
                    </span>
                  </a>
                  <h2 className="text-4xl sm:text-8xl font-sans font-semibold text-white tracking-tighter">
                    Helium Vote
                  </h2>
                </span>
                <span className="max-w-lg space-y-4 pt-4">
                  <p className="font-semibold font-sans text-gray-300 text-lg leading-tight">
                    Helium Vote is where the Helium Community comes together to
                    make decisions on the Network.
                  </p>
                  <p className="font-light text-gray-500 text-lg max-w-md leading-tight">
                    Each vote will be driven by a Helium Improvement Proposal
                    (HIP). When HIPs are ready for voting, they will appear
                    here.
                  </p>
                </span>
              </div>
              <div>
                <img
                  src="/images/helium-vote-icon.png"
                  className="w-20 sm:w-52 h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
      <div className="w-full bg-hv-gray-750 py-4 sm:py-10 mt-10 sm:mt-5">
        <div className="max-w-6xl mx-auto px-4 lg:px-10">
          <div className="lg:px-10">
            <div className="sm:pl-5 space-x-2 sm:space-x-6">
              <button
                className={classNames(
                  "outline-none text-lg sm:text-3xl font-semibold tracking-tight border-b-2 border-solid border-opacity-0 focus:border-opacity-25 border-hv-green-500 rounded-sm transition-all duration-200",
                  {
                    "text-hv-green-500": voteFilterTab === 0,
                    "text-hv-gray-400": voteFilterTab !== 0,
                  }
                )}
                onClick={(e) => handleVoteFilterChange(e, 0)}
              >
                Active Votes
              </button>
              <button
                className={classNames(
                  "outline-none text-lg sm:text-3xl font-semibold tracking-tight border-b-2 border-solid border-opacity-0 focus:border-opacity-25 border-hv-green-500 rounded-sm transition-all duration-200",
                  {
                    "text-hv-green-500": voteFilterTab === 1,
                    "text-hv-gray-400": voteFilterTab !== 1,
                  }
                )}
                onClick={(e) => handleVoteFilterChange(e, 1)}
              >
                Closed Votes
              </button>
            </div>
          </div>

          <div className="pt-4 lg:pl-10">
            {filteredVotesList.length > 0 ? (
              <div className="flex flex-col sm:flex-row w-full sm:overflow-x-auto">
                {filteredVotesList.map((v) => {
                  return <VoteCard vote={v} height={height} />;
                })}
              </div>
            ) : (
              <p className="text-hv-gray-400 text-sm font-sans font-light sm:pl-5">
                No votes
              </p>
            )}
          </div>
        </div>
      </div>
      <ContentSection className="pt-10 sm:pt-20">
        <p className="text-xl sm:text-3xl text-white font-semibold font-sans w-full pb-5">
          How does it work?
        </p>
        <div className="flex flex-col sm:flex-row sm:space-x-10 space-y-4 sm:space-y-0">
          <p className="font-sans font-light text-hv-gray-200 max-w-2xl text-md sm:text-lg w-full sm:w-1/2 leading-tight tracking-tight">
            The number of votes going towards each voting choice is determined
            by your HNT and staked HNT wallet balance - this is known as Voting
            Power. To cast a vote, submit a burn transaction using the wallet of
            your choosing. Total cost of a burn transaction is 35,000 DC or
            approximately $0.35.
          </p>
          <p className="font-sans font-light text-hv-gray-200 max-w-2xl text-md sm:text-lg w-full sm:w-1/2 leading-tight tracking-tight">
            Final votes will be tallied at the block deadline and data credits
            burned to each vote choice will be purged from the Network. This is
            our first attempt at an on-chain voting system and an exciting step
            towards decentralized governance. The votes here are intended to
            capture community sentiment and support the current rough consensus
            mechanism.
          </p>
        </div>
      </ContentSection>
    </Page>
  );
}

export async function getStaticProps() {
  const { height } = await fetchCurrentHeight();
  const votes = await fetchVotes();

  const activeVotes = votes.filter(({ deadline }) => height <= deadline);
  const completedVotes = votes.filter(({ deadline }) => height > deadline);

  return {
    props: { height, activeVotes, completedVotes },
    revalidate: 60,
  };
}
