import client, { TAKE_MAX } from "./client";
import { chain, maxBy } from "lodash";

const dev = process.env.NODE_ENV !== "production";

export const server = dev
  ? "http://localhost:3000"
  : "https://www.heliumvote.com";

export const fetchVotes = async () => {
  const votes = await fetch(`${server}/api/votes`);
  return await votes.json();
};

export const fetchVoteDetails = async (id) => {
  const voteDetails = await fetch(`${server}/api/votes/${id}`);
  return await voteDetails.json();
};

export const fetchCurrentHeight = async () => {
  return (await fetch(`${server}/api/height`)).json();
};

export const fetchResults = async (id) => {
  try {
    const results = await fetch(`${server}/api/results/${id}`);
    return await results.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};
