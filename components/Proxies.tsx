import { useHeliumVsrState } from "@helium/voter-stake-registry-hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { humanReadable } from "../utils/formatting";
import { useMint } from "@helium/helium-react-hooks";
import BN from "bn.js";
import Link from "next/link";
import { useNetwork } from "../hooks/useNetwork";

export default function Proxies() {
  const { voteService, mint } = useHeliumVsrState();
  const { info: mintAcc } = useMint(mint)
  const decimals = mintAcc?.decimals
  const [proxies, setProxies] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { network } = useNetwork()

  const fetchMoreData = async () => {
    const newProxies = await voteService.getProxies({
      page: page,
      limit: 100,
    });
    setPage(p => p + 1)
    if (newProxies.length < 100) {
      setHasMore(false);
    }
    setProxies((prevProxies) => [...prevProxies, ...newProxies]);
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
        dataLength={proxies.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>No More Proxies</b>
          </p>
        }
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wallet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delegations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delegated Tokens
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Percent
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {proxies.map((proxy, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href={`/${network}/proxies/${proxy.wallet}`}>
                    {proxy.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href={`/${network}/proxies/${proxy.wallet}`}>
                    {proxy.wallet}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href={`/${network}/proxies/${proxy.wallet}`}>
                    {proxy.numDelegations}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href={`/${network}/proxies/${proxy.wallet}`}>
                    {proxy.delegatedVeTokens
                      ? humanReadable(new BN(proxy.delegatedVeTokens), decimals)
                      : "0"}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link href={`/${network}/proxies/${proxy.wallet}`}>
                    {Number(proxy.percent).toFixed(2)}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
}
