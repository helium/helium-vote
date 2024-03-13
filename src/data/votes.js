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

const realmProposals = new Map(
  serverRuntimeConfig.realmProposals.map(
    ({
      network,
      publicKey,
      tags,
      name,
      status,
      endTs,
      gist,
      github,
      summary,
      outcomes,
    }) => [
      publicKey,
      {
        network,
        publicKey,
        tags,
        name,
        status,
        endTs,
        gist,
        github,
        summary,
        outcomes,
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

export const fetchRealmProposals = (network) => {
  return Array.from(realmProposals.values()).filter(
    (proposal) => proposal.network === network
  );
};

export const fetchRealmProposal = (publicKey) => {
  return realmProposals.has(publicKey) ? realmProposals.get(publicKey) : null;
};
