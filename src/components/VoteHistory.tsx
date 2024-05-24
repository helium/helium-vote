import { humanReadable } from "@/lib/utils";
import Image from "next/image"
import { useGovernance } from "@/providers/GovernanceProvider";
import { useMint } from "@helium/helium-react-hooks";
import { ProposalWithVotes } from "@helium/voter-stake-registry-sdk";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function VoteHistory({ wallet }: { wallet: PublicKey }) {
  const { voteService, mint } = useGovernance();
  const { info: mintAcc } = useMint(mint);
  const decimals = mintAcc?.decimals;
  const [voteHistories, setVoteHistory] = useState<ProposalWithVotes[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchMoreData = async () => {
    if (voteService) {
      const newVoteHistory = await voteService.getVotesForWallet({
        wallet: wallet,
        page: page,
        limit: 10,
      });
      setPage((p) => p + 1);
      if (newVoteHistory.length < 10) {
        setHasMore(false);
      }
      setVoteHistory((prevVoteHistory) => [
        ...prevVoteHistory,
        ...newVoteHistory,
      ]);
    }
  };

  useEffect(() => {
    if (voteService) {
      setPage(1);
      setHasMore(true);
      fetchMoreData();
    }
  }, [voteService]);

  const path = usePathname();
  const currentPath = path.split("/")[0] || "hnt";
  function getNetworkPath(network: string) {
    const split = path.split("/")
    split.shift();
    return [network, ...split].join("/")
  }

  return (
    <div className="overflow-auto">
      <div className="flex flex-col py-2 md:items-center md:flex-row md:justify-between">
        <h2 className="text-white text-xl font-medium">Proposals</h2>
        <ToggleGroup
          variant="subNav"
          type="single"
          value={currentPath}
        >
          <ToggleGroupItem value="hnt" aria-label="HNT">
            <Link
              className="flex items-center gap-2 p-2"
              href={`${getNetworkPath("hnt")}`}
            >
              <Image
                width={16}
                height={16}
                alt="hnt Icon"
                src="/images/hntWhite.svg"
              />
              HNT
            </Link>
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" aria-label="MOBILE">
            <Link
              className="flex items-center gap-2 p-2"
              href={`${getNetworkPath("mobile")}`}
            >
              <Image
                width={16}
                height={16}
                alt="moile Icon"
                src="/images/mobileWhite.svg"
              />
              MOBILE
            </Link>
          </ToggleGroupItem>
          <ToggleGroupItem value="mobile" aria-label="IOT">
            <Link
              className="flex items-center gap-2 p-2"
              href={`${getNetworkPath("iot")}`}
            >
              <Image
                width={16}
                height={16}
                alt="iot Icon"
                src="/images/iotWhite.svg"
              />
              MOBILE
            </Link>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <InfiniteScroll
        dataLength={voteHistories.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>End of vote history</b>
          </p>
        }
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Proposal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                State
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weight
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Choices
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percent
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {voteHistories.map((voteHistory, index) => {
              const totalWeight = voteHistory.choices.reduce((acc, c) => {
                return acc.add(new BN(c.weight));
              }, new BN(0));
              const percent = voteHistory.votes[0]
                ? (100 * Number(voteHistory.votes[0].weight)) /
                  totalWeight.toNumber()
                : 0;

              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {voteHistory.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Object.keys(voteHistory.state)[0]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {voteHistory.votes[0]?.weight &&
                      humanReadable(
                        new BN(voteHistory.votes[0].weight),
                        decimals
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {voteHistory.votes.map((v) => v.choiceName).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {percent.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
}
