import getConfig from "next/config";

const cachedData = require("./cache.json");
const { serverRuntimeConfig } = getConfig();
const legacyProposals = new Map(
  serverRuntimeConfig.legacyProposals.map(
    ({ id, deadline, link, name, tags, authors, description, filters }) => [
      id,
      {
        id,
        deadline,
        link,
        name,
        tags,
        authors,
        description,
        deadlineTs: cachedData[id].deadline_ts,
        outcomes: cachedData[id].outcomes,
        filters: filters ? filters : [],
      },
    ]
  )
);

export const fetchLegacyProposals = () => {
  return Array.from(legacyProposals.values());
};

export const fetchLegacyProposal = (id) => {
  return legacyProposals.has(id) ? legacyProposals.get(id) : null;
};
