import getConfig from "next/config";

const cachedData = require('./cache.json');
const { serverRuntimeConfig } = getConfig();
const votes = new Map(serverRuntimeConfig.votes.map(({
    id,
    deadline,
    link,
    name,
    tags,
    authors,
    description,
    filters,
  }) => [id, {
    id,
    deadline,
    link,
    name,
    tags,
    authors,
    description,
    deadlineTs: cachedData[id].deadline_ts,
    outcomes: cachedData[id].outcomes,
    filters: (filters ? filters : []),
  }]));


export const fetchVotes = () => {
  return Array.from(votes.values());
};

export const fetchVoteDetails = (id) => {
  return votes.has(id) ? votes.get(id) : null;
};

export const fetchResults = (id) => {
  if (!(votes.has(id)) || !(id in cachedData)) {
    return null;
  }

  const { outcomes, timestamp: ts, deadline_ts } = cachedData[id];
  return { outcomes, timestamp: ts*1000, deadline_ts };
};
