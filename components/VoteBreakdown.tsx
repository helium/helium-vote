import { PublicKey } from "@solana/web3.js";
import { useVotes } from "../hooks/useVotes";
import {
  useProposal,
  useProposalConfig,
} from "@helium/modular-governance-hooks";
import { useMemo, useState } from "react";
import { useRegistrar } from "@helium/voter-stake-registry-hooks";
import { useMint } from "@helium/helium-react-hooks";
import { ellipsisMiddle, humanReadable } from "../utils/formatting";
import BN from "bn.js";
import Loading from "./Loading";

export function VoteBreakdown({ proposalKey }: { proposalKey: PublicKey }) {
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
  const loading = loadingMarkers || loadingProp || loadingConf || loadingReg;
  const [displayCount, setDisplayCount] = useState(20);

  const groupedSortedMarkers = useMemo(() => {
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
      b.totalWeight.sub(a.totalWeight).toNumber()
    );

    return sortedMarkers;
  }, [markers]);

  const csvData = useMemo(() => {
    const rows = [];
    rows.push(["Owner", "Choices", "Vote Weight", "Percentage"]);

    groupedSortedMarkers.forEach((marker) => {
      const owner = marker.voter.toBase58();
      const choices = marker.choices
        .map((c) => proposal.choices[c].name)
        .join(", ");
      const voteWeight = humanReadable(marker.totalWeight, decimals);
      const percentage = (
        marker.totalWeight.mul(new BN(100000)).div(totalVotes).toNumber() / 1000
      ).toFixed(2);

      rows.push([owner, choices, voteWeight, percentage]);
    });

    const csvContent = rows.map((row) => row.map(r => `"${r.toString()}"`).join(",")).join("\n");
    return csvContent;
  }, [groupedSortedMarkers]);
  const displayedMarkers = useMemo(
    () => groupedSortedMarkers.slice(0, displayCount),
    [groupedSortedMarkers]
  );

  return (
    <div className="flex flex-col">
      <table className="table-auto text-white">
        <thead>
          <tr>
            <th className="px-4 py-2">Owner</th>
            <th className="px-4 py-2">Choices</th>
            <th className="px-4 py-2">Vote Weight</th>
            <th className="px-4 py-2">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {loading && <Loading />}
          {(displayedMarkers || []).map((marker, index) => (
            <tr
              key={marker.voter.toBase58()}
              className={index % 2 === 0 ? "bg-hv-gray-500" : "bg-hv-gray-600"}
            >
              <td className="px-4 py-2">
                <a
                  className="text-hv-green-500"
                  target="_blank"
                  href={`https://explorer.solana.com/address/${marker.voter.toBase58()}`}
                >
                  {ellipsisMiddle(marker.voter.toBase58())}
                </a>
              </td>
              <td className="px-4 py-2">
                {marker.choices.map((c) => proposal.choices[c].name).join(", ")}
              </td>
              <td className="px-4 py-2">
                {humanReadable(marker.totalWeight, decimals)}
              </td>
              <td className="px-4 py-2">
                {/* Add two decimals precision */}
                {(
                  marker.totalWeight
                    .mul(new BN(100000))
                    .div(totalVotes)
                    .toNumber() / 1000
                ).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col justify-center w-full">
        {displayCount < groupedSortedMarkers.length && (
          <button
            className="px-6 py-3 hover:bg-hv-gray-500 transition-all duration-200 rounded-lg text-lg text-hv-green-500 whitespace-nowrap outline-none border border-solid border-transparent focus:border-hv-green-500 block text-center"
            onClick={() => setDisplayCount((c) => c + 20)}
          >
            Load More
          </button>
        )}
        <button
          className="px-6 py-3 hover:bg-hv-gray-500 transition-all duration-200 rounded-lg text-lg text-hv-green-500 whitespace-nowrap outline-none border border-solid border-transparent focus:border-hv-green-500 block text-center"
          onClick={() => {
            const blob = new Blob([csvData], {
              type: "text/csv;charset=utf-8;",
            });
            const link = document.createElement("a");
            if (link.download !== undefined) {
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", "vote_breakdown.csv");
              link.style.visibility = "hidden";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        >
          Download CSV
        </button>
      </div>
    </div>
  );
}
