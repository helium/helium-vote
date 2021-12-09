// Use this example as a placeholder you can copy and paste into the array below when submitting a PR to create a new community vote
const templateExample = {
  // The ID should be a unique ID for each vote. This will also be what populates the URL (e.g. heliumvote.com/1234)
  id: "135xR8htbqTHCkWVPJEeqJuDVtyZJB852WuAzL7XwSVaVhdtH8q",
  // The deadline is the block at which all voting wallets' balances will be counted toward a vote
  deadline: 1059000,
  // This is the link where the "More details" button goes
  link: "https://github.com/helium/HIP",
  // The title of the vote. If it's for a HIP, put a descriptive title like "HIP 39: Redenomination"
  name: "Test Vote: Ice Cream",
  tags: {
    // If it's a HIP, put "HIP [#]" as the primary tag
    primary: "HIP 31",
    // Use the optional secondary tag for a general descriptive term, such as "Economics"
    secondary: "Ice Cream",
  },
  // An array of the person(s) calling for the vote
  authors: [
    {
      // How this person is generally known in the community
      nickname: "@cokes",
      // A link to their profile (GitHub is probably the most useful, maybe Twitter?)
      link: "https://github.com/user",
    },
  ],
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
      // an optional color field that will override the default vote option colors
      color: "#EEEEEE",
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
        tags: {
          primary: "TEST",
          secondary: "Ice Cream",
        },
        authors: [
          {
            nickname: "@cokes",
            // link: "https://github.com/user",
          },
        ],
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
        id: "14MnuexopPfDg3bmq8JdCm7LMDkUBoqhqanD9QzLrUURLZxFHBx",
        deadline: 1105440,
        link: "https://github.com/helium/HIP/blob/master/0039-hnt-redenomination.md",
        name: "HIP 39: Redenomination",
        description:
          "This proposal suggests a redenomination of the conversion rate between bones and HNT. Currently there are 100,000,000 (10^8) bones per HNT and under the proposed redenomination the conversion rate would be adjusted to 100,000 (10^5) bones per HNT. This change represents a 1000:1 token redenomination. Rough consensus to pass this HIP is achieved when the 'For Redenomination' vote receives at least 66% of the vote.",
        authors: [
          {
            nickname: "@JMF",
            link: "https://github.com/JMFayal",
          },
        ],
        tags: {
          primary: "HIP 39",
          secondary: "Economic",
        },
        outcomes: [
          {
            value: "For Redenomination",
            address: "13qVx7MRzocyKZ4bW3oEkvnQrTK4DftKEcjHVYP1zhMtUhnqYye",
          },
          {
            value: "Against Redenomination",
            address: "13pPtEyg3idu2GDeFCjbuU1uVLaZax9yBqDouPPdgsAYznq7982",
          },
        ],
      },
      {
        id: "13NyqFtVKsifrh6HQ7DjSBKXRDi7qLHDoATHogoSgvBh56oZJv8",
        deadline: 1185690,
        link: "https://github.com/helium/HIP/blob/master/0042-beacon-witness-ratio-witness-reward-limit.md",
        name: "HIP 42: Beacon/Witness Ratio",
        tags: {
          primary: "HIP 42",
          secondary: "Technical",
        },
        authors: [
          {
            nickname: "@anthonyra",
            link: "https://github.com/anthonyra",
          },
        ],
        description:
          "This proposal seeks to regulate the number of witnesses a Hotspot is rewarded for based on the success of beacons. By tying the reward for witnesses of Hotspots to successful beacons, we incentivize healthy network coverage.\n\nA vote for this HIP is considered a signal of intent. The particular implementation of this HIP is subject to change.",
        outcomes: [
          {
            value: "For Beacon/Witness Ratio",
            address: "14WEui5BM83omUQ2VwXrd8dfx8wew18bdn66mc9Z14HC6DeL3xw",
          },
          {
            value: "Against Beacon/Witness Ratio",
            address: "134UcXhcGD1fxR3XrA3rgXXiQCjNFiB8MbnxsTX8z1iv3CQ52Zs",
          },
        ],
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
      config.resolve.fallback.dns = false;
      config.resolve.fallback.net = false;
      config.resolve.fallback.tls = false;
    }
    return config;
  },
};
