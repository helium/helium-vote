import client, { TAKE_MAX } from "./client";

const dev = process.env.NODE_ENV !== "production";
export const server = dev ? "http://localhost:3000" : "https://heliumvote.com";

export const fetchVotes = async () => {
  const votes = await fetch(`${server}/api/votes`);
  return await votes.json();
};

export const fetchVoteDetails = async (id) => {
  const voteDetails = await fetch(`${server}/api/votes/${id}`);
  return await voteDetails.json();
};

export const fetchCurrentHeight = async () => {
  const { height } = await (await fetch(`${server}/api/height`)).json();
  return height;
};

// TODO: move into a job that can run every 10 min and have the results be accessible at an endpoint (like explorer-api)
export const calculateResults = async (id) => {
  const { outcomes } = await fetchVoteDetails(id);

  // const outcomesTest = [
  //   {
  //     address: "13ENbEQPAvytjLnqavnbSAzurhGoCSNkGECMx7eHHDAfEaDirdY",
  //     value: "calchip",
  //   },
  //   {
  //     address: "13Zni1he7KY9pUmkXMhEhTwfUpL9AcEV1m2UbbvFsrU9QPTMgE3",
  //     value: "nebra",
  //   },
  // ];

  // initialize results array
  const outcomeResults = [];
  const results = {};

  // loop through all outcome wallets
  await Promise.all(
    outcomes.map(async (outcome) => {
      const { address } = outcome;

      // get all token burns for this wallet
      const list = await client.account(address).activity.list({
        filterTypes: ["token_burn_v1"],
      });

      const burns = await list.take(TAKE_MAX);

      // make new array of unique payer addresses in burns list
      // [...new Set(array)] is an ES6 shortcut for eliminating dupes
      const burnPayers = [...new Set(burns.map(({ payer }) => payer))];

      // sum balances of unique payer addresses (including staked)
      let summedVotedHnt = 0.0;
      let uniqueWallets = 0;

      await Promise.all(
        burnPayers.map(async (voter) => {
          const account = await client.accounts.get(voter);
          const totalBalance = account.balance.plus(account?.stakedBalance);

          summedVotedHnt =
            summedVotedHnt + parseFloat(totalBalance.integerBalance);

          uniqueWallets++;
        })
      );

      // set total sum of balances as outcome.total
      outcome.hntVoted = summedVotedHnt;
      outcome.uniqueWallets = uniqueWallets;

      // push outcome to outcomeResults array
      outcomeResults.push(outcome);
    })
  );

  results.outcomes = outcomeResults;
  results.timestamp = Date.now();

  return results;
};
