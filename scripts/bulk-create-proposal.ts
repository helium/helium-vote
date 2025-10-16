import * as anchor from "@coral-xyz/anchor";
import { BN } from "@coral-xyz/anchor";
import { daoKey, init as initHsd } from "@helium/helium-sub-daos-sdk";
import {
  TASK_QUEUE_ID,
  init as initHplCrons,
  queueAuthorityKey,
} from "@helium/hpl-crons-sdk";
import {
  init as initOrg,
  organizationKey,
  proposalKey,
} from "@helium/organization-sdk";
import { HNT_MINT } from "@helium/spl-utils";
import { init as initState } from "@helium/state-controller-sdk";
import { init as initTuktuk, nextAvailableTaskIds, taskKey } from "@helium/tuktuk-sdk";
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import Squads from "@sqds/sdk";
import fs from "fs";
import os from "os";
import yargs from "yargs/yargs";
import { loadKeypair, sendInstructionsOrSquadsV4 } from "./utils";

interface Choice {
  uri: string;
  name: string;
}
interface Proposal {
  name: string;
  uri: string;
  maxChoicesPerVoter: number;
  choices: Choice[];
  proposalConfig?: string;
  tags: string[];
}

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
    file: {
      alias: "f",
      required: true,
      describe: "Path to the JSON file containing proposal details",
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
  const hsdProgram = await initHsd(provider);
  const dao = daoKey(HNT_MINT)[0];

  const squads = Squads.endpoint(process.env.ANCHOR_PROVIDER_URL, wallet, {
    commitmentOrConfig: "finalized",
  });
  let authority = provider.wallet.publicKey;
  const multisig = argv.multisig ? new PublicKey(argv.multisig) : null;
  if (multisig) {
    authority = squads.getAuthorityPDA(multisig, argv.authorityIndex);
  }

  const fileData = fs.readFileSync(argv.file, "utf8");
  const proposals: Proposal[] = JSON.parse(fileData);

  const queueAuthority = queueAuthorityKey()[0];
  console.log(
    `Queue authority: ${queueAuthority.toBase58()} (Fund with Sol to pay task rent)`
  );

  const instructions: TransactionInstruction[] = [];
  const organizationK = organizationKey(argv.orgName)[0];
  const organization = await orgProgram.account.organizationV0.fetch(
    organizationK
  );
  const tuktukProgram = await initTuktuk(provider);
  const hplCronsProgram = await initHplCrons(provider);

  const queue = await tuktukProgram.account.taskQueueV0.fetch(TASK_QUEUE_ID);
  const freeTasks = nextAvailableTaskIds(
    queue.taskBitmap,
    proposals.length - organization.numProposals
  );
  let freeTaskIdx = 0;
  const proposalConfig = argv.proposalConfig
    ? new PublicKey(argv.proposalConfig)
    : organization.defaultProposalConfig;
  const proposalConfigAcc = await stateProgram.account.proposalConfigV0.fetch(
    proposalConfig
  );

  let i = 0;
  for (const proposalData of proposals) {
    if (i >= organization.numProposals) {
      console.log(`Creating proposal ${i}`);
      const {
        instruction,
        pubkeys: { proposal },
      } = await orgProgram.methods
        .initializeProposalV0(proposalData)
        .accountsPartial({
          organization: organizationK,
          owner: authority,
          authority,
          payer: authority,
          proposal: proposalKey(organizationK, i)[0],
        })
        .prepare();

      const { instruction: setState } = await stateProgram.methods
        // @ts-ignore
        .updateStateV0({
          newState: {
            voting: {
              startTs: new BN(Date.now() / 1000)
            }
          },
        })
        .accountsPartial({
          proposal,
          owner: authority,
          proposalConfig: proposalData.proposalConfig
            ? new PublicKey(proposalData.proposalConfig)
            : organization.defaultProposalConfig,
          proposalProgram: organization.proposalProgram,
        })
        .prepare();

      const resolveIx = await hplCronsProgram.methods
        .queueResolveProposalV0({
          freeTaskId: freeTasks[freeTaskIdx],
        })
        .accountsPartial({
          proposal: proposal!,
          taskQueue: TASK_QUEUE_ID,
          namespace: organizationK,
          task: taskKey(TASK_QUEUE_ID, freeTasks[freeTaskIdx])[0],
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
          dao,
          proposal: proposal!,
        })
        .instruction();

      freeTaskIdx++;
      instructions.push(
        instruction,
        setState,
        resolveIx,
        addRecentProposalToDaoIx
      );
    }
    i++;
  }

  await sendInstructionsOrSquadsV4({
    provider,
    instructions,
    multisig: argv.multisig ? new PublicKey(argv.multisig) : undefined,
    signers: [],
  });

  console.log(`Proposals created.`);
}
