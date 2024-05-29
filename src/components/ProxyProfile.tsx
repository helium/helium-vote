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
import { AssignProxyModal } from "./AssignProxyModal";
import { ContentSection } from "./ContentSection";
import { ProxyButton } from "./ProxyButton";
import { RevokeProxyButton } from "./RevokeProxyButton";
import { RevokeProxyModal } from "./RevokeProxyModal";
import { Card, CardContent, CardHeader } from "./ui/card";
import VoteHistory from "./VoteHistory";
import { Markdown } from "./Markdown";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { usePathname } from "next/navigation";

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
  const { assignProxies } = useAssignProxies();
  const { unassignProxies } = useUnassignProxies();
  const wallet = useMemo(() => new PublicKey(proxy.wallet), [proxy.wallet]);
  const { votingPower, positions } = useProxiedTo(wallet);
  const { network } = useGovernance();

  const path = usePathname();
  const currentPath = path.split("/")[0] || "hnt";
  function getNetworkPath(network: string) {
    const split = path.split("/");
    split.shift();
    return [network, ...split].join("/");
  }

  const infoCard = (
    <div className="w-full p-3 bg-gray-700 rounded-xl flex-col justify-center items-start gap-3 inline-flex">
      <div className="w-full flex-col justify-center items-start gap-2 flex">
        <div className="text-slate-500 text-xs font-medium leading-none">
          VOTING POWER
        </div>
        <div className="w-full justify-start items-center gap-2 inline-flex">
          <div className="flex-col flex-1 justify-center items-start gap-1 inline-flex">
            <div className="text-white text-xs font-medium leading-none">
              TOTAL POWER
            </div>
            <div className="text-white text-base font-medium leading-normal">
              {proxy.delegatedVeTokens
                ? humanReadable(new BN(proxy.delegatedVeTokens), decimals)
                : "0"}
            </div>
          </div>
          <div className="flex-col flex-1 justify-center items-start gap-1 inline-flex">
            <div className="text-white text-xs font-medium leading-none">
              PERCENTAGE
            </div>
            <div className="text-white text-base font-medium leading-normal">
              {Number(proxy.percent).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex-col justify-center items-start gap-2 flex">
        <div className="text-slate-500 text-xs font-medium leading-none">
          PROXIES
        </div>
        <div className="w-full justify-start items-center gap-2 inline-flex">
          <div className="flex-1 flex-col justify-center items-start gap-1 inline-flex">
            <div className="text-white text-xs font-medium leading-none">
              PROPOSALS VOTED
            </div>
            <div className="text-white text-base font-medium leading-normal">
              {proxy.numProposalsVoted}
            </div>
          </div>
          <div className="flex-1 flex-col justify-center items-start gap-1 inline-flex">
            <div className="text-white text-xs font-medium leading-none">
              NUM ASSIGNMENTS
            </div>
            <div className="text-white text-base font-medium leading-normal">
              {proxy.numAssignments}
            </div>
          </div>
        </div>
      </div>
      {votingPower?.gt(new BN(0)) && (
        <>
          <div className="w-full border-b-[1px] border-gray-600" />
          <div className="w-full flex-col justify-center items-start gap-2 flex">
            <div className="text-slate-500 text-xs font-medium leading-none">
              MY PROXIES
            </div>
            <div className="w-full justify-start items-center gap-2 inline-flex">
              <div className="flex-col flex-1 justify-center items-start gap-1 inline-flex">
                <div className="text-white text-xs font-medium leading-none">
                  POWER FROM ME
                </div>
                <div className="text-white text-base font-medium leading-normal">
                  {humanReadable(votingPower, decimals)}
                </div>
              </div>
              <div className="flex-col flex-1 justify-center items-start gap-1 inline-flex">
                <div className="text-white text-xs font-medium leading-none">
                  POSITIONS ASSIGNED
                </div>
                <div className="text-white text-base font-medium leading-normal">
                  {positions?.length}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <ContentSection className="flex-1 py-8 max-md:py-0 max-md:!px-0">
      <Card className="max-md:flex-1 max-md:rounded-none">
        <CardHeader>
          <Link
            href={`/${network}/proxies`}
            className="flex flex-row items-center text-sm gap-2"
          >
            <FaArrowLeft />
            Back to Proxy Voters
          </Link>
          <div className="flex flex-col md:flex-row gap-4">
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
              <div className="hidden md:block border-l border-gray-700 h-12" />
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

          <AssignProxyModal onSubmit={assignProxies} wallet={wallet}>
            <ProxyButton
              className="md:hidden"
              onClick={() => {}}
              isLoading={false}
            />
          </AssignProxyModal>
          <RevokeProxyModal onSubmit={unassignProxies} wallet={wallet}>
            <RevokeProxyButton
              className="md:hidden"
              onClick={() => {}}
              isLoading={false}
            />
          </RevokeProxyModal>
        </CardHeader>

        <div className="md:hidden border-b-2 border-gray-600 mx-4 mb-2" />
        <CardContent>
          <Markdown>{detail}</Markdown>
          <div className="md:hidden">{infoCard}</div>
          <div className="flex flex-row justify-stretch gap-6">
            <div className="overflow-auto flex flex-col justify-stretch w-full">
              <div className="flex flex-col py-4 md:items-center md:flex-row md:justify-between">
                <h2 className="text-white text-xl font-medium">Proposals</h2>
                <ToggleGroup variant="subNav" type="single" value={currentPath}>
                  <ToggleGroupItem value="hnt" aria-label="HNT">
                    <Link
                      className="flex items-center gap-2 p-2"
                      href={`${getNetworkPath("hnt")}`}
                    >
                      <Image
                        width={16}
                        height={16}
                        alt="hnt Icon"
                        src="/images/hntWhite.svg"
                      />
                      HNT
                    </Link>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="mobile" aria-label="MOBILE">
                    <Link
                      className="flex items-center gap-2 p-2"
                      href={`${getNetworkPath("mobile")}`}
                    >
                      <Image
                        width={16}
                        height={16}
                        alt="moile Icon"
                        src="/images/mobileWhite.svg"
                      />
                      MOBILE
                    </Link>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="mobile" aria-label="IOT">
                    <Link
                      className="flex items-center gap-2 p-2"
                      href={`${getNetworkPath("iot")}`}
                    >
                      <Image
                        width={16}
                        height={16}
                        alt="iot Icon"
                        src="/images/iotWhite.svg"
                      />
                      IOT
                    </Link>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              <VoteHistory wallet={wallet} />
            </div>
            <div className="max-md:hidden flex flex-col gap-3 mt-3">
              <AssignProxyModal onSubmit={assignProxies} wallet={wallet}>
                <ProxyButton onClick={() => {}} isLoading={false} />
              </AssignProxyModal>
              <RevokeProxyModal onSubmit={unassignProxies} wallet={wallet}>
                <RevokeProxyButton onClick={() => {}} isLoading={false} />
              </RevokeProxyModal>
              <div className="min-w-[300px]">{infoCard}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </ContentSection>
  );
}
