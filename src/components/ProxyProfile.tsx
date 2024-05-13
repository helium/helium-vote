"use client";

import { ellipsisMiddle, humanReadable } from "@/lib/utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useMint } from "@helium/helium-react-hooks";
import {
  useAssignProxies,
  useProxiedTo,
  useUnassignProxies,
} from "@helium/voter-stake-registry-hooks";
import { EnhancedProxy, WithRank } from "@helium/voter-stake-registry-sdk";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import { AssignProxyModal } from "./AssignProxyModal";
import { ContentSection } from "./ContentSection";
import { ProxyButton } from "./ProxyButton";
import { RevokeProxyButton } from "./RevokeProxyButton";
import { RevokeProxyModal } from "./RevokeProxyModal";
import { Card, CardContent, CardHeader } from "./ui/card";
import VoteHistory from "./VoteHistory";

export function ProxyProfile({
  proxy,
  detail,
  image,
}: {
  proxy: EnhancedProxy & WithRank;
  detail: string;
  image: string;
}) {
  const { mint } = useGovernance();
  const { info: mintAcc } = useMint(mint);
  const decimals = mintAcc?.decimals;
  const [revokeProxyModalVisible, setRevokeProxyModalVisible] = useState(false);
  const handleSetRevokeProxy = () => {
    setRevokeProxyModalVisible(true);
  };
  const { assignProxies } = useAssignProxies();
  const { unassignProxies } = useUnassignProxies();
  const wallet = useMemo(() => new PublicKey(proxy.wallet), [proxy.wallet]);
  const { votingPower } = useProxiedTo(wallet);
  const { network } = useGovernance();

  return (
    <ContentSection className="flex-1 py-8 max-md:py-0 max-md:px-0">
      <Card className="max-md:flex-1 max-md:rounded-none">
        <CardHeader>
          <Link
            href={`/${network}/proxies`}
            className="flex flex-row items-center text-sm gap-2"
          >
            <FaArrowLeft />
            Back to Proxies
          </Link>
          <div className="flex flex-row">
            <div className="grow flex flex-row items-center gap-2">
              <Image
                className="w-24 h-24 rounded-full"
                src={image}
                alt="Profile"
                width={48}
                height={48}
                style={{ width: "48px", height: "48px" }}
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold">{proxy.name}</h1>
                <span className="text-xs">{ellipsisMiddle(proxy.wallet)}</span>
              </div>
            </div>
            <div className="flex flex-row gap-8">
              <div className="border-l border-gray-700 h-12" />
              <div className="flex flex-col gap-2">
                <span className="text-gray-400 text-xs">Current Rank</span>
                <span>
                  #{proxy.rank} of {proxy.numProxies}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-gray-400 text-xs">Last Voted</span>
                <span>{proxy.lastVotedAt?.toDateString() || "Never"}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {votingPower && (
            <div className="flex items-center">
              <span className="font-bold mr-2">My Delegations:</span>
              {humanReadable(votingPower, decimals)}
            </div>
          )}
          <RevokeProxyButton
            wallet={wallet}
            onClick={handleSetRevokeProxy}
            isLoading={false}
          />

          <AssignProxyModal onSubmit={assignProxies} wallet={wallet}>
            <ProxyButton
              className="ml-4 mt-4"
              onClick={() => {}}
              isLoading={false}
            />
          </AssignProxyModal>
          {revokeProxyModalVisible && (
            <RevokeProxyModal
              isOpen={revokeProxyModalVisible}
              onClose={() => setRevokeProxyModalVisible(false)}
              onSubmit={unassignProxies}
              wallet={wallet}
            />
          )}
          <div className="text-lg mb-6">
            <div className="flex items-center">
              <span className="font-bold mr-2">Wallet:</span>
              <span>{proxy.wallet}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold mr-2">Num Delegations:</span>
              <span>{proxy.numDelegations}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold mr-2">Delegated Tokens:</span>
              <span>
                {proxy.delegatedVeTokens
                  ? humanReadable(new BN(proxy.delegatedVeTokens), decimals)
                  : "0"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-bold mr-2">Percent:</span>
              <span>{Number(proxy.percent).toFixed(2)}</span>
            </div>
          </div>
          <div className="prose prose-dark whitespace-pre-wrap leading-snug">
            <ReactMarkdown>{detail}</ReactMarkdown>
          </div>
          <VoteHistory wallet={wallet} />
        </CardContent>
      </Card>
    </ContentSection>
  );
}
