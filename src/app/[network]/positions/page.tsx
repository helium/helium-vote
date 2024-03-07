import { Header } from "@/components/Header";
import { Positions } from "@/components/Positions";
import { WalletBoundary } from "@/components/WalletBoundary";
import { formMetaTags } from "@/lib/utils";
import React from "react";

export interface PositionsPageParams {
  params: {
    network: string;
  };
  searchParams: Record<string, string> | null | undefined;
}

export const generateMetadata = async ({ params }: PositionsPageParams) => {
  const { network } = params;

  return formMetaTags({
    title: `${network.toUpperCase()} Positions`,
    url: `https://heliumvote.com/${network}/positions`,
  });
};

export default async function PositionsPage({
  params,
  searchParams,
}: PositionsPageParams) {
  return (
    <>
      <Header hideHero={true} route="/$network/positions" />
      <WalletBoundary>
        <Positions />
      </WalletBoundary>
    </>
  );
}
