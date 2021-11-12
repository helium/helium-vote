import getConfig from "next/config";
import cache from "../../../utils/cache";

const { serverRuntimeConfig } = getConfig();
const votes = new Map(serverRuntimeConfig.votes.map((i) => [i.id, i]));

export default async function handler(req, res) {
  const { voteId } = req.query;

  if (!votes.has(voteId)) {
    res.status(404).json({ error: "Vote not found." });
    return;
  }

  const results = await cache.get(
    // the key to look for in the Redis cache
    voteId
  );

  res.status(200).json(results);
}
