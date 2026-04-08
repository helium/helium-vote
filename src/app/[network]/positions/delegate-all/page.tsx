"use client";

import { ContentSection } from "@/components/ContentSection";
import { Header } from "@/components/Header";
import { DelegateAllPositionsPrompt } from "@/components/PositionManager/DelegateAllPositionsPrompt";
import { IOT_SUB_DAO_KEY, MOBILE_SUB_DAO_KEY } from "@/lib/constants";
import { IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";
import { useGovernance } from "@/providers/GovernanceProvider";
import { useDelegatePositionMutation } from "@/hooks/useGovernanceMutations";
import {
  useSolanaUnixNow,
} from "@helium/helium-react-hooks";
import {
  SubDaoWithMeta,
} from "@helium/voter-stake-registry-hooks";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";
import BN from "bn.js";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function DelegateAllPositionsPage() {
  const router = useRouter();
  const { network } = useParams() as { network: string };
  const { positions, subDaos } = useGovernance();
  const [subDao, setSubDao] = useState<SubDaoWithMeta | null>(null);
  const [automationEnabled, setAutomationEnabled] = useState(true);

  const delegateMutation = useDelegatePositionMutation();

  const now = useSolanaUnixNow();
  const delegatedPositions = useMemo(
    () => positions?.filter((p) => p.isDelegated) || [],
    [positions]
  );
  const unexpiredPositions = useMemo(
    () =>
      positions?.filter(
        (p) =>
          (p.lockup.kind.constant || p.lockup.endTs.gt(new BN(now || "0"))) &&
          !p.isProxiedToMe
      ) || [],
    [positions, now]
  );

  useEffect(() => {
    if (!subDaos || !delegatedPositions || subDao) return;
    const mobileSubDao = subDaos.find((sd) =>
      sd.pubkey.equals(MOBILE_SUB_DAO_KEY)
    );
    const iotSubDao = subDaos.find((sd) => sd.pubkey.equals(IOT_SUB_DAO_KEY));
    if (!mobileSubDao) return;

    let mobileDelegations = 0;
    let iotDelegations = 0;
    let totalDelegated = 0;

    delegatedPositions?.forEach((position) => {
      if (position.isDelegated && position.delegatedSubDao) {
        totalDelegated += 1;
        if (position.delegatedSubDao.equals(MOBILE_SUB_DAO_KEY)) {
          mobileDelegations += 1;
        } else if (position.delegatedSubDao.equals(IOT_SUB_DAO_KEY)) {
          iotDelegations += 1;
        }
      }
    });

    if (totalDelegated === 0) {
      setSubDao(mobileSubDao);
    } else if (mobileDelegations === totalDelegated) {
      setSubDao(mobileSubDao);
    } else if (iotDelegations === totalDelegated && iotSubDao) {
      setSubDao(iotSubDao);
    } else if (mobileDelegations >= iotDelegations) {
      setSubDao(mobileSubDao);
    } else if (iotDelegations > mobileDelegations && iotSubDao) {
      setSubDao(iotSubDao);
    } else {
      setSubDao(mobileSubDao);
    }
  }, [subDaos, delegatedPositions, subDao]);

  // Redirect if no unexpired positions
  if (positions && unexpiredPositions.length === 0) {
    if (typeof window !== "undefined") router.replace(`/${network}/positions`);
    return null;
  }

  const handleConfirm = async () => {
    try {
      await delegateMutation.submit(
        {
          positionMints: unexpiredPositions.map((p) => p.mint.toBase58()),
          subDaoMint: subDao?.pubkey.equals(IOT_SUB_DAO_KEY) ? IOT_MINT.toBase58() : MOBILE_MINT.toBase58(),
          automationEnabled,
        },
        {
          header: "Delegate All Positions",
          message: "Delegating all positions to subnetwork",
        }
      );
      toast("Delegations updated");
      router.replace(`/${network}/positions`);
    } catch (e: any) {
      console.error(e);
      if (!(e instanceof WalletSignTransactionError)) {
        toast(e.message || "Delegations failed, please try again");
      }
    }
  };

  return (
    <>
      <Header hideHero={true} route={`/${network}/positions`} />
      <ContentSection>
        <DelegateAllPositionsPrompt
          positions={unexpiredPositions}
          isSubmitting={delegateMutation.isPending}
          onCancel={() => router.back()}
          onConfirm={handleConfirm}
          automationEnabled={automationEnabled}
          setAutomationEnabled={setAutomationEnabled}
          subDao={subDao}
          setSubDao={setSubDao}
          solFees={delegateMutation.estimatedSolFee?.uiAmount ?? 0}
          prepaidTxFees={0}
          error={delegateMutation.error ? String(delegateMutation.error) : undefined}
          loading={delegateMutation.isPending}
          insufficientBalance={false}
        />
      </ContentSection>
    </>
  );
}
