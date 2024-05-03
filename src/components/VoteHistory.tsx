import { humanReadable } from "@/lib/utils";
import { useMint } from "@helium/helium-react-hooks";
import { useHeliumVsrState } from "@helium/voter-stake-registry-hooks";
import { ProposalWithVotes } from "@helium/voter-stake-registry-sdk";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function VoteHistory({ wallet }: { wallet: PublicKey }) {
  const { voteService, mint } = useHeliumVsrState();
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

  return (
    <div className="dark:bg-gray-800 overflow-auto">
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
              console.log(totalWeight.toNumber());
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
