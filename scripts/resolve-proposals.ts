import * as anchor from "@coral-xyz/anchor";
import { init as initOrg, organizationKey, proposalKey } from "@helium/organization-sdk";
import os from "os";
import yargs from "yargs/yargs";
import { init as initState } from "@helium/state-controller-sdk";
import { init as initProposal } from "@helium/proposal-sdk";
import { AccountFetchCache, chunks } from "@helium/account-fetch-cache";
import { Transaction } from "@solana/web3.js";
import { batchInstructionsToTxsWithPriorityFee, bulkSendTransactions } from "@helium/spl-utils";

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
    orgName: {
      type: "string",
      required: true,
      description:
        "Organization name. Could be Helium, Helium Mobile, Helium IOT",
    },
  });
  const argv = await yarg.argv;
  process.env.ANCHOR_WALLET = argv.wallet;
  process.env.ANCHOR_PROVIDER_URL = argv.url;
  anchor.setProvider(anchor.AnchorProvider.local(argv.url));

  const provider = anchor.getProvider() as anchor.AnchorProvider;
  new AccountFetchCache({
    connection: provider.connection,
    commitment: "confirmed",
    extendConnection: true,
    enableLogging: true
  });
  const orgProgram = await initOrg(provider);
  const stateProgram = await initState(provider);
  const proposalProgram = await initProposal(provider);
  const organizationK = organizationKey(argv.orgName)[0];
  const organization = await orgProgram.account.organizationV0.fetch(organizationK)
  const proposalKeys = Array(organization?.numProposals)
    .fill(0)
    .map((_, index) => proposalKey(organizationK, index)[0])
    .reverse();

  const proposals = await Promise.all(proposalKeys.map(async p => ({
    account: await proposalProgram.account.proposalV0.fetch(p),
    pubkey: p
  })))
  const openProposals = proposals.filter(p => typeof p.account.state.voting !== "undefined")

  const resolveIxs = await Promise.all(openProposals.map(async p => {
    return await stateProgram.methods.resolveV0()
    .accounts({
      proposal: p.pubkey,
    })
    .instruction()
  }))
  const txs = await batchInstructionsToTxsWithPriorityFee(provider, resolveIxs)
  await bulkSendTransactions(provider, txs)
  console.log("Done")
}
