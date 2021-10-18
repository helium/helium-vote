import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();
const votes = serverRuntimeConfig.votes.map(
  ({ id, name, outcomes, deadline }) => ({
    id,
    name,
    deadline,
    outcomes: outcomes.map((o) => o.value),
  })
);

export default function votesAPI(req, res) {
  res.status(200).json(votes);
}
