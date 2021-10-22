import client, { TAKE_MAX } from "./client";

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

// TODO: move into a job that can run every 10 min and have the results be accessible at an endpoint (like explorer-api)
export const calculateResults = async (id) => {
  const { outcomes } = await fetchVoteDetails(id);

  const outcomesTest = [
    {
      address: "14aVVtQvq7QK2FmU3ZFnXM3o3Nodzve8cFjDQniJGJbq6AZ29a7",
      value: "strawberry",
    },
    {
      address: "13yWhaorHn8Es6jujCw9HCFAjDyecCv5HMwzoa4gp26awSw7z3b",
      value: "vanilla",
    },
    {
      address: "13uWWxgbqa5i9W7SFme6NZ2Brr1jDiga4JP7JdQyBRNer9RGoii",
      value: "chocolate",
    },
  ];

  // initialize results array
  const outcomeResults = [];
  const results = {};

  // loop through all outcome wallets
  let i = 0;

  let allBurnPayerWallets = [];

  await Promise.all(
    outcomesTest.map(async (outcome) => {
      // outcomes.map(async (outcome) => {
      const { address } = outcome;

      // get all token burns for this wallet
      const list = await client.account(address).activity.list({
        filterTypes: ["token_burn_v1"],
      });

      const burns = await list.take(TAKE_MAX);

      // make new array of unique payer addresses in burns list
      // [...new Set(array)] is an ES6 shortcut for eliminating dupes
      const burnPayers = [...new Set(burns.map(({ payer }) => payer))];

      allBurnPayerWallets = [...allBurnPayerWallets, burnPayers];

      // sum balances of unique payer addresses (including staked)
      let summedVotedHnt = 0.0;
      let uniqueWallets = 0;

      await Promise.all(
        burnPayers.map(async (voter) => {
          i++;
          const alreadyVoted = allBurnPayerWallets.find(
            (existingVoter) => voter === existingVoter
          );
          console.log(alreadyVoted);
          if (i < 30) {
            const account = await client.accounts.get(voter);
            const totalBalance = account.balance.plus(account?.stakedBalance);

            summedVotedHnt =
              summedVotedHnt + parseFloat(totalBalance.integerBalance);

            uniqueWallets++;
          }
        })
      );

      // set total sum of balances as outcome.total
      outcome.hntVoted = summedVotedHnt;
      outcome.uniqueWallets = uniqueWallets;

      // push outcome to outcomeResults array
      outcomeResults.push(outcome);

      i = 0;
    })
  );

  results.outcomes = outcomeResults;
  results.timestamp = Date.now();

  return results;
};
