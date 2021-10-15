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
        <meta property="og:title" content="Helium Vote" />
        <meta property="og:site_name" content="Helium Vote" />
        <meta property="og:url" content="https://heliumvote.com" />
        <meta
          property="og:description"
          content="A frontend to make it easy to vote on Helium Improvement Proposals."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://heliumvote.com/images/og.png"
        />
      </Head>

      <ContentSection flatBottom first>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col">
            <h2 className="text-4xl font-sans text-white">Helium Vote</h2>
            <br />
            <p className="font-sans text-gray-300 max-w-2xl text-lg">
              Helium Vote is where the Helium Community comes together to make decisions on the Network. Each vote will be driven by a Helium Improvement Proposal (HIP). When HIPs are ready for voting, they will appear here.
            <br />
            <br />
            </p>
            <p className="font-sans text-gray-300 max-w-2xl text-lg">
              The number of votes going towards each voting choice is determined by your HNT and staked HNT wallet balance - this is known as Voting Power. To cast a vote, submit a burn transaction using the wallet of your choosing. Total cost of a burn transaction is 35,000 DC or approximately $0.35.
            </p>
            <br />
            <p className="font-sans text-gray-300 max-w-2xl text-lg">
              Final votes will be tallied at the block deadline and data credits burned to each vote choice will be purged from the Network.
            </p>
          </div>
        </div>
      </ContentSection>
      <ContentSection flatTop>
        <div>
          <p className="text-lg pb-4 text-white">Active Votes</p>
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
      </ContentSection>
    </Page>
  );
}

export async function getStaticProps() {
  const height = await fetchCurrentHeight();
  const votes = await fetchVotes();

  return { props: { height, votes }, revalidate: 60 * 60 };
}
