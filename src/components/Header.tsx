import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { ContentSection } from "./ContentSection";
import { NetworkTabs } from "./NetworkTabs";
import { SubNav } from "./SubNav";
import { VeTokensCallout } from "./VeTokensCallout";
import { WalletConnectButton } from "./WalletConnectButton";
import { DataSplitSection } from "./DataSplitSection";

export const Header: FC<{
  hideHero?: boolean;
  hideNav?: boolean;
  route?: string;
}> = ({ hideHero = false, hideNav = false, route = undefined }) => (
  <header className="flex flex-col bg-card">
    <div className="bg-slate-950 md:bg-transparent">
      <ContentSection className="!flex-row py-4 justify-between items-center">
        <Link
          href="/"
          className="flex flex-row justifiy-center items-center gap-2"
        >
          <div className="size-8 relative sm:hidden">
            <Image
              alt="Helium Governance Logo"
              src="/images/logo-roundel.svg"
              fill
            />
          </div>
          <div className="h-8 w-36 relative max-sm:hidden">
            <Image
              alt="Helium Governance Logo"
              src="/images/logo-wordmark.svg"
              width={140}
              height={20}
            />
          </div>
        </Link>
        <div className="flex flex-row flex-grow gap-4 justify-end items-center">
          <VeTokensCallout />
          <WalletConnectButton shrink />
        </div>
      </ContentSection>
    </div>
    {!hideHero && (
      <ContentSection>
        {/* <DataSplitSection /> */}
        <div className="flex flex-row h-[342px] py-6 justify-between items-start max-md:py-12 max-md:h-auto">
          <div className="flex justify-center items-center">
            <div>
              <h1 className="max-md:text-5xl text-7xl">
                Helium
                <br />
                Governance
              </h1>
              <p className="max-w-lg mt-4 text-slate-50 text-lg leading-5">
                Where the community comes together to make decisions on
                the network.
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
          <SubNav />
        </ContentSection>
      </div>
    )}
  </header>
);
