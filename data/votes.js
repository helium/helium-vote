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

  const allBurnPayerTxns = [];

  await Promise.all(
    outcomesTest.map(async (outcome) => {
      i = 0;

      // outcomes.map(async (outcome) => {
      const { address } = outcome;

      // get all token burns for this wallet
      const list = await client.account(address).activity.list({
        filterTypes: ["token_burn_v1"],
      });

      const burns = await list.take(TAKE_MAX);

      // check payers of burns against list of all payers (across vote options)
      const filteredBurnsList = burns.filter((burnTxn) => {
        const burnPayer = burnTxn.payer;
        const matchIndex = allBurnPayTxns.findIndex(
          ({ payer: existingPayer }) => burnPayer === existingPayer
        );

        if (matchIndex !== -1) {
          console.log("match");
          console.log(matchIndex);
          // .find will only find the first match
          // so we need to check the remainder of the array after the first match

          // create remainder array to search
          const remainingAllBurnTxns = allBurnPayTxns.slice(-matchIndex);

          // create results array of matches (with the first one at the start)
          const txnsWithSamePayer = [].push(allBurnPayTxns[matchIndex]);

          //  use .filter on remainder array to see if there were > 1 match (to get the latest one)
          const moreMatches = remainingAllBurnTxns.filter(
            ({ payer: existingPayer }) => burnPayer === existingPayer
          );

          //TODO: return false if not latest txn
        }

        allBurnPayerTxns.push(burnTxn);
      });

      // if there is a match, ignore their vote if the one for the other option was more recent

      // make new array of unique payer addresses in burns list
      // [...new Set(array)] is an ES6 shortcut for eliminating dupes
      //
      const burnPayers = [
        ...new Set(filteredBurnsList.map(({ payer }) => payer)),
      ];

      // burnPayers.push("145jrRJ82ik95xnJ96eJJeanTamy35DWAXFPp1tGDYStcmqU74A");

      // allBurnPayerWallets.push(...burnPayers);

      // console.log(allBurnPayerWallets.length);

      // sum balances of unique payer addresses (including staked)
      let summedVotedHnt = 0.0;
      let uniqueWallets = 0;

      await Promise.all(
        burnPayers.map(async (voter) => {
          const alreadyVoted = allBurnPayerWallets.find(
            (existingVoter) => voter === existingVoter
          );
          if (alreadyVoted) {
            console.log(alreadyVoted);
          }
          if (i < 100) {
            i++;
            const account = await client.accounts.get(voter);
            const totalBalance = account.balance.plus(account?.stakedBalance);

            summedVotedHnt =
              summedVotedHnt + parseFloat(totalBalance.integerBalance);

            uniqueWallets++;
          }
        })
      );

      i = 0;

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
