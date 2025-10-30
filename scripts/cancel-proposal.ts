import * as anchor from "@coral-xyz/anchor";
import { init } from "@helium/proposal-sdk";
import { init as initState } from "@helium/state-controller-sdk";
import { PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import os from "os";
import yargs from "yargs/yargs";
import { loadKeypair, sendInstructionsOrSquadsV4 } from "./utils";

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

  let authority = provider.wallet.publicKey;
  let multisigPda = argv.multisig ? new PublicKey(argv.multisig) : null;
  if (multisigPda) {
    const [vaultPda] = multisig.getVaultPda({
      multisigPda,
      index: 0,
    });
    authority = vaultPda;
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

  await sendInstructionsOrSquadsV4({
    provider,
    instructions: [instruction],
    multisig: argv.multisig ? new PublicKey(argv.multisig) : undefined,
    signers: [],
  });

  console.log(`Proposal cancelled: ${proposal.toBase58()}`);
}
