import { Header } from "@/components/Header";
import { ProxyProfile } from "@/components/ProxyProfile";
import { networksToMint } from "@helium/spl-utils";
import {
  proxyQuery
} from "@helium/voter-stake-registry-hooks";
import { VoteService, getRegistrarKey } from "@helium/voter-stake-registry-sdk";
import { PublicKey } from "@solana/web3.js";
import { HydrationBoundary, QueryClient, dehydrate, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

function getVoteService({ mint }: { mint: PublicKey }) {
  const registrar = getRegistrarKey(mint);
  return new VoteService({
    baseURL: process.env.NEXT_PUBLIC_HELIUM_VOTE_URI,
    registrar,
  });
}

export default async function ProxyPage({
  params: { wallet: walletRaw, network },
}: {
  params: { wallet: string; network: string };
}) {
  const voteService = useMemo(
    () => getVoteService({ mint: networksToMint[network] }),
    [network]
  );
  const wallet = useMemo(() => new PublicKey(walletRaw), [walletRaw]);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    proxyQuery({
      wallet,
      voteService,
    })
  );
  const dehydrated = dehydrate(
    queryClient,
  );
  console.log(dehydrated);

  return (
    <>
      <Header hideNav hideHero route="/$network/positions" />
      <HydrationBoundary state={dehydrated}>
        <ProxyProfile wallet={walletRaw} />
      </HydrationBoundary>
    </>
  );
}
