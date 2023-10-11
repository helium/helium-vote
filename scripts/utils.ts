import fs from "fs";
import * as anchor from "@coral-xyz/anchor"
import { Commitment, ComputeBudgetProgram, Keypair, PublicKey, Signer, TransactionInstruction } from "@solana/web3.js";
import Squads from "@sqds/sdk";
import { sendInstructions } from "@helium/spl-utils";

export function loadKeypair(keypair: string): Keypair {
  return Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString()))
  );
}

export async function sendInstructionsOrSquads({
  provider,
  instructions,
  signers = [],
  payer = provider.wallet.publicKey,
  commitment = "confirmed",
  idlErrors = new Map(),
  executeTransaction = false,
  squads,
  multisig,
  authorityIndex,
}: {
  executeTransaction?: boolean; // Will execute the transaction immediately. Only works if the squads multisig is only 1 wallet threshold or signers is complete
  provider: anchor.AnchorProvider;
  instructions: TransactionInstruction[];
  signers?: Signer[];
  payer?: PublicKey;
  commitment?: Commitment;
  idlErrors?: Map<number, string>;
  squads: Squads;
  multisig?: PublicKey;
  authorityIndex?: number;
}): Promise<string | undefined> {
  if (!multisig) {
    return await sendInstructions(
      provider,
      instructions,
      signers,
      payer,
      commitment,
      idlErrors
    );
  }

  const signerSet = new Set(
    instructions
      .map((ix) =>
        ix.keys.filter((k) => k.isSigner).map((k) => k.pubkey.toBase58())
      )
      .flat()
  );
  const signerKeys = Array.from(signerSet).map((k) => new PublicKey(k));

  const nonMissingSignerIxs = instructions.filter(
    (ix) =>
      !ix.keys.some(
        (k) => k.isSigner && !k.pubkey.equals(provider.wallet.publicKey)
      )
  );
  const squadsSignatures = signerKeys.filter(
    (k) =>
      !k.equals(provider.wallet.publicKey) &&
      !signers.some((s) => s.publicKey.equals(k))
  );

  if (squadsSignatures.length == 0) {
    return await sendInstructions(
      provider,
      nonMissingSignerIxs,
      signers,
      payer,
      commitment,
      idlErrors
    );
  }

  if (squadsSignatures.length >= 2) {
    throw new Error("Too many missing signatures");
  }

  const tx = await squads.createTransaction(multisig, authorityIndex!);
  for (const ix of instructions.filter(
    (ix) => !ix.programId.equals(ComputeBudgetProgram.programId)
  )) {
    await withRetries(
      3,
      async () => await squads.addInstruction(tx.publicKey, ix)
    );
  }

  await withRetries(
    3,
    async () => await squads.activateTransaction(tx.publicKey)
  );
  await withRetries(
    3,
    async () => await squads.approveTransaction(tx.publicKey)
  );
  if (executeTransaction) {
    const ix = await squads.buildExecuteTransaction(
      tx.publicKey,
      provider.wallet.publicKey
    );
    await sendInstructions(
      provider,
      [ComputeBudgetProgram.setComputeUnitLimit({ units: 800000 }), ix],
      signers
    );
  }
}

async function withRetries<A>(
  tries: number,
  input: () => Promise<A>
): Promise<A> {
  for (let i = 0; i < tries; i++) {
    try {
      return await input();
    } catch (e) {
      console.log(`Retrying ${i}...`, e);
    }
  }
  throw new Error("Failed after retries");
}