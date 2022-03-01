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
        deadline: 1183225,
        link: "https://github.com/helium/HIP/blob/master/0042-beacon-witness-ratio-witness-reward-limit.md",
        name: "Beacon/Witness Ratio",
        tags: {
          primary: "HIP 42",
          secondary: "Technical",
          tertiary: "Temp Check",
        },
        authors: [
          {
            nickname: "@anthonyra",
            link: "https://github.com/anthonyra",
          },
        ],
        description:
          "This proposal seeks to regulate the number of witnesses a Hotspot is rewarded for based on the success of beacons. By tying the reward for witnesses of Hotspots to successful beacons, we incentivize healthy network coverage.\n\nVotes for this HIP are considered a temperature check. The implementation of this HIP is not guaranteed and is subject to follow‑up votes.",
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
      {
        id: "14iwaexUYUe5taFgb5hx2BZw74z3TSyonRLYyZU1RbddV4bJest",
        deadline: 1180295,
        link: "https://discord.gg/helium",
        name: "Maintain Temporary Hotspot Denylist",
        description:
          "As the Helium Network has grown, so too has the prevalence of malicious activity and institutional cheating. This activity seeks to game the system with the sole intent of exploiting Proof-of-Coverage rewards without providing any real value to the network.\n\nShould Helium, Inc continue to temporarily manage the denylist that is embedded in miner images until such time that a HIP-40 implementation is approved or if HIP-40 is rejected by the community?\n\nJoin the conversation on Discord and see announcements channel for more details.",
        authors: [
          {
            nickname: "Helium Inc.",
            // link: "",
          },
        ],
        tags: {
          primary: "Denylist",
          // secondary: "",
        },
        outcomes: [
          {
            value: "For Temporarily Maintaining Denylist",
            address: "14i2TpGTLB8SRGURXRumcGv7sDD1ABQJLbLphdyDaTTBQG4ZTCb",
          },
          {
            value: "Against Temporarily Maintaining Denylist",
            address: "13aRcLjXSjWdYCwihwGnJYiCP87BGniMN2g74Mm7rV6ZVXecDMQ",
          },
        ],
      },
      {
        id: "13wCuq7XGnc4xgxPAc9n9ragKsRfmH9t9jB3c1smfKPZWSikZkd",
        deadline: 1180295,
        link: "https://discord.gg/helium",
        name: "Publish Temporary Hotspot Denylist",
        description:
          "As the Helium Network has grown, so too has the prevalence of malicious activity and institutional cheating. This activity seeks to game the system with the sole intent of exploiting Proof-of-Coverage rewards without providing any real value to the network.\n\nShould Helium Inc. publish the current denylist even though it may allow existing gaming hotspots to change their setups to avoid being detected?\n\nJoin the conversation on Discord and see announcements channel for more details.",
        authors: [
          {
            nickname: "Helium Inc.",
            // link: "",
          },
        ],
        tags: {
          primary: "Denylist",
          // secondary: "",
        },
        outcomes: [
          {
            value: "For Publishing Hotspot Denylist",
            address: "13pk2QHtwZKYbZH9oAr9oajwzBERsZCNzNWF3uwud5TrisTywQN",
          },
          {
            value: "Against Publishing Hotspot Denylist",
            address: "14dtRgHykFreu2NSRqQvMprCXMSpA3Z9iW4i5Wf9FWfhKARH3iU",
          },
        ],
      },
      {
        id: "14me3X7jpEmn3eeFfnAkMvUoFU3cN6GAS3CDomqCikr7VQfHWrU",
        deadline: 1237200,
        link: "https://github.com/helium/HIP/blob/main/0054-h3dex-targeting.md",
        name: "H3Dex-based PoC Targeting",
        tags: {
          primary: "HIP 54",
          secondary: "Technical",
        },
        authors: [
          {
            nickname: "@Vagabond",
            link: "https://github.com/Vagabond",
          },
          {
            nickname: "@vihu",
            link: "https://github.com/vihu",
          },
          {
            nickname: "@abhay",
            link: "https://github.com/abhay",
          },
        ],
        description:
          "This is a proposal for a more scalable replacement for Proof-of-Coverage (PoC) targeting using an H3-based index. We are proposing it as a HIP to communicate and acknowledge that this is a change to the current implementation but we believe it still falls within the original intent of PoC.\n\nApproving this HIP implies that the community has reviewed the implementation and the relevant Chain Variables. We will consider this proposal as approved if it passes with 2/3 of the vote power by the deadline.\n\nJoin the conversation on Discord and see the #hip54-h3dex-poc-targeting channel for more details.",
        outcomes: [
          {
            value: "For HIP 54",
            address: "13Cq1jr9HTVZAxgrD9kXg3ytqjWZ4D2bEGJejPs2bb3vAZJz3sM",
          },
          {
            value: "Against HIP 54",
            address: "1344XqCee51BkNzbjAjW1MyR17qvhc9952ygWbz5eMNn4nnPxHZ",
          },
        ],
      },
      {
        id: "14Rjhhz1DXLVmSRdzappqWgD6rfgu6XYxmdaSCvWLyLH8ZWbciK",
        deadline: 1237200,
        link: "https://github.com/helium/HIP/blob/main/0055-validator-challenges.md",
        name: "Validator Challenges",
        tags: {
          primary: "HIP 55",
          secondary: "Technical",
        },
        authors: [
          {
            nickname: "@Vagabond",
            link: "https://github.com/Vagabond",
          },
          {
            nickname: "@andymck",
            link: "https://github.com/andymck",
          },
          {
            nickname: "@abhay",
            link: "https://github.com/abhay",
          },
        ],
        description:
          "This HIP changes how Proof-of-Coverage (PoC) Challenges are generated and submitted to the Helium blockchain. By moving challenging to Validators, the network's stability will be greatly increased.\n\nSync issues, all relayed states, port forwarding or firewall issues, and SD card failures due to excessive load will be eliminated. Hotspot bandwidth consumption will be a fraction of what it is today. This may also reduce the cost of Hotspot hardware, as processing and storage needs will be greatly decreased.\n\nIn order to make this move, the economic reward of 0.9% of total HNT rewards for creating PoC Challenges will move to Validators as well. (Hotspot earnings change from 70.1% to 69.2%)\n\nApproving this HIP implies that the community has reviewed the implementation and the relevant Chain Variables. We will consider this proposal as approved if it passes with 2/3 of the vote power by the deadline.\n\nJoin the conversation on Discord and see the #hip55‑validator‑challenges channel for more details.",
        outcomes: [
          {
            value: "For HIP 55",
            address: "13pshKABnfUBSAcXJrgDYxvwXxJ6UMD1LrXA2ZDXwCKGNu83hyY",
          },
          {
            value: "Against HIP 55",
            address: "13v6vkBUaHjoGx2daVCxXtyDkaKMP1Key4WphkkGsc3gpPpgTh4",
          },
        ],
      },
      {
        id: "13UrtNApGd3NbeP3NyyTejqNEPAv3NGxkGjvtwTVdaRs24NT7Wy",
        deadline: 1256800,
        link: "https://github.com/helium/HIP/blob/main/0056-state-channel-dispute-strategy.md",
        name: "Improved State Channel Disputes",
        tags: {
          primary: "HIP 56",
          secondary: "Technical",
        },
        authors: [
          {
            nickname: "@macpie",
            link: "https://github.com/macpie",
          },
          {
            nickname: "@michaeldjeffrey",
            link: "https://github.com/michaeldjeffrey",
          },
          {
            nickname: "@Vagabond",
            link: "https://github.com/Vagabond",
          },
          {
            nickname: "@abhay",
            link: "https://github.com/abhay",
          },
          {
            nickname: "et al."
          }
        ],
        description:
          "HIP 56 describes an update to the dispute mechanism for State Channels that would improve blockchain scaling. These changes allow Validators to better reconcile Data Transfer activity and rewards for Hotspots. The change would also address recent issues around large block sizes. This vote is for the new dispute mechanism to be enabled by a chain variable.\n\nApproving this HIP implies that the community has reviewed the implementation and the relevant Chain Variables. We will consider this proposal as approved if it passes with 2/3 of the vote power by the deadline.\n\nJoin the conversation on Discord and see the #hip‑56‑improved‑state‑channel‑disputes channel for more details.",
        outcomes: [
          {
            value: "For HIP 56",
            address: "14afviZLjBxH4neJEK3TxDuhhHJk9C7rnJe4AxcJKUNda435biL",
          },
          {
            value: "Against HIP 56",
            address: "14ExX6eX6tw76f6pu7z3PinTMGcZ3D5mxHYB59u25pFyp2ZK8tw",
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
