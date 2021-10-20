const templateExample = {
  // The ID should be a unique ID for each vote. This will also be what populates the URL (e.g. heliumvote.com/1234)
  id: "135xR8htbqTHCkWVPJEeqJuDVtyZJB852WuAzL7XwSVaVhdtH8q",
  // The deadline is the block at which all voting wallets' balances will be counted toward a vote
  deadline: 1059000,
  // This is the link where the "More details" button goes
  link: "https://github.com/helium/HIP",
  // The title of the vote. If it's for a HIP, put a descriptive title like "HIP 39: Redenomination"
  name: "Test Vote: Ice Cream",
  // The person calling for the vote
  author: {
    nickname: "@cokes",
    // address: "zzzz",
    // link: "https://github.com/user",
  },
  // A brief description of what the vote is for. It doesn't have to be comprehensive.
  description:
    "Vote for your favorite ice cream flavor. This voting mechanism will be used for future Helium Improvement Proposal voting.",
  // If this is a "For" vs "Against" vote, put the "For" option first, to keep the colour scheme consistent
  outcomes: [
    {
      // This is the title of each option. Try to keep it to a couple words at most to make the interface as readable as possible
      value: "Chocolate",
      // The wallet address associated with each option
      address: "13uWWxgbqa5i9W7SFme6NZ2Brr1jDiga4JP7JdQyBRNer9RGoii",
    },
    {
      value: "Vanilla",
      address: "13yWhaorHn8Es6jujCw9HCFAjDyecCv5HMwzoa4gp26awSw7z3b",
    },
  ],
};

module.exports = {
  serverRuntimeConfig: {
    votes: [
      {
        id: "135xR8htbqTHCkWVPJEeqJuDVtyZJB852WuAzL7XwSVaVhdtH8q",
        deadline: 1059000,
        link: "https://github.com/helium/HIP",
        name: "Test Vote: Ice Cream",
        author: {
          nickname: "@cokes",
          // address: "zzzz",
          // link: "https://github.com/user",
        },
        description:
          "Vote for your favorite ice cream flavor. This voting mechanism will be used for future Helium Improvement Proposal voting.",
        outcomes: [
          {
            value: "Chocolate",
            address: "13uWWxgbqa5i9W7SFme6NZ2Brr1jDiga4JP7JdQyBRNer9RGoii",
          },
          {
            value: "Strawberry",
            address: "14aVVtQvq7QK2FmU3ZFnXM3o3Nodzve8cFjDQniJGJbq6AZ29a7",
          },
          {
            value: "Vanilla",
            address: "13yWhaorHn8Es6jujCw9HCFAjDyecCv5HMwzoa4gp26awSw7z3b",
          },
        ],
      },
      {
        id: "13YxdDMkDsjnWAk1MSBKADveZm5RnMTLEqq1yTvzHKBZnvjsZFb",
        deadline: 1075000,
        link: "https://github.com/helium/HIP/blob/master/0040-validator-denylist.md",
        name: "HIP 40: Validator Denylist",
        description:
          "This plan proposes that validators would maintain a denylist file of Hotspot addresses which are selected from a basic floor function, selecting the hotspots where earnings are abnormal.",
        outcomes: [
          {
            value: "For Validator Denylist",
            address: "13DB1TNxeCiVATE8tfC38NisYXJebx59K2SCXY6tuWv2McYW1rw",
          },
          {
            value: "Against Validator Denylist",
            address: "14QKWs6GhqJkrXhwj2r3aXJFQVN5TbhHfDMnkGGAtxTg5apx32M",
          },
        ],
      },
    ],
  },
};
