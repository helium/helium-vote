"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import React, { FC } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import Image from "next/image";
import { ContentSection } from "./ContentSection";
import { CreatePositionButton } from "./CreatePositionButton";
import { useGovernance } from "@/providers/GovernanceProvider";
import Link from "next/link";

const Banner: FC = () => {
  const { network } = useGovernance();

  return (
    <ContentSection className="flex-1 px-4 md:px-0 mt-4">
      <Card className="overflow-hidden">
        <CardContent className="p-4 flex flex-row gap-4 items-center max-md:flex-col">
          <div className="flex max-md:hidden size-40 flex-shrink-0 relative">
            <Image
              alt="Network Banner"
              src="/images/illustration-voting-power.png"
              fill
            />
          </div>
          <div className="hidden max-md:flex w-full max-w-[364px] h-[160px] flex-shrink-0 relative">
            <Image
              alt="Network Banner"
              src="/images/illustration-voting-power.mobile.png"
              fill
            />
          </div>
          <div className="flex flex-col flex-grow gap-2">
            <p>How proposals work:</p>
            <h4>Voting is enabled by locking tokens within this network</h4>
            <p className="text-sm text-slate-100">
              Create a vote escrow position using either HNT, MOBILE, or IOT
              tokens depending on the network you&apos;re on
            </p>
          </div>
          <div className="flex flex-row gap-4 max-md:w-full">
            <div className="flex flex-col flex-1 gap-2 max-md:flex-none">
              <Button
                variant="ghost"
                disabled
                className="!opacity-90 font-normal"
              >
                Ready to Vote?
              </Button>
              <Button
                variant="ghost"
                disabled
                className="!opacity-90 font-normal"
              >
                Need Tokens?
              </Button>
            </div>
            <div className="flex flex-col flex-1 gap-2">
              <CreatePositionButton />
              <Link
                href={`https://jup.ag/swap/SOL-${network.toUpperCase()}`}
                rel="noopener noreferrer"
                target="_blank"
                className="flex flex-row"
              >
                <Button variant="ghost" className="flex-grow gap-2">
                  <div className="p-1 rounded-full border-2 border-foreground">
                    <FaArrowRightArrowLeft className="rotate-90" />
                  </div>
                  Swap Here
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentSection>
  );
};

export const NetworkBanner: FC = () => {
  const { connected } = useWallet();

  if (!connected) return null;
  return <Banner />;
};
