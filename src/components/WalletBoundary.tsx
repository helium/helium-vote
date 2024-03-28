"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import React, { FC } from "react";
import { ContentSection } from "./ContentSection";
import { Card } from "./ui/card";
import { WalletConnectButton } from "./WalletConnectButton";

export const WalletBoundary: FC<
  React.PropsWithChildren<{
    heading?: string;
    description?: string;
  }>
> = ({
  heading = "No wallet connection",
  description = "Please connect a wallet to continue.",
  children,
}) => {
  const { connected } = useWallet();

  if (!connected)
    return (
      <ContentSection className="flex-1 py-8">
        <Card className="flex flex-col flex-grow items-center justify-center gap-4">
          <div className="flex flex-col items-center">
            <h3 className="text-xl text-muted-foreground">{heading}</h3>
            <p className="text-sm text-center text-muted-foreground">
              {description}
            </p>
          </div>

          <WalletConnectButton />
        </Card>
      </ContentSection>
    );

  return <>{children}</>;
};
