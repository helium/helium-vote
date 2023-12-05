import * as anchor from "@coral-xyz/anchor";
import { init as initOrg, organizationKey } from "@helium/organization-sdk";
import { init as initProp } from "@helium/proposal-sdk";
import { init as initState, settings } from "@helium/state-controller-sdk";
import { registrarKey } from "@helium/voter-stake-registry-sdk";
import { Connection, PublicKey } from "@solana/web3.js";
import os from "os";
import yargs from "yargs";
import Squads from "@sqds/sdk";
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
    realmName: {
      type: "string",
      default: "Helium",
    },
    name: {
      type: "string",
      required: true,
    },
    mint: {
      type: "string",
      required: true,
    },
    authority: {
      type: "string",
      required: true,
      describe: "The authority of the organization",
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
    threshold: {
      type: "number",
      default: "10000000000000000",
    },
    version: {
      type: "string",
      default: "V1"
    }
  });
  const argv = await yarg.argv;
  process.env.ANCHOR_WALLET = argv.wallet;
  process.env.ANCHOR_PROVIDER_URL = argv.url;
  anchor.setProvider(anchor.AnchorProvider.local(argv.url));

  const realmKey = PublicKey.findProgramAddressSync(
    [Buffer.from("governance", "utf-8"), Buffer.from(argv.realmName, "utf-8")],
    new PublicKey("hgovkRU6Ghe1Qoyb54HdSLdqN7VtxaifBzRmh9jtd3S")
  )[0];
  console.log("Realm is", realmKey.toBase58())
  const registrarK = registrarKey(realmKey, new PublicKey(argv.mint))[0];
  console.log("Registrar is", registrarK.toBase58());
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const walletKP = loadKeypair(argv.wallet);
  const wallet = new anchor.Wallet(walletKP);
  const orgProgram = await initOrg(provider);
  const proposalProgram = await initProp(provider);
  const stateProgram = await initState(provider);

  // Must have 100,000,000 veHNT, 67% of the vote. Choose the top one as the winner.
  const nodes = settings()
    .and(
      settings().and(
        settings().top(1),
        settings().and(
          settings().choicePercentage(67),
          //  100,000,000 veHNT
          settings().choiceVoteWeight(new anchor.BN(argv.threshold))
        )
      ),
      settings().offsetFromStartTs(new anchor.BN(60 * 60 * 24 * 7))
    )
    .build();

  const initResolutionSettings =
    stateProgram.methods.initializeResolutionSettingsV0({
      name: `${argv.name} Single ${argv.version}`,
      settings: {
        nodes,
      },
    });

  const resolutionSettings = (await initResolutionSettings.pubkeys())
    .resolutionSettings!;
  if (!(await exists(provider.connection, resolutionSettings))) {
    console.log("Creating resolution settings");
    await initResolutionSettings.rpc({ skipPreflight: true });
  }

  const voteController = registrarK;
  const initProposalConfig = proposalProgram.methods.initializeProposalConfigV0(
    {
      name: `${argv.name} Default ${argv.version}`,
      voteController,
      stateController: resolutionSettings!,
      onVoteHook: stateProgram.programId,
    }
  );
  const proposalConfig = (await initProposalConfig.pubkeys()).proposalConfig!;
  if (!(await exists(provider.connection, proposalConfig))) {
    console.log("Creating proposal config");
    await initProposalConfig.rpc({ skipPreflight: true });
  }

  const squads = Squads.endpoint(process.env.ANCHOR_PROVIDER_URL, wallet, {
    commitmentOrConfig: "finalized",
  });
  let authority = argv.authority
    ? new PublicKey(argv.authority)
    : provider.wallet.publicKey;
  const multisig = argv.multisig ? new PublicKey(argv.multisig) : null;
  if (multisig) {
    authority = squads.getAuthorityPDA(multisig, argv.authorityIndex);
  }

  const initOrganization = orgProgram.methods.initializeOrganizationV0({
    name: argv.name,
    defaultProposalConfig: proposalConfig,
    authority,
    proposalProgram: proposalProgram.programId,
    uri: "https://helium.com",
  });
  const organization = (await initOrganization.pubkeys()).organization;
  if (!(await exists(provider.connection, organization))) {
    console.log("Creating organization");
    await initOrganization.rpc({ skipPreflight: true });
    console.log(`Created org ${organization.toBase58()}`);
  } else {
    const instruction = await orgProgram.methods
      .updateOrganizationV0({
        defaultProposalConfig: proposalConfig,
        proposalProgram: null,
        uri: null,
        authority,
      })
      .accounts({ organization, authority })
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
  }
}

async function exists(connection: Connection, pkey: PublicKey) {
  return !!(await connection.getAccountInfo(pkey));
}
