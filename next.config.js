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
  // any addresses you want to filter for voting. for example, an exchange wallet address
  filters: [],
};

module.exports = {
  serverRuntimeConfig: {
    votes: [
      // {
      //   id: "135xR8htbqTHCkWVPJEeqJuDVtyZJB852WuAzL7XwSVaVhdtH8q",
      //   deadline: 1059000,
      //   link: "https://github.com/helium/HIP",
      //   name: "Test Vote: Ice Cream",
      //   tags: {
      //     primary: "TEST",
      //     secondary: "Ice Cream",
      //   },
      //   authors: [
      //     {
      //       nickname: "@cokes",
      //       // link: "https://github.com/user",
      //     },
      //   ],
      //   description:
      //     "Vote for your favorite ice cream flavor. This voting mechanism will be used for future Helium Improvement Proposal voting.",
      //   outcomes: [
      //     {
      //       value: "Chocolate",
      //       address: "13uWWxgbqa5i9W7SFme6NZ2Brr1jDiga4JP7JdQyBRNer9RGoii",
      //     },
      //     {
      //       value: "Strawberry",
      //       address: "14aVVtQvq7QK2FmU3ZFnXM3o3Nodzve8cFjDQniJGJbq6AZ29a7",
      //     },
      //     {
      //       value: "Vanilla",
      //       address: "13yWhaorHn8Es6jujCw9HCFAjDyecCv5HMwzoa4gp26awSw7z3b",
      //     },
      //   ],
      //   filters: [],
      // },
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
          "HIP 56 describes an update to the dispute mechanism for State Channels that will enable better accounting of State Channel activity and more accurate rewards for Data Transfer while improving blockchain scaling. It specifically protects against an edge case that could cause blockchain halts due to the dispute mechanism. This vote is for the new dispute mechanism to be enabled by a chain variable.\n\nApproving this HIP implies that the community has reviewed the implementation and the relevant Chain Variables. We will consider this proposal as approved if it passes with 2/3 of the vote power by the deadline.\n\nJoin the conversation on Discord and see the #hip‑56‑improved‑state‑channel‑disputes channel for more details.",
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
      {
        id: "14KhDJUdvAXNVVP5m5cqEaLGNC859sXvpHtxWX9r999pZKC8xAs",
        deadline: 1311000,
        link: "https://github.com/helium/HIP/blob/main/0058-poc-distance-limit.md",
        name: "PoC Distance Limit",
        tags: {
          primary: "HIP 58",
          secondary: "Technical",
        },
        authors: [
          {
            nickname: "@abhay",
            link: "https://github.com/abhay",
          },
          {
            nickname: "@mrpatrick1991",
            link: "https://github.com/mrpatrick1991",
          },
          {
            nickname: "et al."
          }
        ],
        description:
          "HIP 58 seeks to nullify a certain gaming vector of Proof of Coverage rewards by aligning the expected range of PoC with the range of LoRaWAN devices.\n\nThe current PoC mechanics allow manipulation of witness RF data at long distances and thus, we find evidence of gaming at the edges. This improvement implements a sanity check filter on Proof of Coverage and reduces the maximum range of PoC activity to 100km. The distance is based on the notion that typical devices are able to be heard 30-50km away. The distance is doubled to 100km in order to incentivize new Hotspot placements. The impact on a few legitimate witness events that are > 100km is limited as described in the dataset in the HIP.\n\nApproving this HIP implies that the community has reviewed the implementation and relevant Chain Variable. We will consider this proposal as approved if it passed with 2/3 of the vote power by the deadline.\n\nJoin the conversation on Discord and see the #hip‑58‑poc‑distance‑limit channel for more details.",
        outcomes: [
          {
            value: "For HIP 58",
            address: "13rz3LEqJyfiv6sTSb5rcLKUiDVUa5XgkYi9qtfhoNsziijEwQ5",
          },
          {
            value: "Against HIP 58",
            address: "12zsif7QE9dhQyhzmbT1mLtTrinTFQdNyjJZkty6N4hRPYVoReB",
          },
        ],
      },
      {
        id: "14cXnMdXYcS7WKNh33dYUaPeo8bZmRFn5AoPA78AZtAgfFXu9jf",
        deadline: 1350360,
        link: "https://github.com/helium/HIP/blob/main/0059-reduce-xor-filter-fees.md",
        name: "Reduce XOR Filter Fees",
        tags: {
          primary: "HIP 59",
          secondary: "Technical",
        },
        authors: [
          {
            nickname: "@macpie",
            link: "https://github.com/macpie",
          },
          {
            nickname: "@jdgemm",
            link: "https://github.com/jdgemm",
          }
        ],
        description:
          "HIP 59 proposes a change for how fees are calculated when doing a XOR filter update with the goal of reducing these fees and enabling more updates to XOR filters. \n\nOn the Helium blockchain, fees are calculated based on the byte_size of the transaction. XOR filter fees are operational costs related to maintaining OUIs on the blockchain. With the current implementation as more devices get added to the filter, it grows. Meaning that any update is calculated based on the full size of the filter. This can increase the cost of an XOR filter update to tens of thousands of Data Credits (DC). This is not sustainable as the network grows.\n\nHIP 59 proposes to not account for the full size of the XOR filter every time but only the difference compared to the previous update. For example: if the previous XOR had a size of 100 bytes and the update is 110 bytes then fees would be calculated on the difference: (110 - 100 = 10) 10 bytes. \n\nIf approved this approach increases the commercial viability for community members to host a Console/Router instance, since only the difference of the XOR filter will be calculated vs paying for the entire amount each time.",
        outcomes: [
          {
            value: "For HIP 59",
            address: "14KKzNXWp9rgkNvASAq7LYRkxZuyWpe1NEfYkr1y4vjACb6skPh",
          },
          {
            value: "Against HIP 59",
            address: "14nP4TKN3Q7aMwNyBP1qTstV6mrrVvP5Sau3t1vaff7nyqyyigg",
          },
        ],
      },
      {
        id: "14rifUhocpzdwsrWaG5PDbdREDkzyesKe1hXuWzibv8h9DdqKLe",
        deadline: 1387090,
        link: "https://github.com/helium/HIP/blob/main/0051-helium-dao.md",
        name: "Helium DAO",
        tags: {
          primary: "HIP 51",
          secondary: "Economic / Technical",
        },
        authors: [
          {
            nickname: "@tjain-mcc",
            link: "https://github.com/tjain-mcc",
          },
          {
            nickname: "@shayons297",
            link: "https://github.com/shayons297",
          },
          {
            nickname: "@jmfayal",
            link: "https://github.com/jmfayal",
          },
          {
            nickname: "@abhay",
            link: "https://github.com/abhay",
          }
        ],
        description:
          "HIP 51 seeks to allow Helium and its token HNT to become a ‘Network of Networks’, opening the door for multiple network protocols and multiple tokens to exist in the ecosystem. \n\nFor the IoT network, Hotspots would start earning a new token called $IOT, while 5G Hotspots would earn a token called $MOBILE. All new tokens are backed by HNT and can always be converted to HNT. Existing holdings of HNT remain unaffected.\n\nThis HIP provides a general structure for onboarding new network protocols, of which HIP 52: LoRaWAN DAO and HIP 53: 5G DAO exist as two current proposals. HIP 51 aims to create an economy where the underlying HNT-Data Credit burn-and-mint equilibrium continues to power the Helium Flywheel, while Proof-of-Coverage rules and earnings are dictated by each corresponding subDAO.\n\nApproving this HIP implies that the community has reviewed the implementation. We will consider this proposal as approved if it passes with 2/3 of the vote power by the deadline.\n\nJoin the conversation on Discord and see the #hip‑51‑helium-dao channel for more details.",
        outcomes: [
          {
            value: "For HIP 51",
            address: "14kJVKqZ3Fh5FaqxW727yL3tKcdgWWA5oMKupCNwnZDRFPgixYY",
          },
          {
            value: "Against HIP 51",
            address: "13BnnYVKUDbaRynWHe6JNj7tx55meLBAGmtoYLMUDK9cL3ZKd8T",
          },
        ],
      },
      {
        id: "14XDEkg1t398kvqvgxMMKH8qzVGNBb1mgHhTjNmc5KkC3XJxu8p",
        deadline: 1454400,
        link: "https://github.com/helium/HIP/blob/main/0052-iot-dao.md",
        name: "IoT subDAO",
        tags: {
          primary: "HIP 52",
          secondary: "Economic / Technical",
        },
        authors: [
          {
            nickname: "@tjain-mcc",
            link: "https://github.com/tjain-mcc",
          },
          {
            nickname: "@shayons297",
            link: "https://github.com/shayons297",
          },
          {
            nickname: "@jmfayal",
            link: "https://github.com/jmfayal",
          },
          {
            nickname: "@abhay",
            link: "https://github.com/abhay",
          }
        ],
        description:
          "HIP 52 establishes the Helium IoT subDAO and subtoken under the framework established by HIP 51. This subDAO will manage the Helium LoRaWAN network, the IOT token, and governance operations for IoT networks. Oracles in the IoT subDAO will confirm Proof of Coverage, data transfer activity, and add blocks to the IoT subnetwork.\n\nIoT subDAO participants may lock and delegate IOT tokens as veIOT to gain voting power in IoT governance and/or run oracles. HNT tokens will be emitted to the subDAO treasury as required by HIP 51 and will back the IOT token. The IOT token will be redeemable for HNT through a programmatic treasury controlled by the IoT subDAO.\n\nApproving this HIP implies that the community has reviewed the implementation. We will consider this proposal as approved if it passes with 2/3 of the vote power by the deadline.\n\nJoin the conversation on Discord and see the #hip-52-lorawan-dao channel for community discussion.",
        outcomes: [
          {
            value: "For HIP 52",
            address: "14KTnuEofehSvwfrWcrURb3nXDe5NnbZN5G3GWeRNzTAUqsYPPj",
          },
          {
            value: "Against HIP 52",
            address: "14m8SxU8RGd5cLhyQbWQyNPzjYczUXY6n1opaXKyYYXZXUk82oD",
          },
        ],
      },
      {
        id: "14hfi6Vs9YmwYLwVHKygqyEqwTERRrx5kfQkVoX1uqMTxiE5EgJ",
        deadline: 1454400,
        link: "https://github.com/helium/HIP/blob/main/0053-mobile-dao.md",
        name: "Mobile subDAO",
        tags: {
          primary: "HIP 53",
          secondary: "Economic / Technical",
        },
        authors: [
          {
            nickname: "@zer0tweets",
            link: "https://github.com/zer0tweets"
          },
          {
            nickname: "@tjain-mcc",
            link: "https://github.com/tjain-mcc",
          },
          {
            nickname: "@shayons297",
            link: "https://github.com/shayons297",
          },
          {
            nickname: "@abhay",
            link: "https://github.com/abhay",
          },
          {
            nickname: "Joey Padden"
          }
        ],
        description:
          "HIP 53 establishes the MOBILE token and subDAO under the framework established by HIP 51: Helium DAO. In summary, the Helium MOBILE subDAO handles all MOBILE emissions, mining rewards, programmatic treasury, and governance operations for mobile device networks.\n\nHNT tokens will be emitted to the MOBILE subDAO treasury as required by HIP 51 and will be used to back the MOBILE token. The MOBILE token will thus always be redeemable for HNT within the Helium ecosystem upon demand through a programmatic treasury controlled by the MOBILE subDAO. Oracles in the MOBILE subDAO will confirm Proof of Coverage, data transfer, and add blocks to the MOBILE subnetwork.\n\nApproving this HIP implies that the community has reviewed the implementation. We will consider this proposal as approved if it passes with 2/3 of the vote power by the deadline.\n\nJoin the conversation on Discord and see the #hip‑53‑5g‑subdao channel for more details.",
        outcomes: [
          {
            value: "For HIP 53",
            address: "14UbGr7ZVR544vadj4EW2bvGa9Dd78hnM3Ab7AgxmbNUbGDpH5v",
          },
          {
            value: "Against HIP 53",
            address: "14L1X3yHDN8wRgLs2k7cvxeTR7Xm62CVTRpYFFw1kpM9HFovCe3",
          },
        ],
      },
      {
        id: "13rA4AXq5ME5s9FEyZrE4BMjxiAF9W3kU2tnmUH8FkFGsV97jEp",
        deadline: 1462500,
        link: "https://github.com/helium/HIP/blob/main/0067-repeal-redenomination.md",
        name: "Repeal Redenomination",
        tags: {
          primary: "HIP 67",
          secondary: "Economic",
        },
        authors: [
          {
            nickname: "@EdBallou",
            link: "https://github.com/EdBallou"
          }
        ],
        description:
          "HIP 67 proposes to rescind the community vote for HIP 39 - Redenomination. This HIP was previously approved November 21, 2021 by the Helium community.\n\nOne of the core motivations of HIP 39 was to bring back ‘whole value HNT mining’, which is an objective now solved by the Network of Networks HIPs 51, 52, and 53.\n\nHIP 39 was one of the last votes to come without an implementation plan. Complexities not accounted for in the HIP meant the immediate implementation of HIP39 would come at the cost of significantly higher engineering time than initially allotted. The initial proposal would have introduced a HNT token arbitrage, putting network integrity at risk – among other concerns.\n\nA vote for HIP 67 means no implementation of HIP 39 should take place.\nA vote against HIP 67 means HIP 39 should be implemented.\n\nWe will consider this proposal as approved if it passes with 2/3 of the vote power by the deadline.\n\nJoin the conversation on Discord and see the existing #hip‑39‑hnt‑redenomination channel for more details.",
        outcomes: [
          {
            value: "For HIP 67 (Do Not Redenominate)",
            address: "14LKcAKs413toCce7hsYNMywdDqUPEBpJLRn9bmbZMMUdpSVgxj",
          },
          {
            value: "Against HIP 67 (Keep Redenomination)",
            address: "13vac93ky5Wb4VhrWZT7gFgvEdotJBrUSMxfY7yVHY63Tb9N4mK",
          },
        ],
      },
      {
        id: "13Y79HnMVt4Epug2rbLYivMPvrcpC2wYUNbZK5Dga3tw3VBpBjk",
        deadline: 1537200,
        link: "https://github.com/helium/HIP/blob/main/0070-scaling-helium.md",
        name: "Scaling the Helium Network",
        tags: {
          primary: "HIP 70",
          secondary: "Technical",
        },
        authors: [
          {
            nickname: "Helium Core Developers"
          }
        ],
        description:
          "HIP 70 proposes to move Proof-of-Coverage and Data Transfer Accounting to Helium Oracles. It also migrates Helium's tokens and governance to the Solana blockchain. The team selected the Solana blockchain over maintaining their own L1 for reasons including Solana's ecosystem of developers, wallet compatibility, applications, Solana Mobile Stack, etc.\n\nThe proposed changes in HIP 70 do not change the fundamentals of the Helium Network or HNT, but provide several benefits to the Helium Network including more HNT available to subDAO reward pools, more consistent mining, more reliable data transfer, more utility for HNT and subDAO tokens, and more ecosystem support.\n\nThe Validator unstaking cooldown period is reduced from 5 months to 3 months to support the transition to Solana. Any Validators that remain staked or new stakers of veHNT in the first 7 days after the Solana transition get a 3x bonus of veHNT value.\n\nAll active Helium wallets will be seeded with enough SOL for 100 transactions to ensure a smooth transition to Solana.\n\nApproving this HIP implies that the community has reviewed the implementation. We would consider this proposal as approved if it passes with 2/3 of the vote power by the deadline.\n\nJoin the conversation on Discord and see the #hip‑70‑scaling‑the‑helium‑network channel for more details.",
        outcomes: [
          {
            value: "For HIP 70",
            address: "144FS4XwDfAS4QerhVPARGZuqjUvFDHti96peum6uzwETog7v7J",
          },
          {
            value: "Against HIP 70",
            address: "13EUfEDbJVXtzrf3fn1mX1fj8NtYLiik56WdaZB5vEEjr66pRMm",
          },
        ],
        filters: [
          // these are known exchange wallets, more can be added before the vote closes.
          "14YeKFGXE23yAdACj6hu5NWEcYzzKxptYbm5jHgzw9A1P1UQfMv", // binance.com
          "13HPSdf8Ng8E2uKpLm8Ba3sQ6wdNimTcaKXYmMkHyTUUeUELPwJ", // binance.us
          "148W6v8vaS4npmQQ2PtPQhSLBhNWg6oYjvxne3VdsEAQq8r2GeT", // binance.us (?)
          "13TFnZyGDy95neRAxnP5Y9FLHqW7Mu28U9VgmZz2hgNhi7qG3qF", // binance.us (?)
          "13PBfQf1kaZPD3zN8LyoY5QtEDSZKJYZS5N7S5hZYaEz2Kh8znT", // crypto.com
          "13d4ieU8x4n3v7XtkiLio1NmT9WzKJS4BFC7jDJNbGjB5xciQC8", // kucoin
          "133d47AMU6nQ7mZ1fF4dFJfoLhqCUnTSRhZAwmcahBoEtZPGF4U", // gate.io
        ],
      }
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
