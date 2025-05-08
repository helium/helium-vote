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
        <DataSplitSection />
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
