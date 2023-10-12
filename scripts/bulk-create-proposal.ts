import * as anchor from "@coral-xyz/anchor";
import { init as initOrg, organizationKey } from "@helium/organization-sdk";
import os from "os";
import yargs from "yargs/yargs";
import { init as initState } from "@helium/state-controller-sdk";
import Squads from "@sqds/sdk";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { loadKeypair, sendInstructionsOrSquads } from "./utils";
import fs from "fs";

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
  tags: string[]
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

  const instructions: TransactionInstruction[] = [];
  const organizationK = organizationKey(argv.orgName)[0];
  const organization = await orgProgram.account.organizationV0.fetch(
    organizationK
  );

  let i = 0;
  for (const proposalData of proposals) {
    if (i >= organization.numProposals) {
      const {
        instruction,
        pubkeys: { proposal },
      } = await orgProgram.methods
        .initializeProposalV0(proposalData)
        .accounts({
          organization: organizationK,
          owner: authority,
          authority,
        })
        .prepare();

      const { instruction: setState } = await stateProgram.methods
        .updateStateV0({
          newState: { voting: {} },
        })
        .accounts({
          proposal,
          owner: authority,
          proposalConfig: proposalData.proposalConfig
            ? new PublicKey(proposalData.proposalConfig)
            : organization.defaultProposalConfig,
          proposalProgram: organization.proposalProgram,
        })
        .prepare();

      instructions.push(instruction, setState);
    }
    i++;
  }

  await sendInstructionsOrSquads({
    provider,
    instructions,
    executeTransaction: false,
    squads,
    multisig: argv.multisig ? new PublicKey(argv.multisig) : undefined,
    authorityIndex: argv.authorityIndex,
    signers: [],
  });

  console.log(`Proposals created.`);
}
