import client, { TAKE_MAX } from "./client";
import { chain, maxBy } from "lodash";

const dev = process.env.NODE_ENV !== "production";
export const server = dev
  ? "http://localhost:3000"
  : "https://www.heliumvote.com";

export const fetchVotes = async () => {
  const votes = await fetch(`${server}/api/votes`);
  return await votes.json();
};

export const fetchVoteDetails = async (id) => {
  const voteDetails = await fetch(`${server}/api/votes/${id}`);
  return await voteDetails.json();
};

export const fetchCurrentHeight = async () => {
  return (await fetch(`${server}/api/height`)).json();
};

export const fetchResults = async (id) => {
  const results = await fetch(`${server}/api/results/${id}`);
  return await results.json();
};

export const calculateResults = async (id) => {
  const { outcomes, deadline } = await fetchVoteDetails(id);

  // test values:
  // const outcomes = [
  //   {
  //     address: "14aVVtQvq7QK2FmU3ZFnXM3o3Nodzve8cFjDQniJGJbq6AZ29a7",
  //     value: "strawberry",
  //   },
  //   {
  //     address: "13yWhaorHn8Es6jujCw9HCFAjDyecCv5HMwzoa4gp26awSw7z3b",
  //     value: "vanilla",
  //   },
  //   {
  //     address: "13uWWxgbqa5i9W7SFme6NZ2Brr1jDiga4JP7JdQyBRNer9RGoii",
  //     value: "chocolate",
  //   },
  // ];
  // const deadline = 1059000;

  // initialize empty results object
  const results = {};

  // build one array of all burn txns for all options
  // loop through them all before starting to tally, so we can make sure for any given payer, only their latest vote gets counted.
  // otherwise, if building that index to check against during
  const allBurnPayTxns = [];
  await Promise.all(
    outcomes.map(async (outcome) => {
      const { address } = outcome;

      // get all token burns for this wallet
      const list = await client.account(address).activity.list({
        filterTypes: ["token_burn_v1"],
      });

      const burns = await list.take(TAKE_MAX);

      allBurnPayTxns.push(...burns);
    })
  );

  const unsortedTotalVotesToCount = chain(allBurnPayTxns)
    .groupBy((txn) => txn.payer)
    .map((value, key) => {
      // get each payer's latest burn txn (to one of the outcome addresses)
      const txn = maxBy(value, "height");
      return txn;
    })
    .value();

  const outcomesResults = [];

  await Promise.all(
    outcomes.map(async (outcome) => {
      const { address } = outcome;

      // sum balances
      let summedVotedHnt = 0.0;
      let votingWallets = 0;

      await Promise.all(
        unsortedTotalVotesToCount.map(async (txn) => {
          if (txn.payee === address) {
            const { payer: voter } = txn;

            // TODO: update @helium/http once helium-js PR #249 is merged and a new version is published: https://github.com/helium/helium-js/pull/249
            const account = await client.accounts.get(voter, {
              maxBlock: deadline,
            });

            const totalBalance = account.balance.plus(account.stakedBalance);

            summedVotedHnt =
              summedVotedHnt + parseInt(totalBalance.integerBalance);

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
};
