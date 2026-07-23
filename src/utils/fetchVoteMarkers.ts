import { AnchorProvider } from "@coral-xyz/anchor";
import { init, voteMarkerKey } from "@helium/voter-stake-registry-sdk";
import { Connection, PublicKey } from "@solana/web3.js";

const CHUNK_SIZE = 100;

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

// Reads each position's on-chain voteMarkerV0 directly from RPC (bypassing the
// account cache) and returns the marker's `choices` array, or null when no
// marker account exists for that position.
export const fetchVoteMarkerChoices = async (
  connection: Connection,
  proposalKey: PublicKey,
  positionMints: string[]
): Promise<Map<string, number[] | null>> => {
  const result = new Map<string, number[] | null>();
  if (positionMints.length === 0) return result;

  const program = await init(new AnchorProvider(connection, {} as any, {}));

  for (const mintBatch of chunk(positionMints, CHUNK_SIZE)) {
    const keys = mintBatch.map(
      (mint) => voteMarkerKey(new PublicKey(mint), proposalKey)[0]
    );
    const markers = await program.account.voteMarkerV0.fetchMultiple(keys);
    mintBatch.forEach((mint, i) => {
      const marker = markers[i];
      result.set(mint, marker ? marker.choices.map((c) => Number(c)) : null);
    });
  }

  return result;
};
