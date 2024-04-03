import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { VoterStakeRegistry } from "@helium/idls/lib/types/voter_stake_registry";
import { init } from "@helium/voter-stake-registry-sdk";
import { useConnection } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useAsync } from "react-async-hook";

export function useVotes(proposal: PublicKey) {
  const { connection } = useConnection();
  const { result: sdk, loading: loadingSdk } = useAsync(
    async (connection: Connection) =>
      init(new AnchorProvider(connection, {} as any, {})),
    [connection]
  );

  // @ts-ignore
  const { result: markers, loading } = useAsync(
    async (sdk: Program<VoterStakeRegistry> | undefined) => {
      if (sdk) {
        return (
          await sdk.account.voteMarkerV0.all([
            {
              memcmp: {
                offset: 8 + 2 * 32,
                bytes: proposal.toBase58(),
              },
            },
          ])
        ).map((i) => i.account);
      }
    },
    [sdk]
  );

  return {
    loading: loading || loadingSdk,
    markers,
  };
}
