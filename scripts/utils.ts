import fs from "fs";
import * as anchor from "@coral-xyz/anchor";
import {
  Commitment,
  ComputeBudgetProgram,
  Keypair,
  PublicKey,
  Signer,
  TransactionInstruction,
} from "@solana/web3.js";
import Squads, { getTxPDA } from "@sqds/sdk";
import { bulkSendTransactions, sendInstructions, withPriorityFees } from "@helium/spl-utils";
import { BN } from "bn.js";
import * as multisig from "@sqds/multisig";
import { packageInstructions } from "./squads-batch-optimizer";

export function loadKeypair(keypair: string): Keypair {
  return Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypair).toString()))
  );
}

export async function sendInstructionsOrSquadsV4({
  provider,
  instructions,
  signers = [],
  payer = provider.wallet.publicKey,
  commitment = "confirmed",
  idlErrors = new Map(),
  multisig: multisigPda,
}: {
  provider: anchor.AnchorProvider;
  instructions: TransactionInstruction[];
  signers?: Signer[];
  payer?: PublicKey;
  commitment?: Commitment;
  idlErrors?: Map<number, string>;
  multisig?: PublicKey;
}): Promise<string | undefined> {
  if (!multisig) {
    return await sendInstructions(
      provider,
      await withPriorityFees({
        connection: provider.connection,
        computeUnits: 1000000,
        instructions,
        feePayer: payer,
      }),
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
      await withPriorityFees({
        connection: provider.connection,
        computeUnits: 1000000,
        instructions: nonMissingSignerIxs,
        feePayer: payer,
      }),
      signers,
      payer,
      commitment,
      idlErrors
    );
  }

  if (squadsSignatures.length >= 2) {
    throw new Error("Too many missing signatures");
  }

  const multisigInfo = await multisig.accounts.Multisig.fromAccountAddress(
    provider.connection,
    multisigPda!
  );

  const transactionIndex = Number(multisigInfo.transactionIndex) + 1;
  const createBatchIx = await multisig.instructions.batchCreate({
    batchIndex: BigInt(transactionIndex),
    creator: provider.wallet.publicKey,
    multisigPda: multisigPda!,
    vaultIndex: 0,
    memo: "Helium-admin-cli batch",
  });
  await sendInstructions(provider, await withPriorityFees({
    connection: provider.connection,
    instructions: [createBatchIx, await multisig.instructions.proposalCreate({
      multisigPda: multisigPda!,
      transactionIndex: BigInt(transactionIndex),
      creator: provider.wallet.publicKey,
      isDraft: true,
    })],
    feePayer: payer,
  }));


  const [vault] = await multisig.getVaultPda({
    multisigPda: multisigPda!,
    index: 0,
    programId: multisig.PROGRAM_ID,
  })
  const { transactionMessages, failedBuckets } = await packageInstructions(instructions.map(ix => [ix]), [], vault)
  const addInstructions = await Promise.all(transactionMessages.map((tm, index) => multisig.instructions.batchAddTransaction({
    batchIndex: BigInt(transactionIndex),
    multisigPda: multisigPda!,
    transactionIndex: index + 1,
    transactionMessage: tm,
    vaultIndex: 0,
    member: provider.wallet.publicKey,
    ephemeralSigners: 0
  })))
  if (failedBuckets.length > 0) {
    throw new Error(`Failed to package instructions: ${failedBuckets.join(", ")}`);
  }

  await bulkSendTransactions(provider, addInstructions.map(ix => ({
    feePayer: provider.wallet.publicKey,
    instructions: [ix],
  })))

  await sendInstructions(provider, await withPriorityFees({
    connection: provider.connection,
    instructions: [await multisig.instructions.proposalActivate({
      multisigPda: multisigPda!,
      transactionIndex: BigInt(transactionIndex),
      member: provider.wallet.publicKey,
    })],
    feePayer: payer,
  }));
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
      await withPriorityFees({
        connection: provider.connection,
        computeUnits: 1000000,
        instructions,
      }),
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
      await withPriorityFees({
        connection: provider.connection,
        computeUnits: 1000000,
        instructions: nonMissingSignerIxs,
      }),
      signers,
      payer,
      commitment,
      idlErrors
    );
  }

  if (squadsSignatures.length >= 2) {
    throw new Error("Too many missing signatures");
  }

  const txIndex = await squads.getNextTransactionIndex(multisig);
  const ix = await squads.buildCreateTransaction(
    multisig,
    authorityIndex!,
    txIndex
  );
  await sendInstructions(
    provider,
    await withPriorityFees({
      connection: provider.connection,
      instructions: [ix],
      computeUnits: 200000,
    })
  );
  const [txKey] = await getTxPDA(
    multisig,
    new BN(txIndex),
    squads.multisigProgramId
  );
  let index = 1;
  for (const ix of instructions.filter(
    (ix) => !ix.programId.equals(ComputeBudgetProgram.programId)
  )) {
    await sendInstructions(
      provider,
      await withPriorityFees({
        connection: provider.connection,
        instructions: [
          await squads.buildAddInstruction(multisig, txKey, ix, index),
        ],
        computeUnits: 200000,
      })
    );
    index++;
  }

  const ixs: TransactionInstruction[] = [];
  ixs.push(await squads.buildActivateTransaction(multisig, txKey));
  ixs.push(await squads.buildApproveTransaction(multisig, txKey));

  if (executeTransaction) {
    ixs.push(
      await squads.buildExecuteTransaction(txKey, provider.wallet.publicKey)
    );
  }

  await sendInstructions(
    provider,
    await withPriorityFees({
      connection: provider.connection,
      computeUnits: 1000000,
      instructions: ixs,
    }),
    signers
  );
}
