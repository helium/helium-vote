import * as anchor from "@coral-xyz/anchor";
import { init as initOrg, organizationKey } from "@helium/organization-sdk";
import os from "os";
import yargs from "yargs/yargs";
import { init as initState } from "@helium/state-controller-sdk";

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
    choices: {
      alias: "c",
      default: ["Yes", "No"],
    },
    proposalConfig: {
      default: "Helium Single Choice Default",
    },
    orgName: {
      type: "string",
      required: true,
      description: "Organization name. Could be Helium, Helium Mobile, Helium IOT"
    }
  });
  const argv = await yarg.argv;
  process.env.ANCHOR_WALLET = argv.wallet;
  process.env.ANCHOR_PROVIDER_URL = argv.url;
  anchor.setProvider(anchor.AnchorProvider.local(argv.url));

  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const orgProgram = await initOrg(provider);
  const stateProgram = await initState(provider);

  const {
    pubkeys: { proposal },
  } = await orgProgram.methods
    .initializeProposalV0({
      maxChoicesPerVoter: 1,
      name: argv.name,
      uri: argv.proposalUri,
      choices: argv.choices.map((c) => ({
        name: c,
        uri: null,
      })),
      tags: ["test", "tags"],
    })
    .accounts({ organization: organizationKey(argv.orgName)[0] })
    .rpcAndKeys({ skipPreflight: true });

  await stateProgram.methods
    .updateStateV0({
      newState: { voting: {} },
    })
    .accounts({ proposal })
    .rpc();

  console.log(`Proposal created: ${proposal.toBase58()}`);
}
