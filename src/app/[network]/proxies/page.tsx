import { Header } from "@/components/Header";
import { Proxies } from "@/components/Proxies";
import { formMetaTags } from "@/lib/utils";

export interface VotersPageParams {
  params: {
    network: string;
  };
  searchParams: Record<string, string> | null | undefined;
}

export const generateMetadata = async ({ params }: VotersPageParams) => {
  const { network } = params;

  return formMetaTags({
    title: `${network.toUpperCase()} Positions`,
    url: `https://heliumvote.com/${network}/voters`,
  });
};

export default async function PositionsPage() {
  return (
    <>
      <Header hideHero={true} route="/$network/voters" />
      <Proxies />
    </>
  );
}
