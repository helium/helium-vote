"use client";

import { useNetwork } from "@/hooks/useNetwork";
import { ellipsisMiddle, humanReadable } from "@/lib/utils";
import { useMint } from "@helium/helium-react-hooks";
import { EnhancedProxy } from "@helium/voter-stake-registry-sdk";
import BN from "bn.js";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAsyncCallback } from "react-async-hook";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { RiUserStarFill } from "react-icons/ri";
import InfiniteScroll from "react-infinite-scroll-component";
import { ContentSection } from "./ContentSection";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { useGovernance } from "@/providers/GovernanceProvider";

function CardDetail({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium uppercase text-xs text-muted-foreground">
        {title}
      </span>
      <span>{value}</span>
    </div>
  );
}

export function Proxies() {
  const { voteService, mint } = useGovernance();
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

  const handleBrowseProxies = () => {
    // TODO: Implement
  };

  return (
    <ContentSection className="flex-1 py-4">
      <section className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between md:items-center">
          <h4>Browse Proxies</h4>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="w-full flex-1 flex-row relative">
              <FaMagnifyingGlass className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search name or address..."
                className="w-full appearance-none bg-secondary border-none pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            </div>
            <Button
              variant="secondary"
              className="text-foreground flex flex-row gap-2 items-center"
              disabled={!proxies.length}
              onClick={handleBrowseProxies}
            >
              <RiUserStarFill className="size-4" />
              Browse
            </Button>
          </div>
        </div>
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
                <Card className="flex hover:opacity-80 max-md:flex-col max-md:bg-card/45 max-md:overflow-hidden">
                  <div className="p-4 flex flex-row gap-2 items-center max-md:bg-card ">
                    <Avatar>
                      <AvatarImage src={proxy.image} alt={proxy.name} />
                      <AvatarFallback>{proxy.name}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col w-60">
                      <h4>{proxy.name}</h4>
                      <span className="text-foreground text-xs">
                        {ellipsisMiddle(proxy.wallet)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 gap-8 grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2">
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
                </Card>
              </Link>
            ))}
          </div>
        </InfiniteScroll>
      </section>
    </ContentSection>
  );
}
