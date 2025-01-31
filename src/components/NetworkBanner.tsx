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
import { WalletConnectButton } from "./WalletConnectButton";

export const NetworkBanner: FC = () => {
  const { connected } = useWallet();
  const { network } = useGovernance();
  const isHNT = network === "hnt";

  return (
    <ContentSection className="flex-1">
      <Card className="overflow-hidden">
        <CardContent className="p-4 flex flex-row gap-4 items-center relative max-md:flex-col md:pl-36">
          <div className="flex max-md:hidden size-40 flex-shrink-0 absolute left-[-40px] top-[-25px]">
            <Image
              alt="Network Banner"
              src="/images/illustration-voting-power.png"
              fill
            />
          </div>
          <div className="hidden max-md:flex w-full max-w-[364px] h-[160px] flex-shrink-0 relative">
            <Image
              priority
              alt="Network Banner"
              src="/images/illustration-voting-power.mobile.png"
              fill
            />
          </div>
          <div className="flex flex-col flex-grow gap-1">
            <p>How proposals work:</p>
            <h5>Voting is enabled by locking tokens</h5>
            <p className="text-sm text-slate-100">
              Create a vote escrow position using HNT
            </p>
          </div>
          <div className="flex flex-row gap-4 max-md:w-full max-md:gap-12">
            {!connected && (
              <div className="flex flex-row w-full justify-center items-center">
                <WalletConnectButton />
              </div>
            )}
            {connected && isHNT && (
              <>
                <div className="flex flex-col flex-1 gap-2 max-md:flex-none">
                  <Button
                    variant="ghost"
                    size="xs"
                    disabled
                    className="!opacity-90 font-normal text-xs text-muted-foreground"
                  >
                    Ready to Vote?
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    disabled
                    className="!opacity-90 font-normal text-xs text-muted-foreground"
                  >
                    Need Tokens?
                  </Button>
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <CreatePositionButton size="xs" hideIcon showText />
                  <Link
                    href={`https://jup.ag/swap/SOL-${network.toUpperCase()}`}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="flex flex-row"
                  >
                    <Button
                      variant="ghost"
                      size="xs"
                      className="flex-grow gap-2"
                    >
                      <div className="p-1 rounded-full border-2 border-foreground">
                        <FaArrowRightArrowLeft className="rotate-90" />
                      </div>
                      Swap Here
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </ContentSection>
  );
};
