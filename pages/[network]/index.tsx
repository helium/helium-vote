import ContentSection from "../../components/ContentSection";
import MetaTags from "../../components/MetaTags";
import { NetworkSelector } from "../../components/NetworkSelector";
import Page from "../../components/Page";
import { Proposals } from "../../components/Proposals";
import { fetchVotes } from "../../data/votes";

export default function Home({ legacyVotes }) {
  return (
    <Page className="bg-gray-800">
      <MetaTags />
      <ContentSection>
        <div className="flex flex-col space-y-2 pt-12">
          <div className="flex flex-col">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between">
              <div className="flex flex-col">
                <span className="space-y-4">
                  <a
                    href="https://github.com/helium/helium-vote"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-block outline-none border-hv-green-500 border-opacity-0 border border-solid rounded-md focus:border-opacity-100 opacity-40 hover:opacity-75 transition-all duration-150"
                  >
                    <span className="flex flex-row items-center justify-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="text-md text-gray-200 font-semibold pl-2">
                        @helium/helium-vote
                      </span>
                    </span>
                  </a>
                  <h2 className="text-4xl sm:text-8xl font-sans font-semibold text-white tracking-tighter">
                    Helium Vote
                  </h2>
                </span>
                <span className="max-w-lg space-y-4 pt-4">
                  <p className="font-semibold font-sans text-gray-300 text-lg leading-tight">
                    Helium Vote is where the Helium Community comes together to
                    make decisions on the Network.
                  </p>
                  <p className="font-light text-hv-gray-200 text-lg max-w-md leading-tight ">
                    Each vote will be driven by a Helium Improvement Proposal
                    (HIP). When HIPs are ready for voting, they will appear
                    here.
                  </p>
                </span>
              </div>
              <div>
                <img
                  src="/images/helium-vote-icon.png"
                  className="w-20 sm:w-52 h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </ContentSection>
      <ContentSection className="mt-8">
        <NetworkSelector />
      </ContentSection>
      <ContentSection className="pt-6 md:pt-4">
        <Proposals legacyVotes={legacyVotes} />
      </ContentSection>
    </Page>
  );
}

export async function getStaticProps() {
  const votes = fetchVotes();

  return {
    props: { legacyVotes: votes },
  };
}

export async function getStaticPaths() {
  const networks = ["hnt", "mobile", "iot"];

  // Generate the paths
  const paths = networks.map((network) => ({
    params: { network },
  }));

  return { paths, fallback: false };
}