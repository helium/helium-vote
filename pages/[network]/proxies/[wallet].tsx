import {
  EnhancedProxy,
  VoteService,
  getRegistrarKey,
} from "@helium/voter-stake-registry-sdk";
import { GetServerSidePropsContext } from "next";
import ContentSection from "../../../components/ContentSection";
import MetaTags from "../../../components/MetaTags";
import Page from "../../../components/Page";
import ProxyProfile from "../../../components/ProxyProfile";
import { getServerSideNetwork } from "../../../hooks/useNetwork";

export default function ProxyPage({
  proxy,
  detail,
  image,
}: {
  proxy: EnhancedProxy;
  detail: string;
  image: string;
}) {
  return (
    <Page>
      <MetaTags />
      <ContentSection>
        <ProxyProfile proxy={proxy} detail={detail} image={image} />
      </ContentSection>
    </Page>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { wallet } = context.params;
  const { mint } = await getServerSideNetwork(context);
  const registrar = getRegistrarKey(mint);

  const voteService = new VoteService({
    baseURL: process.env.NEXT_PUBLIC_HELIUM_VOTE_URI,
    registrar,
  });
  const proxy = await voteService.getProxy(wallet as string);
  let detail = null;
  if (proxy.detail) {
    const res = await fetch(voteService.getAssetUrl(proxy.detail));
    detail = await res.text();
  }

  return {
    props: {
      proxy,
      detail,
      image: proxy.image ? voteService.getAssetUrl(proxy.image) : null,
    },
    // revalidate: 10 * 60,
  };
}
