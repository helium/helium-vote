import * as anchor from "@coral-xyz/anchor";
import { init as initOrg } from "@helium/organization-sdk";
import { init as initProp } from "@helium/proposal-sdk";
import { sendInstructions, withPriorityFees } from "@helium/spl-utils";
import { init as initState, settings } from "@helium/state-controller-sdk";
import { registrarKey } from "@helium/voter-stake-registry-sdk";
import { Connection, PublicKey } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import os from "os";
import yargs from "yargs";
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
    ver: {
      type: "string",
      default: "V1",
    },
  });
  const argv = await yarg.argv;
  process.env.ANCHOR_WALLET = argv.wallet;
  process.env.ANCHOR_PROVIDER_URL = argv.url;
  anchor.setProvider(anchor.AnchorProvider.local(argv.url));

  const realmKey = PublicKey.findProgramAddressSync(
    [Buffer.from("governance", "utf-8"), Buffer.from(argv.realmName, "utf-8")],
    new PublicKey("hgovkRU6Ghe1Qoyb54HdSLdqN7VtxaifBzRmh9jtd3S")
  )[0];
  console.log("Realm is", realmKey.toBase58());
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
      name: `${argv.name} Single ${argv.ver}`,
      settings: {
        nodes,
      },
    });

  const resolutionSettings = (await initResolutionSettings.pubkeys())
    .resolutionSettings!;
  if (!(await exists(provider.connection, resolutionSettings))) {
    console.log("Creating resolution settings");
    await sendInstructions(
      provider,
      await withPriorityFees({
        connection: provider.connection,
        computeUnits: 200000,
        instructions: [await initResolutionSettings.instruction()],
      })
    );
  }

  const voteController = registrarK;
  const initProposalConfig = proposalProgram.methods.initializeProposalConfigV0(
    {
      name: `${argv.name} Default ${argv.ver}`,
      voteController,
      stateController: resolutionSettings!,
      onVoteHook: stateProgram.programId,
      authority: wallet.publicKey,
    }
  );
  const proposalConfig = (await initProposalConfig.pubkeys()).proposalConfig!;
  if (!(await exists(provider.connection, proposalConfig))) {
    console.log("Creating proposal config");
    await sendInstructions(
      provider,
      await withPriorityFees({
        connection: provider.connection,
        computeUnits: 200000,
        instructions: [await initProposalConfig.instruction()],
      })
    );
  }

  let authority = provider.wallet.publicKey;
  let multisigPda = argv.multisig ? new PublicKey(argv.multisig) : null;
  if (multisigPda) {
    const [vaultPda] = multisig.getVaultPda({
      multisigPda,
      index: 0,
    });
    authority = vaultPda;
  }

  const initOrganization = orgProgram.methods.initializeOrganizationV0({
    name: argv.name,
    defaultProposalConfig: proposalConfig,
    authority,
    proposalProgram: proposalProgram.programId,
    uri: "https://helium.com",
  });

  const organization = (await initOrganization.pubkeys()).organization;
  if (organization) {
    if (!(await exists(provider.connection, organization))) {
      console.log("Creating organization");
      await sendInstructions(
        provider,
        await withPriorityFees({
          connection: provider.connection,
          computeUnits: 200000,
          instructions: [await initOrganization.instruction()],
        })
      );
      console.log(`Created org ${organization.toBase58()}`);
    } else {
      const organizationAcc = await orgProgram.account.organizationV0.fetch(
        organization
      );
      const instruction = await orgProgram.methods
        .updateOrganizationV0({
          defaultProposalConfig: proposalConfig,
          proposalProgram: null,
          uri: null,
          authority,
        })
        .accountsPartial({ organization, authority: organizationAcc.authority })
        .instruction();

      await sendInstructionsOrSquadsV4({
        provider,
        instructions: [instruction],
        multisig: argv.multisig ? new PublicKey(argv.multisig) : undefined,
        signers: [],
      });
    }
  }
}

async function exists(connection: Connection, pkey: PublicKey) {
  return !!(await connection.getAccountInfo(pkey));
}
