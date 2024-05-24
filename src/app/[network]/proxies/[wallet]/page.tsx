import { Header } from "@/components/Header";
import { ProxyProfile } from "@/components/ProxyProfile";
import { WalletBoundary } from "@/components/WalletBoundary";
import { networksToMint } from "@/lib/constants";
import { VoteService, getRegistrarKey } from "@helium/voter-stake-registry-sdk";
import { PublicKey } from "@solana/web3.js";

export default async function ProxyPage({
  params: { wallet, network },
}: {
  params: { wallet: string; network: string };
}) {
  const mint = networksToMint[network];
  const { proxy, detail, image } = await getData(
    new PublicKey(wallet as string),
    mint
  );

  return (
    <>
      <Header hideNav hideHero route="/$network/positions" />
      <ProxyProfile proxy={proxy} detail={detail!} image={image!} />
    </>
  );
}

export async function getData(wallet: PublicKey, mint: PublicKey) {
  const registrar = getRegistrarKey(mint);

  const voteService = new VoteService({
    baseURL: process.env.NEXT_PUBLIC_HELIUM_VOTE_URI,
    registrar,
  });
  const proxy = await voteService.getProxy(wallet.toBase58());
  let detail = null;
  if (proxy.detail) {
    const res = await fetch(proxy.detail);
    detail = await res.text();
  }

  return {
    proxy,
    detail,
    image: proxy.image ? proxy.image : null,
    // revalidate: 10 * 60,
  };
}
