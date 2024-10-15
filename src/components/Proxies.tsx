"use client";

import { ellipsisMiddle, humanReadable } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useMint } from "@helium/helium-react-hooks";
import { proxiesQuery } from "@helium/voter-stake-registry-hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import BN from "bn.js";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { FaMagnifyingGlass, FaX } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";
import InfiniteScroll from "react-infinite-scroll-component";
import { ContentSection } from "./ContentSection";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { useDebounce } from "@uidotdev/usehooks";
import { EnhancedProxy } from "@helium/voter-stake-registry-sdk";

const DECENTRALIZATION_RISK_PERCENT = 10;

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

const ProxyCardSkeleton: React.FC = () => {
  return (
    <Card className="flex hover:opacity-80 max-md:flex-col max-md:bg-card/45 max-md:overflow-hidden">
      <div className="p-4 flex flex-row gap-2 items-center max-md:bg-card ">
        <Skeleton className="size-10 rounded-full bg-slate-800" />

        <div className="flex flex-col w-60 gap-1">
          <Skeleton className="w-40 h-4 bg-slate-800" />
          <Skeleton className="w-20 h-3 bg-slate-800" />
        </div>
      </div>

      <div className="p-4 gap-8 grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2">
        <div className="flex flex-col w-40 gap-1">
          <Skeleton className="w-30 h-4 bg-slate-800" />
          <Skeleton className="w-10 h-3 bg-slate-800" />
        </div>
        <div className="flex flex-col w-40 gap-1">
          <Skeleton className="w-30 h-4 bg-slate-800" />
          <Skeleton className="w-10 h-3 bg-slate-800" />
        </div>
        <div className="flex flex-col w-40 gap-1">
          <Skeleton className="w-30 h-4 bg-slate-800" />
          <Skeleton className="w-10 h-3 bg-slate-800" />
        </div>
      </div>
    </Card>
  );
};

export function Proxies() {
  const { voteService, mint } = useGovernance();
  const { info: mintAcc } = useMint(mint);
  const decimals = mintAcc?.decimals;
  const path = usePathname();
  const [proxySearch, setProxySearch] = useState("");
  const searchDebounced = useDebounce(proxySearch, 300);
  const {
    data: voters,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery(
    proxiesQuery({
      search: searchDebounced,
      amountPerPage: 100,
      voteService,
    })
  );
  const proxies = useMemo(() => voters?.pages.flat() || [], [voters]);

  const renderBelowIndex = useMemo(
    () =>
      proxies.findIndex(
        (proxy) => Number(proxy.percent) < DECENTRALIZATION_RISK_PERCENT
      ),
    [proxies]
  );

  return (
    <ContentSection className="flex-1 py-4">
      <section className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:justify-between md:items-center">
          <h4>Browse Proxies</h4>
          <div className="w-half flex-row relative justify-end md:w-2/3 lg:w-1/3">
            <FaMagnifyingGlass className="size-6 absolute left-4 top-[calc(50%-0.75rem)] text-muted-foreground" />
            {proxySearch ? (
              <FaX
                className="size-4 absolute right-4 top-[calc(50%-0.5rem)] text-muted-foreground cursor-pointer"
                onClick={() => setProxySearch("")}
              />
            ) : null}
            <Input
              value={proxySearch}
              onChange={(e) => setProxySearch(e.target.value)}
              placeholder="Search name or address..."
              className="w-full appearance-none bg-secondary border-none pl-12 pr-10 shadow-none"
            />
          </div>
        </div>
        <InfiniteScroll
          dataLength={proxies?.length}
          next={() => fetchNextPage()}
          hasMore={hasNextPage}
          loader={
            <div className="p-4 flex flex-row justify-center">
              <Loader2 className="size-5 animate-spin" />
            </div>
          }
          endMessage={
            <p className="mt-3 text-white/opacity-75 text-sm text-center">
              {proxies.length} of {proxies.length} voters loaded. You&apos;ve
              reached the end of the list
            </p>
          }
        >
          <div className="flex flex-col gap-4 space-between">
            {proxies.map((proxy, index) => (
              <>
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
                          proxy.proxiedVeTokens && decimals
                            ? // force 2 decimals
                              humanReadable(
                                new BN(proxy.proxiedVeTokens).div(
                                  new BN(Math.pow(10, (decimals || 0) - 2))
                                ),
                                2
                              )!
                            : "0"
                        }
                      />
                      <CardDetail
                        title="Last Voted"
                        value={
                          proxy.lastVotedAt
                            ? new Date(proxy.lastVotedAt).toLocaleDateString()
                            : "Never"
                        }
                      />
                    </div>
                  </Card>
                </Link>
                {renderBelowIndex > 0 && index === renderBelowIndex ? (
                  <div className="py-2 px-4 text-sm w-full bg-accent/30 rounded-lg flex flex-row gap-2 items-center">
                    <IoWarningOutline
                      className="size-8"
                      color="hsla(25, 95%, 53%, 1)"
                    />
                    <span>
                      Assigning proxy to top voters may threaten the
                      decentralization of the network. Consider assigning proxy
                      to voters below this line.
                    </span>
                  </div>
                ) : null}
              </>
            ))}
            {(isLoading || isFetchingNextPage) && <ProxyCardSkeleton />}
          </div>
        </InfiniteScroll>
      </section>
    </ContentSection>
  );
}
