import Head from "next/head";
import { useEffect, useState } from "react";
import Page from "../components/Page";
import { fetchVotes } from "../data/votes";
import Link from "next/link";
import ContentSection from "../components/ContentSection";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [activeVotes, setActiveVotes] = useState([]);

  useEffect(() => {
    const getAllVotes = async () => {
      setLoading(true);
      const fetchedVotes = await fetchVotes();
      setActiveVotes(fetchedVotes);
      setLoading(false);
    };

    getAllVotes();
  }, []);

  return (
    <Page>
      <Head>
        <title>Helium Vote</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ContentSection>
        <div className="flex flex-col space-y-2">
          {loading ? (
            <p className="text-lg text-white">{"Loading votes..."}</p>
          ) : (
            <div>
              <p className="text-lg pb-4 text-white">Active votes</p>
              <div className="flex flex-col space-y-2">
                {activeVotes.map((v) => {
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
          )}
        </div>
      </ContentSection>
    </Page>
  );
}
