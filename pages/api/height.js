import client from '../../data/client'

export default async function heightAPI(req, res) {
  const height = await client.blocks.getHeight()
  res.status(200).json({ height })
}
