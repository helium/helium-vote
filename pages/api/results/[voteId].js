import { fetchResults } from "../../../data/votes";

export default async function handler(req, res) {
  const { voteId } = req.query;
  const results = fetchResults(voteId);
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(404).json({ error: "Vote not found." });
  }
}
