import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()
const votes = new Map(serverRuntimeConfig.votes.map(i => [i.id, i]));

export default function handler(req, res) {
  const { voteId } = req.query

  if (!votes.has(voteId)) {
    res.status(404).json({ error: 'Vote not found.'})
    return
  }

  res.status(200).json(votes.get(voteId))
}
