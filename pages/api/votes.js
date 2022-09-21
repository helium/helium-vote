import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();
const votes = serverRuntimeConfig.votes.map(
  ({ id, name, description, tags, outcomes, deadline, filters }) => ({
    id,
    name,
    description,
    tags,
    deadline,
    outcomes,
    filters,
  })
);

export default function votesAPI(req, res) {
  res.status(200).json(votes);
}
