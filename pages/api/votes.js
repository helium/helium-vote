import { fetchVotes } from "../../data/votes";

export default function votesAPI(_, res) {
  res.status(200).json(fetchVotes());
}
