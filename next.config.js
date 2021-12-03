// Use this example as a placeholder you can copy and paste into the array below when submitting a PR to create a new community vote
const templateExample = {
  // The ID should be a unique ID for each vote. This will also be what populates the URL (e.g. heliumvote.com/1234)
  id: "TBD",
  // The deadline is the block at which all voting wallets' balances will be counted toward a vote
  deadline: TBD,
  // This is the link where the "More details" button goes
  link: "https://github.com/helium/HIP/blob/master/0037-omni-protocol-poc.md",
  // The title of the vote. If it's for a HIP, put a descriptive title like "HIP 39: Redenomination"
  name: "HIP 37: Omni-Protocol PoC on Helium Network",
  tags: {
    // If it's a HIP, put "HIP [#]" as the primary tag
    primary: "HIP 37",
    // Use the optional secondary tag for a general descriptive term, such as "Economics"
    secondary: "Economic",
  },
  // An array of the person(s) calling for the vote
  authors: [
    {
      // How this person is generally known in the community
      nickname: "@zer0tweets",
      // A link to their profile (GitHub is probably the most useful, maybe Twitter?)
      link: "https://twitter.com/zer0tweets",
    },
    { 
      // How this person is generally known in the community
      nickname: "@JMF",
      // A link to their profile (GitHub is probably the most useful, maybe Twitter?)
      link: "https://github.com/JMFayal",
    },
    {
      // How this person is generally known in the community
      nickname: "@lxie",
      // A link to their profile (GitHub is probably the most useful, maybe Twitter?)
      link: "https://github.com/lxie123",
    },
  ],
  // A brief description of what the vote is for. It doesn't have to be comprehensive.
  description:
    "HIP 37 lays the foundation for earning HNT for providing 5G and WiFi coverage on the Helium network. This proposal outlines both the economic incentives and implementation strategy to support Proof-of-Coverage with new wireless network types. The comprehensive details of the reward incentives and implementation strategy are available by clicking more details. Rough consensus to pass this HIP is achieved when "For HIP 37"  
     receives at least 66% of the vote.",
  // If this is a "For" vs "Against" vote, put the "For" option first, to keep the colour scheme consistent
  outcomes: [
    {
      // This is the title of each option. Try to keep it to a couple words at most to make the interface as readable as possible
      value: "For HIP 37",
      // The wallet address associated with each option
      address: "13uWWxgbqa5i9W7SFme6NZ2Brr1jDiga4JP7JdQyBRNer9RGoii",
    },
    {
      value: "Against HIP 37",
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
