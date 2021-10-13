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

  // console.log(activeVotes);

  return (
    <Page>
      <Head>
        <title>Helium Vote</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ContentSection>
        <div className="flex flex-col space-y-2">
          {loading ? (
            <p className="text-lg">{"Loading votes..."}</p>
          ) : (
            <div>
              <p className="text-lg">{"Active votes:"}</p>
              <div className="flex flex-col space-y-2">
                {activeVotes.map((v) => {
                  return (
                    <Link href={`/${v.id}`}>
                      <a className="w-full rounded-md border border-gray-300 border-solid p-5 hover:bg-gray-300">
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
