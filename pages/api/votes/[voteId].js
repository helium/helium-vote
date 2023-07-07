import { fetchVoteDetails } from '../../../data/votes';

export default function handler(req, res) {
  const { voteId } = req.query

  const details = fetchVoteDetails(voteId)
  if (details) {
    res.status(200).json(details)
  } else {
    res.status(404).json({ error: 'Vote not found.'})
  }
}
