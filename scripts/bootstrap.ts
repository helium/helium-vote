import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import os from "os";
import yargs from "yargs";
import { init as initOrg } from "@helium/organization-sdk"
import { init as initProp } from "@helium/proposal-sdk";
import { init as initState, settings } from "@helium/state-controller-sdk";

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
    voteController: {
      type: "string",
      default: "BMnWRWZrWqb6JMKznaDqNxWaWAHoaTzVabM6Qwyh3WKz",
    },
  });
  const argv = await yarg.argv;
  process.env.ANCHOR_WALLET = argv.wallet;
  process.env.ANCHOR_PROVIDER_URL = argv.url;
  anchor.setProvider(anchor.AnchorProvider.local(argv.url));

  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const orgProgram = await initOrg(provider);
  const proposalProgram = await initProp(provider);
  const stateProgram = await initState(provider);

  const nodes = settings().and(
    settings().and(
      settings().top(1),
      settings().choiceVoteWeight(new anchor.BN(1000))
    ),
    settings().offsetFromStartTs(new anchor.BN(60 * 60 * 24 * 7))
  ).build()

  const {
    pubkeys: { resolutionSettings },
  } = await stateProgram.methods
    .initializeResolutionSettingsV0({
      name: "Helium Single Choice Default",
      settings: {
        nodes,
      },
    })
    .rpcAndKeys({ skipPreflight: true });

    const voteController = new PublicKey(argv.voteController);

    const {
      pubkeys: { proposalConfig },
    } = await proposalProgram.methods
      .initializeProposalConfigV0({
        name: "Helium Single Choice Default",
        voteController,
        stateController: resolutionSettings!,
        onVoteHook: stateProgram.programId,
      })
      .rpcAndKeys({ skipPreflight: true });

  const {
    pubkeys: { organization },
  } = await orgProgram.methods
    .initializeOrganizationV0({
      name: "Helium",
      defaultProposalConfig: proposalConfig,
      authority: provider.wallet.publicKey,
      proposalProgram: proposalProgram.programId,
      uri: "https://helium.com",
    })
    .rpcAndKeys({ skipPreflight: true });

  console.log(`Created org ${organization.toBase58()}`)
}
