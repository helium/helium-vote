export const fetchVotes = async () => {
  const votes = await fetch("/api/votes");
  return await votes.json();
};

export const fetchVoteDetails = async (id) => {
  const voteDetails = await fetch(`/api/votes/${id}`);
  return await voteDetails.json();
};

export const fetchCurrentHeight = async () => {
  const { height } = await (await fetch(`/api/height`)).json();
  return height;
};
