import Head from "next/head";
import Page from "../components/Page";
import { fetchCurrentHeight, fetchVotes } from "../data/votes";
import Link from "next/link";
import ContentSection from "../components/ContentSection";

export default function Home({ height, votes }) {
  return (
    <Page>
      <Head>
        <title>Helium Vote</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ContentSection>
        <div className="flex flex-col space-y-2">
          <div>
            <p className="text-lg pb-4 text-white">Active votes</p>
            <div className="flex flex-col space-y-2">
              {votes.map((v) => {
                return (
                  <Link href={`/${v.id}`}>
                    <a className="w-full rounded-md border outline-none border-transparent focus:border-hv-blue-500 border-solid p-5 hover:bg-gray-300 bg-gray-600 transition-all duration-100 text-white text-2xl hover:text-gray-800">
                      {v.name}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </ContentSection>
    </Page>
  );
}

export async function getStaticProps() {
  const height = await fetchCurrentHeight();
  const votes = await fetchVotes();

  return { props: { height, votes }, revalidate: 60 * 60 };
}
