"use client";

import { useHeliumVsrState } from "@helium/voter-stake-registry-hooks";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { useMint } from "@helium/helium-react-hooks";
import BN from "bn.js";
import Link from "next/link";
import { useNetwork } from "@/hooks/useNetwork";
import { ellipsisMiddle, humanReadable } from "@/lib/utils";
import { EnhancedProxy } from "@helium/voter-stake-registry-sdk";
import { ContentSection } from "./ContentSection";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAsyncCallback } from "react-async-hook";
import { usePathname } from "next/navigation";

function CardDetail({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium uppercase text-xs text-slate-400">
        {title}
      </span>
      <span>{value}</span>
    </div>
  );
}

export function Proxies() {
  const { voteService, mint } = useHeliumVsrState();
  const { info: mintAcc } = useMint(mint);
  const decimals = mintAcc?.decimals;
  const [proxies, setProxies] = useState<EnhancedProxy[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const path = usePathname();

  const { execute: fetchMoreData, loading } = useAsyncCallback(async () => {
    if (voteService) {
      const newProxies = await voteService.getProxies({
        page: page,
        limit: 100,
      });
      setPage((p) => p + 1);
      if (newProxies.length == 100) {
        setHasMore(true);
      }
      setProxies((prevProxies) => [...prevProxies, ...newProxies]);
    }
  });

  useEffect(() => {
    if (voteService) {
      setProxies([]);
      setPage(1);
      fetchMoreData();
    }
  }, [voteService?.registrar.toBase58()]);

  return (
    <ContentSection className="flex-1 py-4">
      <section className="flex flex-col flex-1 gap-4">
        <h4>Browse Proxies</h4>
        <InfiniteScroll
          dataLength={proxies.length}
          next={fetchMoreData}
          hasMore={!loading && hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>No More Proxies</b>
            </p>
          }
        >
          <div className="flex flex-col gap-4 space-between">
            {proxies.map((proxy, index) => (
              <Link key={index} href={`${path}/${proxy.wallet}`}>
                <Card className="hover:opacity-80 flex flex-col md:flex-row-reverse">
                  <div className="flex flex-row md:justify-end flex-grow p-2 text-xs text-slate-50">
                    <span>Assigned {proxy.numAssignments} positions</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="p-4 flex flex-row gap-2 items-center">
                      <Avatar>
                        <AvatarImage src={proxy.image} alt={proxy.name} />
                        <AvatarFallback>{proxy.name}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col w-60">
                        <h4>{proxy.name}</h4>
                        <span className="text-slate-50 text-xs">{ellipsisMiddle(proxy.wallet)}</span>
                      </div>
                    </div>

                    <div className="gap-4 bg-card-muted p-4 rounded-b-lg md:bg-transparent grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2">
                      <CardDetail
                        title="Proposals Voted"
                        value={proxy.numProposalsVoted}
                      />
                      <CardDetail
                        title="Total Voting Power"
                        value={
                          proxy.delegatedVeTokens
                            ? humanReadable(
                                new BN(proxy.delegatedVeTokens),
                                decimals
                              )!
                            : "0"
                        }
                      />
                      <CardDetail
                        title="Last Voted"
                        value={
                          proxy.lastVotedAt
                            ? proxy.lastVotedAt.toDateString()
                            : "Never"
                        }
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </InfiniteScroll>
      </section>
    </ContentSection>
  );
}
