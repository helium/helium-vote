const { chain, maxBy } = require("lodash");
const { client, TAKE_MAX } = require("./client");
const fetch = require("node-fetch");
const cache = require("./cache");
const { PromisePool } = require("@supercharge/promise-pool");

const dev = process.env.NODE_ENV !== "production";
const server = dev ? "http://localhost:3000" : "https://www.heliumvote.com";

const fetchVoteDetails = async (id) => {
  const voteDetails = await fetch(`${server}/api/votes/${id}`);
  return await voteDetails.json();
};

const calculateResultsForVote = async (id) => {
  try {
    console.log("fetching vote details for:", id);
    const { outcomes, deadline, filters } = await fetchVoteDetails(id);

    // initialize empty results object
    const results = {};

    var deadlineBlock;
    try {
      console.log("fetching deadline details for:", id, "deadline:", deadline);
      deadlineBlock = await client.blocks.get(deadline);
    } catch (e) {
      // console.error(e);
    }

    const tallies = [];

    // build one array of all payment and burn txns for all options through the roles endpoint
    // loop through them all before starting to tally, so we can make sure for any given payer, only their latest vote gets counted.
    // otherwise, if building that index to check against during the loop, it wouldn't have the complete list to find the transaction from any given payer with the largest height

    const allRoles = [];
    await Promise.all(outcomes.map(async (outcome) => {
      const { address } = outcome;
      
      const activityOptions = {};
      activityOptions.filterTypes = ["token_burn_v1", "payment_v2"];
      if (deadlineBlock) {
        activityOptions.maxTime = new Date(deadlineBlock.time * 1000);
      }

      console.log("fetching roles for:", id, "address:", address);
      // get all roles for this wallet
      const list = await client
        .account(address)
        .roles.list(activityOptions);

      const payments = await list.take(TAKE_MAX);
      allRoles.push(...payments);
    }));

    await PromisePool.for(allRoles).withConcurrency(5).process(async ({hash, height}) => {
      if (height > deadline) return;

      const txn = await client.transactions.get(hash);

      // apply filters
      if (filters && filters.length > 0 && filters.includes(txn.payer)) return;

      switch (txn.type) {
        case "payment_v2":
          txn.payments.forEach(({ payee }) => {
            const tally = { height: txn.height, payer: txn.payer, payee }
            tallies.push(tally);
          });
          break;
        case "token_burn_v1":
          const tally = { height: txn.height, payer: txn.payer, payee: txn.payee }
          tallies.push(tally);
          break;
        default:
          // console.log(txn.type);
      }
    })

    const ungroupedTalliesToCount = chain(tallies)
      .groupBy((tally) => tally.payer)
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

        await PromisePool.for(ungroupedTalliesToCount).withConcurrency(5).process(async ({ height, payer: voter, payee }) => {
          if (height > deadline) return;

          // tally the votes for this outcome, skip everything else
          if (payee === address) {
            // get snapshot of account as of the deadline block
            const account = await client.accounts.get(voter, {
              maxBlock: deadline,
            });

            const totalBalance = account.balance.plus(account.stakedBalance);
            summedVotedHnt += parseInt(totalBalance.integerBalance);

            votingWallets++;
          }
        });
        console.log("tracking balance for vote:", id, "outcome:", address, "total:", summedVotedHnt);

        outcome.hntVoted = summedVotedHnt;
        outcome.uniqueWallets = votingWallets;

        outcomesResults.push(outcome);
      })
    );

    console.log("calculated results for:", id);
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
      console.log("calculating:", id);
      const voteResults = await calculateResultsForVote(id);

      await cache.set(id, voteResults);
    })
  );
  return process.exit(0);
};

checkVotes();
