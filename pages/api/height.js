import { Client } from '@helium/http'

export default async function heightAPI(req, res) {
  const height = await new Client().blocks.getHeight()
  res.status(200).json({ height })
}
