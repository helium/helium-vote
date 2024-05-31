import { useGovernance } from "@/providers/GovernanceProvider";
import { PositionWithMeta } from "@helium/voter-stake-registry-hooks";
import { VoteService } from "@helium/voter-stake-registry-sdk";
import { PublicKey } from "@solana/web3.js";
import { useAsync } from "react-async-hook";

export function useKnownProxy(nextVoter: PublicKey | undefined) {
  const { voteService } = useGovernance();
  const {
    result: knownProxy,
    loading,
    error,
  } = useAsync(
    async (nv: PublicKey | undefined, vs: VoteService | undefined) => {
      if (vs && nv && !nv.equals(PublicKey.default)) {
        return (
          await vs.searchProxies({
            query: nv.toBase58(),
          })
        )[0];
      }
    },
    [nextVoter, voteService]
  );

  return { knownProxy, loading, error };
}
