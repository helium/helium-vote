import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { ContentSection } from "./ContentSection";
import { CreatePositionButton } from "./CreatePositionButton";
import { NetworkTabs } from "./NetworkTabs";
import { VeTokensCallout } from "./VeTokensCallout";
import { ViewPositionsButton } from "./ViewPositionsButton";
import { WalletConnectButton } from "./WalletConnectButton";

export const Header: FC<{
  hideHero?: boolean;
  hideNav?: boolean;
  route?: string;
}> = ({ hideHero = false, hideNav = false, route = undefined }) => {
  const isOnPositions = route?.includes("/positions");

  return (
    <header className="flex flex-col bg-card">
      <div className="bg-slate-950 md:bg-transparent">
        <ContentSection className="!flex-row py-4 justify-between items-center">
          <Link
            href="/"
            className="flex flex-row justifiy-center items-center gap-2"
          >
            <div className="size-8 rounded-full relative">
              <Image alt="logo" src="/images/logo.svg" fill />
            </div>
            <h4 className="max-sm:hidden">governance</h4>
          </Link>
          <div className="flex flex-row flex-grow gap-4 justify-end items-center">
            <VeTokensCallout />
            <WalletConnectButton shrink />
          </div>
        </ContentSection>
      </div>
      {!hideHero && (
        <ContentSection>
          <div className="flex flex-row h-[342px] py-6 justify-between max-md:py-12 max-md:h-auto">
            <div className="flex justify-center items-center">
              <div>
                <h1>Helium Governance</h1>
                <p className="max-w-lg mt-4 text-slate-50">
                  Helium Vote is where the community comes together to make
                  decisions on the network.
                </p>
              </div>
            </div>

            <div className="size-40 max-md:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="max-sm:hidden"
                src="/images/hero.png"
                alt="hero-image"
              />
            </div>
          </div>
        </ContentSection>
      )}
      {!hideNav && (
        <div className="bg-slate-800/45">
          <ContentSection className="!flex-row justify-between">
            <NetworkTabs route={route} />
            {isOnPositions ? (
              <div className="my-2">
                <CreatePositionButton />
              </div>
            ) : (
              <ViewPositionsButton className="my-2" />
            )}
          </ContentSection>
        </div>
      )}
    </header>
  );
};
