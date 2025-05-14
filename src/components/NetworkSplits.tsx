import { humanReadable } from "@/lib/utils"
import { useDataBurnSplit, useSubDaoDelegationSplit } from "@helium/voter-stake-registry-hooks"
import { useGovernance } from "@/providers/GovernanceProvider"
import BN from "bn.js"
import { SplitBar } from "./SplitBar"

export const NetworkSplits = () => {
  const { voteService } = useGovernance()
  const { data: revData, isLoading: revLoading } = useDataBurnSplit({
    voteService,
  })
  const { iot: iotDataUsageRev = 0, mobile: mobileDataUsageRev = 0 } =
    (revData || {}) as { iot: number; mobile: number }
  const { data: delegationData, isLoading: delegationLoading } =
    useSubDaoDelegationSplit({
      voteService,
    })
  const {
    iot: iotDelegation = new BN(0),
    mobile: mobileDelegation = new BN(0),
  } = (delegationData || {}) as { iot: BN; mobile: BN }

  const totalDataUsage = Number(mobileDataUsageRev) + Number(iotDataUsageRev)
  const totalVetokens =
    mobileDelegation && iotDelegation
      ? new BN(mobileDelegation).add(new BN(iotDelegation))
      : new BN(0)

  const mobileDelegationPercentage =
    mobileDelegation && totalVetokens.gt(new BN(0))
      ? new BN(mobileDelegation)
          .mul(new BN(10000))
          .div(totalVetokens)
          .toNumber() / 100
      : 0

  const iotDelegationPercentage =
    iotDelegation && totalVetokens.gt(new BN(0))
      ? new BN(iotDelegation).mul(new BN(10000)).div(totalVetokens).toNumber() /
        100
      : 0

  const mobileDataUsagePercentage =
    totalDataUsage > 0
      ? (Number(mobileDataUsageRev) / totalDataUsage) * 100
      : 0

  const iotDataUsagePercentage =
    totalDataUsage > 0 ? (Number(iotDataUsageRev) / totalDataUsage) * 100 : 0

  if (revLoading || delegationLoading) return null

  return (
    <div className="flex flex-col gap-4 mb-4">
      <SplitBar
        title="Data Usage Revenue (30 days)"
        leftValue={`$${humanReadable(
          new BN(mobileDataUsageRev.toFixed(0)),
          0
        )?.replace(".00", "")}`}
        rightValue={`$${humanReadable(
          new BN(iotDataUsageRev.toFixed(0)),
          0
        )?.replace(".00", "")}`}
        leftPercentage={mobileDataUsagePercentage}
        rightPercentage={iotDataUsagePercentage}
        leftColor="bg-blue-500"
        rightColor="bg-green-500"
        leftLabel="Mobile"
        rightLabel="IoT"
      />
      <SplitBar
        title="HNT Emissions Split from Delegations"
        leftValue={`${mobileDelegationPercentage.toFixed(1)}%`}
        rightValue={`${iotDelegationPercentage.toFixed(1)}%`}
        leftPercentage={mobileDelegationPercentage}
        rightPercentage={iotDelegationPercentage}
        leftColor="bg-blue-500"
        rightColor="bg-green-500"
        leftLabel="Mobile"
        rightLabel="IoT"
      />
    </div>
  )
} 