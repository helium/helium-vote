import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();
const votes = new Map(serverRuntimeConfig.votes.map((i) => [i.id, i]));

export default async function handler(req, res) {
  const { voteId } = req.query;

  if (!votes.has(voteId)) {
    res.status(404).json({ error: "Vote not found." });
    return;
  }

  const { result: results } = await fetch(
    `${process.env.READ_ONLY_REDIS_URL}/get/${voteId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.REDIS_BEARER_TOKEN}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  res.status(200).json(results);
}
