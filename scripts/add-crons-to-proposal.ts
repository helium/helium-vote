import * as anchor from "@coral-xyz/anchor";
import os from "os";
import yargs from "yargs/yargs";
import { init as initProposal } from "@helium/proposal-sdk";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { loadKeypair, sendInstructionsOrSquads } from "./utils";
import { init as initTuktuk, taskKey } from "@helium/tuktuk-sdk";
import { init as initHsd, daoKey } from "@helium/helium-sub-daos-sdk";
import {
  nextAvailableTaskIds,
  queueAuthorityKey,
  TASK_QUEUE_ID,
} from "@helium/hpl-crons-sdk";
import { init as initHplCrons } from "@helium/hpl-crons-sdk";
import { HNT_MINT, sendInstructions } from "@helium/spl-utils";

export async function run(args: any = process.argv) {
  const yarg = yargs(args).options({
    wallet: {
      alias: "k",
      describe: "Anchor wallet keypair",
      default: `${os.homedir()}/.config/solana/id.json`,
    },
    url: {
      alias: "u",
      default: "http://127.0.0.1:8899",
      describe: "The solana url",
    },
    proposal: {
      required: true,
      type: "string",
      describe: "The proposal public key",
    },
  });

  const argv = await yarg.argv;
  process.env.ANCHOR_WALLET = argv.wallet;
  process.env.ANCHOR_PROVIDER_URL = argv.url;
  anchor.setProvider(anchor.AnchorProvider.local(argv.url));

  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const proposalProgram = await initProposal(provider);
  const tuktukProgram = await initTuktuk(provider);
  const hplCronsProgram = await initHplCrons(provider);
  const hsdProgram = await initHsd(provider);

  const proposal = new PublicKey(argv.proposal);
  const proposalAcc = await proposalProgram.account.proposalV0.fetch(proposal);
  const proposalConfigAcc = await proposalProgram.account.proposalConfigV0.fetch(
    proposalAcc.proposalConfig
  );

  const queueAuthority = queueAuthorityKey()[0];
  console.log(
    `Queue authority: ${queueAuthority.toBase58()} (Fund with Sol to pay task rent)`
  );

  const queue = await tuktukProgram.account.taskQueueV0.fetch(TASK_QUEUE_ID);
  const freeTask = nextAvailableTaskIds(queue.taskBitmap, 1)[0];

  const resolveIx = await hplCronsProgram.methods
    .queueResolveProposalV0({
      freeTaskId: freeTask,
    })
    .accountsPartial({
      proposal,
      taskQueue: TASK_QUEUE_ID,
      task: taskKey(TASK_QUEUE_ID, freeTask)[0],
      proposalConfig: proposalAcc.proposalConfig,
      stateController: proposalConfigAcc.stateController,
      payer: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
      queueAuthority,
      tuktukProgram: tuktukProgram.programId,
      namespace: proposalAcc.namespace,
    })
    .instruction();

  const addRecentProposalToDaoIx = await hsdProgram.methods
    .addRecentProposalToDaoV0()
    .accounts({
      dao: daoKey(HNT_MINT)[0],
      proposal,
    })
    .instruction();

  await sendInstructions(provider, [resolveIx, addRecentProposalToDaoIx]);

  console.log(`Proposal resolve queued and added to recent: ${proposal.toBase58()}`);
} 