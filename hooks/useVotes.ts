import { Program } from "@coral-xyz/anchor";
import { useAnchorProvider } from "@helium/helium-react-hooks";
import { VoterStakeRegistry } from "@helium/idls/lib/types/voter_stake_registry";
import { init } from "@helium/voter-stake-registry-sdk";
import { PublicKey } from "@solana/web3.js";
import { useAsync } from "react-async-hook";

export function useVotes(proposal: PublicKey) {
  const provider = useAnchorProvider();
  const { result: sdk, loading: loadingSdk } = useAsync(
    async (provider) => init(provider),
    [provider]
  );
  // @ts-ignore
  const { result: markers, loading } = useAsync(
    async (sdk: Program<VoterStakeRegistry> | undefined) => {
      if (sdk) {
        return (await sdk.account.voteMarkerV0.all([
          {
            memcmp: {
              offset: 8 + (2 * 32),
              bytes: proposal.toBase58()
            }
          },
        ])).map(i => i.account);
      }
    },
    [sdk]
  );

  return {
    loading: loading || loadingSdk,
    markers
  }
}
