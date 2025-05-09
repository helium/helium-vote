import * as anchor from "@coral-xyz/anchor";
import { init } from "@helium/proposal-sdk";
import os from "os";
import yargs from "yargs/yargs";
import { init as initState } from "@helium/state-controller-sdk";
import Squads from "@sqds/sdk";
import { PublicKey } from "@solana/web3.js";
import { loadKeypair, sendInstructionsOrSquads } from "./utils";

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
      describe: "The key of the proposal",
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
  const stateProgram = await initState(provider);
  const proposalProgram = await init(provider);

  const squads = Squads.endpoint(process.env.ANCHOR_PROVIDER_URL, wallet, {
    commitmentOrConfig: "finalized",
  });
  let authority = provider.wallet.publicKey;
  const multisig = argv.multisig ? new PublicKey(argv.multisig) : null;
  if (multisig) {
    authority = squads.getAuthorityPDA(multisig, argv.authorityIndex);
  }

  const proposal = new PublicKey(argv.proposal);
  const owner = (await proposalProgram.account.proposalV0.fetch(proposal)).owner;
  const instruction = await stateProgram.methods
    .updateStateV0({
      newState: { cancelled: {} },
    })
    .accountsPartial({
      proposal,
      owner,
    })
    .instruction();

  await sendInstructionsOrSquads({
    provider,
    instructions: [instruction],
    executeTransaction: false,
    squads,
    multisig: argv.multisig ? new PublicKey(argv.multisig) : undefined,
    authorityIndex: argv.authorityIndex,
    signers: [],
  });

  console.log(`Proposal cancelled: ${proposal.toBase58()}`);
}
