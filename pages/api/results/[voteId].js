import getConfig from "next/config";
import { calculateResults } from "../../../data/votes";
import cache from "../../../utils/cache";

const { serverRuntimeConfig } = getConfig();
const votes = new Map(serverRuntimeConfig.votes.map((i) => [i.id, i]));

export default async function handler(req, res) {
  const { voteId } = req.query;

  if (!votes.has(voteId)) {
    res.status(404).json({ error: "Vote not found." });
    return;
  }

  const results = await cache.fetch(
    // the key to look for in the Redis cache
    voteId,
    // the function to call if the key is either not there, or the data is expired
    () => calculateResults(voteId),
    // the time until the data expires (in seconds)
    60 * 10
  );

  res.status(200).json(results);
}
