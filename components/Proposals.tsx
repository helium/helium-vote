import { useMint, useOwnedAmount } from "@helium/helium-react-hooks";
import { useOrganizationProposals } from "@helium/modular-governance-hooks";
import { organizationKey } from "@helium/organization-sdk";
import { useHeliumVsrState } from "@helium/voter-stake-registry-hooks";
import { Proposal } from "@helium/voter-stake-registry-sdk/lib/types/src/voteService";
import { useWallet } from "@solana/wallet-adapter-react";
import BN from "bn.js";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { IoChevronForward } from "react-icons/io5";
import { useNetwork } from "../hooks/useNetwork";
import { humanReadable } from "../utils/formatting";
import Loading from "./Loading";
import { ProposalVoteCard } from "./ProposalVoteCard";
import Dropdown from "./inputs/Dropdown";
import { VoteCard } from "./VoteCard";
import { HNT_MINT, IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";

export type ProposalFilter =
  | "all"
  | "active"
  | "cancelled"
  | "passed"
  | "failed";

const FILTERS = [
  {
    name: "All Votes",
    value: "all",
  },
  {
    name: "Active Votes",
    value: "active",
  },
  {
    name: "Cancelled Votes",
    value: "cancelled",
  },
  {
    name: "Passed Votes",
    value: "passed",
  },
  {
    name: "Failed Votes",
    value: "failed",
  },
];

function getProposalState(p: Proposal) {
  const keys = Object.keys(p.state);
  const state = p.state as any;
  if (keys.includes("voting")) return "active";
  if (keys.includes("cancelled")) return "cancelled";
  if (keys.includes("resolved") && state.resolved) {
    if (
      (state.resolved.choices.length === 1 &&
        p.choices[state.resolved.choices[0]].name.startsWith("Yes")) ||
      state.resolved.choices.length > 1 ||
      state.resolved.choices.length === 0
    ) {
      return "passed";
    }

    if (
      state.resolved.choices.length === 1 &&
      p.choices[state.resolved.choices[0]].name.startsWith("No")
    ) {
      return "failed";
    }
  }
}

type LegacyProposal = {
  deadlineTs: number;
  name: string;
  id: string;
  outcomes: { value: string; hntVoted: number }[];
  tags: any[];
};

function getLegacyProposalState(p: LegacyProposal): ProposalFilter {
  const passed = p.outcomes[0].hntVoted > p.outcomes[1].hntVoted
  if (passed) {
    return 'passed'
  } else {
    return 'failed'
  }
}

const REALMS_VOTES = {
  [HNT_MINT.toBase58()]: [
    {
      name: "HIP 88: Adjustment of DAO Utility A Score",
      status: "passed",
      endTs: 1690329600,
      href: "https://realms.heliumvote.com/dao/hnt/proposal/6qgUFLqXkaJAcDvSufHFafQkRXt1MWegtZ9qsHvizp7S",
      outcomes: [
        {
          votes: 253457245,
        },
        {
          votes: 2337953,
        },
      ],
    },
  ],
  [MOBILE_MINT.toBase58()]: [
    {
      name: "HIP 96: WiFi AP Onboarding Structure",
      status: "passed",
      endTs: 1700524800,
      href: "https://realms.heliumvote.com/dao/mobile/proposal/5pPPhWfuMx7cHNW4Um9PTuceJLw7RrqwJ7LKQ8Ldc98q",
      outcomes: [
        {
          votes: 14279117910,
        },
        {
          votes: 1911617830,
        },
      ],
    },
    {
      name: "HIP 93: Addition of Wi-Fi Access Points to the Helium Mobile SubDAO",
      status: "passed",
      endTs: 1696723200,
      href: "https://realms.heliumvote.com/dao/mobile/proposal/8Nd4VFUZcBUhP28sSkz4SDcKEWrGu5j9Hsaz8RLn4hao",
      outcomes: [
        {
          votes: 19626804010,
        },
        {
          votes: 390619450,
        },
      ],
    },
    {
      name: "HIP 85: MOBILE Hex Coverage Limit",
      status: "passed",
      endTs: 1696723200,
      href: "https://realms.heliumvote.com/dao/mobile/proposal/GRrnrpk1BRQz54EyrNFcst1bo1iNiD1ZALh7KFbX9j6U",
      outcomes: [
        {
          votes: 27964616800,
        },
        {
          votes: 8007876000,
        },
      ],
    },
    {
      name: "HIP 87: Proportional Service Provider Rewards",
      status: "passed",
      endTs: 1630147200,
      href: "https://realms.heliumvote.com/dao/mobile/proposal/DtMtA61XvnNWAPb3rr9isaPPHopUQCHFhAu5QJmaNy1k",
      outcomes: [
        {
          votes: 14923931950,
        },
        {
          votes: 483651500,
        },
      ],
    },
    {
      name: "HIP 89: MOBILE Network Onboarding Fees",
      status: "passed",
      endTs: 1686182400,
      href: "https://realms.heliumvote.com/dao/mobile/proposal/8AZepByGXEejTYwy3mLKA57k19w27uukc9QUhJHFVYwj",
      outcomes: [
        {
          votes: 40134791690,
        },
        {
          votes: 1343213560,
        },
      ],
    },
    {
      name: "HIP 84: Service Provider Hex Boosting",
      status: "passed",
      endTs: 1686873600,
      href: "https://realms.heliumvote.com/dao/mobile/proposal/E2XvmWoYx2ZGs1uWHjNszgmsnq3Dtd1x2a64tsqJyDKT",
      outcomes: [
        {
          votes: 32064766060,
        },
        {
          votes: 1024175030,
        },
      ],
    },
    {
      name: "HIP 82: Add Helium Mobile as a Service Provider to the Helium Mobile subDAO",
      status: "passed",
      endTs: 1686873600,
      href: "https://realms.heliumvote.com/dao/mobile/proposal/3u2DUcZ2GMRviU5Ycy827urBtovutUiGrt3jqJHQek3w",
      outcomes: [
        {
          votes: 39630647870,
        },
        {
          votes: 39630647870,
        },
      ],
    },
    {
      name: "HIP 79: Mobile PoC - Mappers Rewards",
      status: "passed",
      endTs: 1686873600,
      href: "https://realms.heliumvote.com/dao/mobile/proposal/3r2bTix8eGGKiu1HTzLpXY7PdS5321n4sFqNs8cBDRNR",
      outcomes: [
        {
          votes: 28342688270,
        },
        {
          votes: 6090792060,
        },
      ],
    },
  ],
  [IOT_MINT.toBase58()]: [
    {
      name: "HIP 91: Continuation of Reduced IOT Location Assertion Cost",
      status: "passed",
      endTs: 1690156800,
      href: "https://realms.heliumvote.com/dao/iot/proposal/GDDd639STzeJgJfuha2Ciyx1uDixYHhr4B5sUisG6v5K",
      outcomes: [
        {
          votes: 2631673530,
        },
        {
          votes: 104254030,
        },
      ],
    },
    {
      name: "HIP 83: Restore First to Respond Witness Rewarding",
      status: "passed",
      endTs: 1698105600,
      href: "https://realms.heliumvote.com/dao/iot/proposal/H5mGJg9927DBRr1NH64VVk6hoSTJdnAC5kngGxgvumUS",
      outcomes: [
        {
          votes: 8630277560,
        },
        {
          votes: 3639242980,
        },
      ],
    },
    {
      name: "HIP 92: Correcting IOT Pre-mine Calculation Errors",
      status: "failed",
      endTs: 1697155200,
      href: "https://realms.heliumvote.com/dao/iot/proposal/4TZE7E3KvRgZiaSMF8h4s7F9UhWDJUgNdNuBz8y1dGzq",
      outcomes: [
        {
          votes: 3651135780
        },
        {
          votes: 5307502230
        }
      ]
    },
    {
      name: "HIP 72: Secure Concentrators",
      status: "failed",
      endTs: 1690156800,
      href: "https://realms.heliumvote.com/dao/iot/proposal/E3LHMo2Ke59vFUH5gMjtUSQoSHokodHujkNqPu5GwfYr",
      outcomes: [
        {
          votes: 3699219860,
        },
        {
          votes: 2344586130,
        },
      ],
    },
  ],
};

export const Proposals = ({
  legacyVotes,
}: {
  legacyVotes: LegacyProposal[];
}) => {
  const { network } = useNetwork();
  const organization = useMemo(
    () =>
      organizationKey(network == "hnt" ? "Helium" : network.toUpperCase())[0],
    [network]
  );
  const [filter, setFilter] = useState<ProposalFilter>("all");
  const { votingPower, positions, mint, loading } = useHeliumVsrState();
  const decimals = useMint(mint)?.info?.decimals;

  const {
    accounts: proposalsWithDups,
    error,
    loading: loadingProposals,
  } = useOrganizationProposals(organization);
  const proposals = useMemo(() => {
    const seen = new Set();
    return proposalsWithDups.filter((p) => {
      const has = seen.has(p.info?.name);
      seen.add(p.info?.name);

      return !has;
    });
  }, [proposalsWithDups]);
  const { publicKey } = useWallet();
  const { amount, loading: loadingBalance } = useOwnedAmount(publicKey, mint);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);
  const filteredProposals = useMemo(() => {
    return proposals.filter(
      (p) =>
        p.info &&
        (filter == "all" || getProposalState(p.info as any) === filter)
    );
  }, [proposals, filter]);
  const filteredRealmsProposals = useMemo(() => {
    return REALMS_VOTES[mint.toBase58()].filter((vote) => {
      return filter === "all" || vote.status === filter;
    });
  }, [mint, filter]);
  const filteredLegacyProposals = useMemo(() => {
    if (network != "hnt") {
      return [];
    }

    return legacyVotes.filter((vote) => {
      return filter === "all" || getLegacyProposalState(vote) === filter;
    });
  }, [legacyVotes, filter]);

  return (
    <div className="p-4 bg-gray-600 bg-opacity-25 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center">
        <div className="flex flex-col space-y-0 mb-0 bg-gray-600 rounded-lg p-4 md:bg-transparent md:p-0 ">
          <div className="text-white text-2xl font-bold leading-loose">
            Voting Rights
          </div>
          <Link href={`/${network}/staking`}>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 md:items-center cursor-pointer">
              {loading ? (
                <div className="text-white text-xs font-normal">
                  Loading voting power...
                </div>
              ) : (
                <div className="flex flex-row items-center space-x-1 text-white text-xs font-normal">
                  <span className="text-base font-medium leading-none">
                    {publicKey
                      ? votingPower && decimals
                        ? humanReadable(votingPower, decimals)
                        : "0"
                      : "N/A"}{" "}
                  </span>
                  <span>
                    voting power from{" "}
                    {publicKey ? (positions ? positions.length : "0") : "N/A"}{" "}
                    positions
                  </span>
                </div>
              )}
              <div className="py-2 md:hidden">
                <hr className="border-black" />
              </div>
              <div className="flex flex-row space-x-1 md:items-center text-gray-50 text-xs font-normal">
                <span>Available to lock:</span>
                <span className="font-medium">
                  {loadingBalance || !decimals
                    ? "..."
                    : publicKey
                    ? humanReadable(new BN(amount?.toString() || "0"), decimals)
                    : "N/A"}{" "}
                  more HNT
                </span>
                <IoChevronForward />
              </div>
            </div>
          </Link>
        </div>
        <Dropdown
          className="border border-white w-full mt-4 md:mt-0 md:w-auto flex-row justify-between"
          value={filter}
          values={FILTERS}
          onSelect={(v) => setFilter(v as ProposalFilter)}
        />
      </div>
      {filteredProposals.length +
        filteredRealmsProposals.length +
        filteredLegacyProposals.length ==
        0 && (
        <div className="flex flex-row justify-center h-60 items-center mt-4">
          {loadingProposals ? (
            <Loading />
          ) : (
            <div className="text-center text-gray-50 text-base font-normal">
              No Votes
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col space-y-2 mt-4">
        {filteredProposals.map((proposal) => (
          <ProposalVoteCard
            proposal={proposal.info as any}
            proposalKey={proposal.publicKey}
            key={proposal.publicKey.toBase58()}
          />
        ))}
        {filteredRealmsProposals.map((proposal) => {
          const total = proposal.outcomes.reduce(
            (acc, o) => acc + o.votes,
            0
          );
          return (
            <VoteCard
              id={proposal.name}
              href={proposal.href}
              name={proposal.name}
              endTs={proposal.endTs}
              results={proposal.outcomes.map((o, index) => ({
                index,
                percent: (o.votes / total) * 100,
              }))}
              totalVotes={new BN(total)}
              decimals={decimals}
              tags={["realms"]}
            />
          );
        })}
        {filteredLegacyProposals.map((proposal) => {
          const total = proposal.outcomes.reduce(
            (acc, o) => acc + o.hntVoted,
            0
          );
          return (
            <VoteCard
              id={proposal.id}
              href={`/legacy/${proposal.id}`}
              name={proposal.name}
              endTs={proposal.deadlineTs}
              results={proposal.outcomes.map((o, index) => ({
                index,
                percent: (o.hntVoted / total) * 100,
              }))}
              totalVotes={new BN(total)}
              decimals={8}
              tags={Object.values(proposal.tags)}
            />
          );
        })}
      </div>
    </div>
  );
};
