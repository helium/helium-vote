import React, { FC, useMemo, useState } from "react";
import { ellipsisMiddle, humanReadable } from "@/lib/utils";
import { PublicKey } from "@solana/web3.js";
import {
  useProposal,
  useProposalConfig,
} from "@helium/modular-governance-hooks";
import {
  useRegistrar,
  useHeliumVsrState,
  votesForProposalQuery,
} from "@helium/voter-stake-registry-hooks";
import { useMint } from "@helium/helium-react-hooks";
import BN from "bn.js";
import { toNumber } from "@helium/spl-utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { FaChevronDown } from "react-icons/fa6";
import classNames from "classnames";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useGovernance } from "@/providers/GovernanceProvider";


export const VoteBreakdown: FC<{
  proposalKey: PublicKey;
}> = ({ proposalKey }) => {
  const { voteService } = useHeliumVsrState();
  const { network } = useGovernance();
  const [displayCount, setDisplayCount] = useState(6);
  const { data: votes, isLoading: loadingVotes } = useQuery(
    votesForProposalQuery({
      voteService,
      proposal: proposalKey,
    })
  );
  const { info: proposal, loading: loadingProp } = useProposal(proposalKey);
  const { info: proposalConfig, loading: loadingConf } = useProposalConfig(
    proposal?.proposalConfig
  );
  const { info: registrar, loading: loadingReg } = useRegistrar(
    proposalConfig?.voteController
  );
  const decimals = useMint(registrar?.votingMints[0].mint)?.info?.decimals;
  const totalVotes = useMemo(
    () =>
      (proposal?.choices || []).reduce((acc, { weight }) => {
        return acc.add(weight);
      }, new BN(0)),
    [proposal?.choices]
  );

  const groupedSortedVotes = useMemo(() => {
    if (decimals) {
      const grouped = Object.values(
        (votes || []).reduce((acc, vote) => {
          const key = vote.voter;
          if (!acc[key]) {
            acc[key] = {
              voter: vote.voter,
              choices: [],
              totalWeight: new BN(0),
              proxyName: (vote as any).proxyName,
            };
          }

          acc[key].choices.push(vote.choiceName);
          acc[key].totalWeight = acc[key].totalWeight.add(new BN(vote.weight));
          return acc;
        }, {} as Record<string, { voter: string; choices: string[]; totalWeight: BN; proxyName?: string }>)
      );

      const sortedMarkers = grouped.sort((a, b) =>
        toNumber(b.totalWeight.sub(a.totalWeight), decimals)
      );

      return sortedMarkers;
    }
  }, [votes, decimals]);

  const csvData = useMemo(() => {
    const rows: string[][] = [];
    rows.push(["Owner", "Choices", "Vote Power", "Percentage", "Proxy Name"]);

    (groupedSortedVotes || []).forEach((vote) => {
      const owner = vote.voter;
      const choices = vote.choices.join(" ");
      const voteWeight = humanReadable(vote.totalWeight, decimals);
      const percentage = vote.totalWeight
        .mul(new BN(100000))
        .div(totalVotes)
        .div(new BN(1000))
        .toNumber()
        .toFixed(2);

      // @ts-ignore
      rows.push([owner, choices, voteWeight || "", percentage, vote.proxyName]);
    });

    const csvContent = rows
      .map((row) => row.map((r) => `"${r?.toString()}"`).join(","))
      .join("\n");
    return csvContent;
  }, [groupedSortedVotes, decimals, totalVotes]);

  const displayedVotes = useMemo(
    () => (groupedSortedVotes || []).slice(0, displayCount),
    [groupedSortedVotes, displayCount]
  );

  const handleCSVDownload = () => {
    const blob = new Blob([csvData], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${proposal?.name
          .toLowerCase()
          .split(" ")
          .join("_")}_vote_breakdown.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const isLoading = useMemo(
    () => loadingVotes || loadingProp || loadingConf || loadingReg,
    [loadingVotes, loadingProp, loadingConf, loadingReg]
  );

  return (
    <div className="flex flex-col flex-grow gap-4">
      <div className="flex flex-row justify-between">
        <h4>Voter Breakdown</h4>
        <span className="cursor-pointer underline" onClick={handleCSVDownload}>
          Download as CSV
        </span>
      </div>
      <p className="text-sm">
        Note: For MOBILE/IOT subnetworks, this is shown as 1/10 of your vote
        power becuase the underlying contracts in spl-governance onlysupport
        64-bits of precision
      </p>
      <Table className="text-base mt-4">
        {groupedSortedVotes && groupedSortedVotes.length > displayCount && (
          <TableCaption></TableCaption>
        )}
        <TableHeader>
          <TableRow>
            <TableHead className="bg-slate-900 rounded-tl-md w-[100px] text-muted-foreground">
              OWNER
            </TableHead>
            <TableHead className="bg-slate-900 text-muted-foreground">
              CHOICES
            </TableHead>
            <TableHead className="bg-slate-900 text-muted-foreground">
              VOTE POWER
            </TableHead>
            <TableHead className="bg-slate-900 text-muted-foreground">
              PERCENTAGE
            </TableHead>
            <TableHead className="bg-slate-900 rounded-tr-md text-muted-foreground">
              PROXY NAME
            </TableHead>
          </TableRow>
        </TableHeader>
        {!isLoading && (
          <TableBody>
            {displayedVotes.map((vote, i) => (
              <TableRow
                key={vote.voter}
                className={classNames(
                  "!hover:bg-initial",
                  i % 2 === 0 ? "bg-slate-700" : "bg-slate-800"
                )}
              >
                <TableCell>
                  <Link
                    className="text-success-foreground"
                    target="_blank"
                    href={`https://explorer.solana.com/address/${vote.voter}`}
                  >
                    {ellipsisMiddle(vote.voter)}
                  </Link>
                </TableCell>
                <TableCell>{vote.choices.join(", ")}</TableCell>
                <TableCell>
                  {humanReadable(vote.totalWeight, decimals)}
                </TableCell>
                <TableCell className="text-right">
                  {/* Add two decimals precision */}
                  {vote.totalWeight
                    .mul(new BN(100000))
                    .div(totalVotes)
                    .div(new BN(1000))
                    .toNumber()
                    .toFixed(2)}
                  %
                </TableCell>
                <TableCell>
                  {/* @ts-ignore */}
                  {vote.proxyName ? (
                    <Link
                      className="text-success-foreground hover:underline"
                      href={`/${network}/proxies/${vote.voter}`}
                    >
                      {/* @ts-ignore */}
                      {vote.proxyName}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      <div className="flex flex-row md:block md:mx-auto">
        <Button
          variant="secondary"
          onClick={() => setDisplayCount(displayCount + 6)}
          size="sm"
          className="gap-2 w-full md:w-auto rounded-full"
        >
          Show More
          <FaChevronDown />
        </Button>
      </div>
    </div>
  );
};
