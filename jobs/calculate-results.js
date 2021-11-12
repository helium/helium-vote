const { chain, maxBy } = require("lodash");
const { client, TAKE_MAX } = require("./client");
const fetch = require("node-fetch");
const cache = require("./cache");

const dev = process.env.NODE_ENV !== "production";
const server = dev ? "http://localhost:3000" : "https://www.heliumvote.com";

const fetchVoteDetails = async (id) => {
  const voteDetails = await fetch(`${server}/api/votes/${id}`);
  return await voteDetails.json();
};

const calculateResultsForVote = async (id) => {
  try {
    const { outcomes, deadline } = await fetchVoteDetails(id);

    // initialize empty results object
    const results = {};

    // build one array of all burn txns for all options
    // loop through them all before starting to tally, so we can make sure for any given payer, only their latest vote gets counted.
    // otherwise, if building that index to check against during the loop, it wouldn't have the complete list to find the transaction from any given payer with the largest height
    const allBurnPayTxns = [];
    await Promise.all(
      outcomes.map(async (outcome) => {
        const { address } = outcome;

        const activityOptions = {};
        activityOptions.filterTypes = ["token_burn_v1"];

        try {
          const deadlineBlock = await client.blocks.get(deadline);
          activityOptions.maxTime = new Date(deadlineBlock.time * 1000);
        } catch (e) {
          // console.error(e);
        }

        // get all token burns for this wallet
        const list = await client
          .account(address)
          .activity.list(activityOptions);

        const burns = await list.take(TAKE_MAX);

        allBurnPayTxns.push(...burns);
      })
    );

    const ungroupedAllVotesToCount = chain(allBurnPayTxns)
      .groupBy((txn) => txn.payer)
      .map((value, key) => {
        // get each payer's latest burn txn
        const txn = maxBy(value, "height");
        return txn;
      })
      .value();

    const outcomesResults = [];

    await Promise.all(
      outcomes.map(async (outcome) => {
        // loop through all different outcomes (e.g. chocolate, vanilla, strawberry)
        const { address } = outcome;

        // initialize totals
        let summedVotedHnt = 0.0;
        let votingWallets = 0;

        await Promise.all(
          ungroupedAllVotesToCount.map(async (txn) => {
            if (txn.height > deadline) return;

            // tally the votes for this outcome, skip everything else
            if (txn.payee === address) {
              const { payer: voter } = txn;

              // get snapshot of account as of the deadline block
              const account = await client.accounts.get(voter, {
                maxBlock: deadline,
              });

              const totalBalance = account.balance.plus(account.stakedBalance);

              summedVotedHnt += parseInt(totalBalance.integerBalance);

              votingWallets++;
            }
          })
        );

        outcome.hntVoted = summedVotedHnt;
        outcome.uniqueWallets = votingWallets;

        outcomesResults.push(outcome);
      })
    );

    results.outcomes = outcomesResults;
    results.timestamp = Date.now();
    return results;
  } catch (e) {
    console.error(e);
    return null;
  }
};

const checkVotes = async () => {
  const height = await client.blocks.getHeight();
  const votes = await (await fetch(`${server}/api/votes`)).json();

  const activeVotes = votes.filter(({ deadline }) => deadline > height);

  await Promise.all(
    activeVotes.map(async ({ id }) => {
      console.log("calculating: ", id);
      const voteResults = await calculateResultsForVote(id);

      await cache.set(id, voteResults);
    })
  );
  return process.exit(0);
};

checkVotes();
