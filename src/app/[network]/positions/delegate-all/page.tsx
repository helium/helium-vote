"use client";

import { useGovernance } from "@/providers/GovernanceProvider";
import { useRouter, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { DelegateAllPositionsPrompt } from "@/components/PositionManager/DelegateAllPositionsPrompt";
import {
  useDelegatePositions,
  SubDaoWithMeta,
} from "@helium/voter-stake-registry-hooks";
import BN from "bn.js";
import { onInstructions } from "@/lib/utils";
import {
  useAnchorProvider,
  useSolanaUnixNow,
} from "@helium/helium-react-hooks";
import { Header } from "@/components/Header";
import { ContentSection } from "@/components/ContentSection";
import { sub } from "date-fns";
import { MOBILE_SUB_DAO_KEY } from "@/lib/constants";
import { toast } from "sonner";
import { WalletSignTransactionError } from "@solana/wallet-adapter-base";

export default function DelegateAllPositionsPage() {
  const router = useRouter();
  const { network } = useParams() as { network: string };
  const { positions, subDaos } = useGovernance();
  const [subDao, setSubDao] = useState<SubDaoWithMeta | null>(
    subDaos?.find((sd) => sd.pubkey.equals(MOBILE_SUB_DAO_KEY)) || null
  );
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const provider = useAnchorProvider();

  const now = useSolanaUnixNow();
  const unexpiredPositions = useMemo(
    () =>
      positions?.filter(
        (p) =>
          (p.lockup.kind.constant || p.lockup.endTs.gt(new BN(now || "0"))) &&
          !p.isProxiedToMe
      ) || [],
    [positions, now]
  );

  const {
    delegatePositions,
    rentFee: solFees = 0,
    prepaidTxFees = 0,
    insufficientBalance = false,
    error,
    loading,
  } = useDelegatePositions({
    automationEnabled,
    positions: unexpiredPositions,
    subDao: subDao || undefined,
  });

  // Redirect if no unexpired positions
  if (positions && unexpiredPositions.length === 0) {
    if (typeof window !== "undefined") router.replace(`/${network}/positions`);
    return null;
  }

  const handleConfirm = async () => {
    try {
      await delegatePositions({
        onInstructions: onInstructions(provider),
      });
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
          isSubmitting={loading}
          onCancel={() => router.back()}
          onConfirm={handleConfirm}
          automationEnabled={automationEnabled}
          setAutomationEnabled={setAutomationEnabled}
          subDao={subDao}
          setSubDao={setSubDao}
          solFees={solFees}
          prepaidTxFees={prepaidTxFees}
          error={error ? String(error) : undefined}
          loading={loading}
          insufficientBalance={!!insufficientBalance}
        />
      </ContentSection>
    </>
  );
}
