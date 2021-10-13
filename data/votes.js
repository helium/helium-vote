import { Client } from "@helium/http";

export const fetchVotes = async () => {
  const votes = await fetch("/api/votes");
  return await votes.json();
};

export const fetchVoteDetails = async (id) => {
  const voteDetails = await fetch(`/api/votes/${id}`);
  return await voteDetails.json();
};

export const fetchCurrentHeight = async () => {
  const { height } = await (await fetch(`/api/height`)).json();
  return height;
};

// TODO: move into a job that can run every 10 min and have the results be accessible at an endpoint (like explorer-api)
export const calculateResults = async (id) => {
  const { outcomes } = await fetchVoteDetails(id);

  // initialize results array
  const results = [];

  // loop through all outcome wallets
  outcomes.map(async (outcome) => {
    // get all token burns for this wallet
    const client = new Client();
    const list = await client
      .account(outcome.address)
      .activity.list({ filterTypes: ["token_burn_v1"] });

    const burns = await list.take(10000);

    // make new array of unique payer addresses in burns list

    // sum balances of unique payer addresses

    // set total sum of balances as outcome.total

    // push outcome to results array
  });

  return results;
};
