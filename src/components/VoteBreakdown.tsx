import React, { FC, useMemo, useState } from "react";
import { ellipsisMiddle, humanReadable } from "@/lib/utils";
import { PublicKey } from "@solana/web3.js";
import {
  useProposal,
  useProposalConfig,
} from "@helium/modular-governance-hooks";
import { useRegistrar } from "@helium/voter-stake-registry-hooks";
import { useMint } from "@helium/helium-react-hooks";
import BN from "bn.js";
import { useVotes } from "@/hooks/useVotes";
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

export const VoteBreakdown: FC<{
  proposalKey: PublicKey;
}> = ({ proposalKey }) => {
  const [displayCount, setDisplayCount] = useState(6);
  const { markers, loading: loadingMarkers } = useVotes(proposalKey);
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

  const groupedSortedMarkers = useMemo(() => {
    if (decimals) {
      const grouped = Object.values(
        (markers || []).reduce((acc, marker) => {
          const key = marker.voter.toBase58() + marker.choices.join(",");
          if (!acc[key]) {
            acc[key] = {
              voter: marker.voter,
              choices: [],
              totalWeight: new BN(0),
            };
          }
          acc[key].choices = marker.choices;
          acc[key].totalWeight = acc[key].totalWeight.add(marker.weight);
          return acc;
        }, {} as Record<string, { voter: PublicKey; choices: number[]; totalWeight: BN }>)
      );

      const sortedMarkers = grouped.sort((a, b) =>
        toNumber(b.totalWeight.sub(a.totalWeight), decimals)
      );

      return sortedMarkers;
    }
  }, [markers, decimals]);

  const csvData = useMemo(() => {
    const rows = [];
    rows.push(["Owner", "Choices", "Vote Power", "Percentage"]);

    (groupedSortedMarkers || []).forEach((marker) => {
      const owner = marker.voter.toBase58();
      const choices = marker.choices
        .map((c) => proposal?.choices[c].name)
        .join(", ");

      const voteWeight = humanReadable(marker.totalWeight, decimals);
      const percentage = marker.totalWeight
        .mul(new BN(100000))
        .div(totalVotes)
        .div(new BN(1000))
        .toNumber()
        .toFixed(2);

      rows.push([owner, choices, voteWeight, percentage]);
    });

    const csvContent = rows
      .map((row) => row.map((r) => `"${r.toString()}"`).join(","))
      .join("\n");
    return csvContent;
  }, [groupedSortedMarkers, proposal?.choices, decimals, totalVotes]);

  const displayedMarkers = useMemo(
    () => (groupedSortedMarkers || []).slice(0, displayCount),
    [groupedSortedMarkers, displayCount]
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
    () => loadingMarkers || loadingProp || loadingConf || loadingReg,
    [loadingMarkers, loadingProp, loadingConf, loadingReg]
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
        {groupedSortedMarkers && groupedSortedMarkers.length > displayCount && (
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
            <TableHead className="bg-slate-900 rounded-tr-md text-muted-foreground">
              PERCENTAGE
            </TableHead>
          </TableRow>
        </TableHeader>
        {!isLoading && (
          <TableBody>
            {displayedMarkers.map((marker, i) => (
              <TableRow
                key={marker.voter.toBase58()}
                className={classNames(
                  "!hover:bg-initial",
                  i % 2 === 0 ? "bg-slate-700" : "bg-slate-800"
                )}
              >
                <TableCell>
                  <Link
                    className="text-success-foreground"
                    target="_blank"
                    href={`https://explorer.solana.com/address/${marker.voter.toBase58()}`}
                  >
                    {ellipsisMiddle(marker.voter.toBase58())}
                  </Link>
                </TableCell>
                <TableCell>
                  {marker.choices
                    .map((c) => proposal?.choices[c].name)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  {humanReadable(marker.totalWeight, decimals)}
                </TableCell>
                <TableCell className="text-right">
                  {/* Add two decimals precision */}
                  {marker.totalWeight
                    .mul(new BN(100000))
                    .div(totalVotes)
                    .div(new BN(1000))
                    .toNumber()
                    .toFixed(2)}
                  %
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
