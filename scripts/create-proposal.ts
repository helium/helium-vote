import * as anchor from "@coral-xyz/anchor";
import { init as initOrg, organizationKey } from "@helium/organization-sdk";
import os from "os";
import yargs from "yargs/yargs";
import { init as initState } from "@helium/state-controller-sdk";
import Squads from "@sqds/sdk";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { loadKeypair, sendInstructionsOrSquads } from "./utils";
import { init as initTuktuk, taskKey, nextAvailableTaskIds } from "@helium/tuktuk-sdk";
import { init as initHsd, daoKey } from "@helium/helium-sub-daos-sdk";
import {
  queueAuthorityKey,
  TASK_QUEUE_ID,
} from "@helium/hpl-crons-sdk";
import { init as initHplCrons } from "@helium/hpl-crons-sdk";
import { HNT_MINT } from "@helium/spl-utils";

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
    name: {
      required: true,
      alias: "n",
      describe: "The name of the proposal",
      type: "string",
    },
    proposalUri: {
      required: true,
      type: "string",
      describe: "The uri of the proposal",
    },
    maxChoicesPerVoter: {
      type: "number",
      describe: "The number of choices a voter can select at the same time",
      default: 1,
    },
    choices: {
      alias: "c",
      default: ["Yes", "No"],
    },
    proposalConfig: {
      type: "string",
    },
    orgName: {
      type: "string",
      required: true,
      description:
        "Organization name. Could be Helium, Helium Mobile, Helium IOT",
    },
    multisig: {
      type: "string",
      describe:
        "Address of the squads multisig for subdao authority. If not provided, your wallet will be the authority",
    },
    authorityIndex: {
      type: "number",
      describe: "Authority index for squads. Defaults to 1",
      default: 1,
    },
  });
  const argv = await yarg.argv;
  process.env.ANCHOR_WALLET = argv.wallet;
  process.env.ANCHOR_PROVIDER_URL = argv.url;
  anchor.setProvider(anchor.AnchorProvider.local(argv.url));

  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const walletKP = loadKeypair(argv.wallet);
  const wallet = new anchor.Wallet(walletKP);
  const orgProgram = await initOrg(provider);
  const stateProgram = await initState(provider);
  const tuktukProgram = await initTuktuk(provider);
  const hplCronsProgram = await initHplCrons(provider);
  const hsdProgram = await initHsd(provider);
  const organizationK = organizationKey(argv.orgName)[0];
  const organization = await orgProgram.account.organizationV0.fetch(
    organizationK
  );

  const squads = Squads.endpoint(process.env.ANCHOR_PROVIDER_URL, wallet, {
    commitmentOrConfig: "finalized",
  });
  let authority = provider.wallet.publicKey;
  const multisig = argv.multisig ? new PublicKey(argv.multisig) : null;
  if (multisig) {
    authority = squads.getAuthorityPDA(multisig, argv.authorityIndex);
  }

  const {
    instruction,
    pubkeys: { proposal },
  } = await orgProgram.methods
    .initializeProposalV0({
      maxChoicesPerVoter: argv.maxChoicesPerVoter,
      name: argv.name,
      uri: argv.proposalUri,
      choices: argv.choices.map((c) => ({
        name: c,
        uri: null,
      })),
      tags: ["test", "tags"],
    })
    .accountsPartial({
      payer: authority,
      authority,
      organization: organizationK,
      owner: authority,
    })
    .prepare();

  const proposalConfig = argv.proposalConfig
    ? new PublicKey(argv.proposalConfig)
    : organization.defaultProposalConfig;
  const proposalConfigAcc = await stateProgram.account.proposalConfigV0.fetch(
    proposalConfig
  );
  const queueAuthority = queueAuthorityKey()[0];
  console.log(
    `Queue authority: ${queueAuthority.toBase58()} (Fund with Sol to pay task rent)`
  );
  const { instruction: setState } = await stateProgram.methods
    // @ts-ignore
    .updateStateV0({
      newState: { voting: {} },
    })
    .accountsStrict({
      proposal: proposal!,
      owner: authority,
      proposalConfig,
      proposalProgram: organization.proposalProgram,
      stateController: proposalConfigAcc.stateController,
    })
    .prepare();

  const queue = await tuktukProgram.account.taskQueueV0.fetch(TASK_QUEUE_ID);
  const freeTask = nextAvailableTaskIds(queue.taskBitmap, 1)[0];
  const resolveIx = await hplCronsProgram.methods
    .queueResolveProposalV0({
      freeTaskId: freeTask,
    })
    .accountsPartial({
      proposal: proposal!,
      taskQueue: TASK_QUEUE_ID,
      namespace: organizationK,
      task: taskKey(TASK_QUEUE_ID, freeTask)[0],
      proposalConfig,
      stateController: proposalConfigAcc.stateController,
      payer: authority,
      systemProgram: SystemProgram.programId,
      queueAuthority,
      tuktukProgram: tuktukProgram.programId,
    })
    .instruction();

  const addRecentProposalToDaoIx = await hsdProgram.methods
    .addRecentProposalToDaoV0()
    .accounts({
      dao: daoKey(HNT_MINT)[0],
      proposal: proposal!,
    })
    .instruction();

  await sendInstructionsOrSquads({
    provider,
    instructions: [instruction, setState, resolveIx, addRecentProposalToDaoIx],
    executeTransaction: false,
    squads,
    multisig: argv.multisig ? new PublicKey(argv.multisig) : undefined,
    authorityIndex: argv.authorityIndex,
    signers: [],
  });

  console.log(`Proposal created: ${proposal?.toBase58()}`);
}
