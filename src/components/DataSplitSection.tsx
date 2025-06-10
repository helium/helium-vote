"use client";

import Link from "next/link";
import { DataSplitBars } from "./DataSplitBars";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { useGovernance } from "@/providers/GovernanceProvider";
import { BN } from "@project-serum/anchor";
import { useSolanaUnixNow } from "@helium/helium-react-hooks";

export const DataSplitSection = () => {
  const path = usePathname();
  const basePath = path.split("/").slice(0, 2).join("/");
  const { positions } = useGovernance();
  const now = useSolanaUnixNow();
  const unexpiredPositions = positions?.filter(
    (p) => p.lockup.endTs.gt(new BN(now || "0")) && !p.isProxiedToMe
  );

  return (
    <div className="flex flex-col py-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-10">
        Network Delegation
      </h2>
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex-1">
          <div className="space-y-4 max-w-lg">
            <p className="text-lg text-slate-400">
              Delegating your staked HNT to a subnetwork and voting regularly earns you HNT rewards.
            </p>
            <p className="text-lg text-slate-400">
              Delegation percentages drive the amount of HNT emissions that go towards each subnetwork&apos;s growth. Delegate to the subnetwork you believe offers the greatest potential for future revenue.
            </p>
          </div>
        </div>
        <div className="flex-1 w-full max-w-xl">
          <DataSplitBars />
          <div className="flex justify-end mt-6">
            <Link href={unexpiredPositions?.length ? `${basePath}/positions/delegate-all` : `${basePath}/positions`}>
              <Button 
                size="lg" 
                className="bg-[#4066FF] hover:bg-[#4066FF]/90 text-white font-medium px-8 py-6 text-lg rounded-xl transition-colors"
              >
                Delegate Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
