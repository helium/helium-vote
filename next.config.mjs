import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shdw-drive.genesysgo.net",
        port: "",
        pathname: "/**/**",
      },
      {
        protocol: "https",
        hostname: "helium.io",
        port: "",
        pathname: "/**/**",
      },
      {
        protocol: "https",
        hostname: "*.test-helium.com",
        port: "",
        pathname: "/**/**",
      },
      ...(process.env.NODE_ENV === "development" && [
        {
          protocol: "http",
          hostname: "localhost",
          port: "8082",
          pathname: "/**/**",
        },
      ]),
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverRuntimeConfig: {
    realmProposals: [
      {
        network: "hnt",
        publicKey: "6qgUFLqXkaJAcDvSufHFafQkRXt1MWegtZ9qsHvizp7S",
        tags: ["HIP 88", "Realms"],
        name: "HIP 88: Adjustment of DAO Utility A Score",
        status: "passed",
        endTs: 1690329600,
        gist: "https://api.github.com/gists/96877b57f1e04b9f55bf8dc31c6472ad",
        github:
          "https://github.com/helium/HIP/blob/515a49fc9945fdb8492784af1234c2cb37946dab/0088-adjustment-of-dao-utility-a-score.md",
        summary: `This HIP proposes to make the $A$ factor of the subDAO utility score more granular by using the individual onboarding fee of an active device paid instead of relying on a homogeneous onboarding fee. This will allow subDAOs to change their onboarding fee without either negatively affecting their subDAO utility score.`,
        outcomes: [
          {
            value: "For HIP 88",
            votes: 253457245,
          },
          {
            value: "Against HIP 88",
            votes: 2337953,
          },
        ],
      },
      {
        network: "mobile",
        publicKey: "5pPPhWfuMx7cHNW4Um9PTuceJLw7RrqwJ7LKQ8Ldc98q",
        tags: ["HIP 96", "Realms"],
        name: "HIP 96: WiFi AP Onboarding Structure",
        status: "passed",
        endTs: 1700524800,
        gist: "https://api.github.com/gists/dea5455f5fb40c75f52389a1237447b1",
        github:
          "https://github.com/helium/HIP/blob/eb016bda8c6144c988b005814abc7b9877058520/0096-wifi-ap-onboarding-structure.md",
        summary: `This HIP outlines the onboarding fee structure for two new device types: "Indoor WiFi APs" and "Outdoor WiFi APs". The proposed onboarding fees are designed to be approximately 10% of the Manufacturer's Suggested Retail Price (MSRP) of the devices (please see below for specifics). The fees consist of a combination of HNT derived data credits and MOBILE tokens. It is expected that future devices of different classes will follow a similar pricing structure based on their respective MSRP.`,
        outcomes: [
          {
            value: "For HIP 96",
            votes: 1427911791,
          },
          {
            value: "Against HIP 96",
            votes: 191161783,
          },
        ],
      },
      {
        network: "mobile",
        publicKey: "8Nd4VFUZcBUhP28sSkz4SDcKEWrGu5j9Hsaz8RLn4hao",
        tags: ["HIP 93", "Realms"],
        name: "HIP 93: Addition of Wi-Fi Access Points to the Helium Mobile SubDAO",
        status: "passed",
        endTs: 1696723200,
        gist: "https://api.github.com/gists/f47b85d997c491e1c3f6a1f9b4e2b022",
        github:
          "https://github.com/helium/HIP/blob/95a4ccdb5c4072e78c6dd7bb02e4655ee2fbd68e/0093-addition-of-wifi-aps-to-mobile-subdao.md",
        summary: `This HIP outlines important aspects of adding Wi-Fi access points to the Helium Mobile Network. It describes location verification during onboarding for indoor access points and suggests approaches to continuously verify the locations of such access points. Additionally, the HIP proposes an algorithm and reward structure for Wi-Fi access points similar to what is defined in HIP-74 but adjusted for the technical specifics of Wi-Fi compared to CBRS radios.`,
        outcomes: [
          {
            value: "For HIP 93",
            votes: 1962680401,
          },
          {
            value: "Against HIP 93",
            votes: 39061945,
          },
        ],
      },
      {
        network: "mobile",
        publicKey: "GRrnrpk1BRQz54EyrNFcst1bo1iNiD1ZALh7KFbX9j6U",
        tags: ["HIP 85", "Realms"],
        name: "HIP 85: MOBILE Hex Coverage Limit",
        status: "passed",
        endTs: 1696723200,
        gist: "https://api.github.com/gists/e02599521188b7975dbd7698559ef1c6",
        github:
          "https://github.com/helium/HIP/blob/b1012db5fb7669eadf026a7e559b0e23198b9de3/0085-mobile-hex-coverage-limit.md",
        summary:
          "This Helium Improvement Proposal (HIP) suggests adding a baseline hex multiplier score to the MOBILE Proof-of-Coverage (PoC) Modeled Coverage Points based on whether other coverage from Helium 5G deployments exists within that res12 hex. This will reward unique coverage with more Modeled Coverage PoC points than redundant and overlapping coverage. This HIP only applies to outdoor radios, and no changes to the reward structure of indoor mobile radios are being made with this HIP.",
        outcomes: [
          {
            value: "For HIP 85",
            votes: 2796461680,
          },
          {
            value: "Against HIP 85",
            votes: 800787600,
          },
        ],
      },
      {
        network: "mobile",
        publicKey: "DtMtA61XvnNWAPb3rr9isaPPHopUQCHFhAu5QJmaNy1k",
        tags: ["HIP 87", "Realms"],
        name: "HIP 87: Proportional Service Provider Rewards",
        status: "passed",
        endTs: 1630147200,
        gist: "https://api.github.com/gists/e87bb276130668e4ccc8225a87a48adc",
        github:
          "https://github.com/helium/HIP/blob/1bfb7e6b53943caa166336be00bca90cb9926076/0087-proportional-service-provider-rewards.md",
        summary:
          "This proposal clarifies Service Provider eligibility for rewards established in HIP-53 (currently defined as 10% of emissions). It implements a usage-based approach to calculating Service Provider rewards similar to HIP-10 for the IOT Network. Service Providers will be rewarded in MOBILE tokens at a 1:1 ratio to burned Data Credits. The proposal also specifies that any part of this category that is not rewarded will not be minted. This prevents a Service Provider from claiming the full MOBILE Service Provider Reward Bucket while burning less than an equivalent amount of Data Credits (DC). A proportional distribution will be applied if the total Data Credits exceeds the emissions value for this category of rewards.",
        outcomes: [
          {
            value: "For HIP 87",
            votes: 1492393195,
          },
          {
            value: "Against HIP 87",
            votes: 48365150,
          },
        ],
      },
      {
        network: "mobile",
        publicKey: "8AZepByGXEejTYwy3mLKA57k19w27uukc9QUhJHFVYwj",
        tags: ["HIP 89", "Realms"],
        name: "HIP 89: MOBILE Network Onboarding Fees",
        status: "passed",
        endTs: 1686182400,
        gist: "https://api.github.com/gists/56a697239fee2b1656660b8118059091",
        github:
          "https://github.com/helium/HIP/blob/abab936e10fc7729df68c54542a5cf8098771c98/0089-mobile-network-onboard-fees.md",
        summary:
          "This HIP requests that Helium Foundation correct the MOBILE Onboarding Fee from 0 USD to 40 USD and the MOBILE Location Assert Fee from 0 USD to 10 USD as soon as possible so that the fees are in compliance with HIP-53 and HIP-19.",
        outcomes: [
          {
            value: "For HIP 89",
            votes: 4013479169,
          },
          {
            value: "Against HIP 89",
            votes: 134321356,
          },
        ],
      },
      {
        network: "mobile",
        publicKey: "E2XvmWoYx2ZGs1uWHjNszgmsnq3Dtd1x2a64tsqJyDKT",
        tags: ["HIP 84", "Realms"],
        name: "HIP 84: Service Provider Hex Boosting",
        status: "passed",
        endTs: 1686873600,
        gist: "https://api.github.com/gists/00d60764123e797a90c00c7923fe87d9",
        github:
          "https://github.com/helium/HIP/blob/main/0084-service-provider-hex-boosting.md",
        summary:
          "HIP 84 proposes a framework to enhance the growth and optimization of the Mobile Network by allowing Service Providers to influence the deployment of coverage in specific locations. The aim is to improve the usefulness and coverage of the network by targeting areas with a high potential for data offloading.",
        outcomes: [
          {
            value: "For HIP 84",
            votes: 3206476606,
          },
          {
            value: "Against HIP 84",
            votes: 102417503,
          },
        ],
      },
      {
        network: "mobile",
        publicKey: "3u2DUcZ2GMRviU5Ycy827urBtovutUiGrt3jqJHQek3w",
        tags: ["HIP 82", "Realms"],
        name: "HIP 82: Add Helium Mobile as a Service Provider to the Helium Mobile subDAO",
        status: "passed",
        endTs: 1686873600,
        gist: "https://api.github.com/gists/2a00c4f0ff1135157f3c5c63c8a8d009",
        github:
          "https://github.com/helium/HIP/blob/main/0082-helium-mobile-service-provider.md",
        summary:
          "HIP 82 proposes the addition of Helium Mobile as a Service Provider to the Helium Mobile Network subNetwork. The Helium Community has made significant progress in building the Helium Mobile Network, and Helium Mobile, a subsidiary of Nova Labs, seeks to build on this opportune time by initiating the first Service Provider of the Mobile Network. Helium Mobile aims to offload its subscriber traffic onto the network, paving the way for other Service Providers to join and improving the overall network traffic and rewards for Hotspot operators.",
        outcomes: [
          {
            value: "For HIP 82",
            votes: 3963064787,
          },
          {
            value: "Against HIP 82",
            votes: 2405833,
          },
        ],
      },
      {
        network: "mobile",
        publicKey: "3r2bTix8eGGKiu1HTzLpXY7PdS5321n4sFqNs8cBDRNR",
        tags: ["HIP 79", "Realms"],
        name: "HIP 79: Mobile PoC - Mappers Rewards",
        status: "passed",
        endTs: 1686873600,
        gist: "https://api.github.com/gists/3a8cb565709532faba8736fbae59e0c1",
        github:
          "https://github.com/helium/HIP/blob/main/0079-mobile-poc-mappers-rewards.md",
        summary:
          "HIP 79 proposes creating a new rewardable entity for the Mobile Network, Mobile Mappers. It introduces a framework for rewarding different types of mapping activities, such as verification mapping and discovery mapping. The proposal suggests reducing the Service Provider reward bucket from 20% to 10% and increasing the Mapper reward bucket from 10% to 20% to increase reward incentives for Mappers. Mappers will be eligible for specific percentages of emitted MOBILE rewards based on their participation in mapping activities.",
        outcomes: [
          {
            value: "For HIP 79",
            votes: 2834268827,
          },
          {
            value: "Against HIP 79",
            votes: 609079206,
          },
        ],
      },
      {
        network: "iot",
        publicKey: "99ca9Adku8Zk151vGiySEPcGJxdd8V2wAQkGFK4PcE54",
        tags: ["HIP 100", "Realms"],
        name: "HIP 100: Deploy EU868 Region Plan to the Majority of Africa",
        status: "passed",
        endTs: 1703270056,
        gist: "https://api.github.com/gists/59a99d6b1b2950bd2db6cbdcefc5de80",
        github:
          "https://github.com/helium/HIP/blob/2ff77a15f060554155ec07410310ae3784c82345/0100-deploy-eu868-region-plan-to-the-majority-of-africa.md",
        summary:
          "This HIP recommends that the community provisionally sets the majority of the currently unspecified and EU433 region countries in the Africa region to the EU868 regional frequency plan.",
        outcomes: [
          {
            value: "For HIP 100",
            votes: 378364305,
          },
          {
            value: "Against HIP 100",
            votes: 254809,
          },
        ],
      },
      {
        network: "iot",
        publicKey: "H5mGJg9927DBRr1NH64VVk6hoSTJdnAC5kngGxgvumUS",
        tags: ["HIP 83", "Realms"],
        name: "HIP 83: Restore First to Respond Witness Rewarding",
        status: "passed",
        endTs: 1698105600,
        gist: "https://api.github.com/gists/a8a6b05b62e17bd51cd127a12c086765",
        github:
          "https://github.com/helium/HIP/blob/6da11e7f008fff4ffb792529bd1f8a789098d051/0083-restore-first-to-witness.md",
        summary:
          "Currently, the Proof-of-Coverage Oracles collect all the witnesses for a beacon and randomly reward a selection of 14 witnesses. This HIP proposes to revert to rewarding the first 14 Hotspots responding to a beacon, incentivizing the most useful Hotspots to sensor traffic by prioritizing the low latency connections that sensors need for uplinks, downlinks, and join requests to work correctly.",
        outcomes: [
          {
            value: "For HIP 83",
            votes: 863027756,
          },
          {
            value: "Against HIP 83",
            votes: 363924298,
          },
        ],
      },
      {
        network: "iot",
        publicKey: "4TZE7E3KvRgZiaSMF8h4s7F9UhWDJUgNdNuBz8y1dGzq",
        tags: ["HIP 92", "Realms"],
        name: "HIP 92: Correcting IOT Pre-mine Calculation Errors",
        status: "failed",
        endTs: 1697155200,
        gist: "https://api.github.com/gists/72288f3a95db0ef20964af7f76eb4e0a",
        github:
          "https://github.com/helium/HIP/blob/006347d95fe690e987f924ddbfc2c7a6900a022e/0092-premine-error-correction.md",
        summary:
          'Based on the specifications in Helium Docs, and in HIP 52, all Hotspots that were active, not on the denylist, and earned rewards from either beaconing, witnessing or passing rewardable data, were supposed to receive the IOT pre-mine at the migration. This HIP proposes to correct for a coding error that left out all "Data Only" Hotspots, as well as an error in the selection process during the migration, which missed some active Hotspots with PoC rewards.',
        outcomes: [
          {
            value: "For HIP 92",
            votes: 365113578,
          },
          {
            value: "Against HIP 92",
            votes: 530750223,
          },
        ],
      },
      {
        network: "iot",
        publicKey: "GDDd639STzeJgJfuha2Ciyx1uDixYHhr4B5sUisG6v5K",
        tags: ["HIP 91", "Realms"],
        name: "HIP 91: Continuation of Reduced IOT Location Assertion Cost",
        status: "passed",
        endTs: 1690156800,
        gist: "https://api.github.com/gists/3f56a283971be5f75243b6736d60c2cf",
        github:
          "https://github.com/helium/HIP/blob/ba77309dbd3a6d7dccdfd6a02bd832620c96cc66/0091-data-driven-extension-reduced-iot-assertion-cost.md",
        summary:
          "This HIP proposes an extension of the reduced Hotspot location assertion fees on the network. Currently, the fees for IOT hotspots were halved as per HIP-69 since the Solana migration. However, this adjustment is set to expire on July 20th, 2023, at midnight UTC, after which the fee will increase back to $10 in Data Credits. This proposal suggests maintaining the reduced fee for an additional 6 months to incentivize hotspot relocation and gather more data on the impact of a $5 versus a $10 reassert fee.",
        outcomes: [
          {
            value: "For HIP 91",
            votes: 263167353,
          },
          {
            value: "Against HIP 91",
            votes: 10425403,
          },
        ],
      },
      {
        network: "iot",
        publicKey: "E3LHMo2Ke59vFUH5gMjtUSQoSHokodHujkNqPu5GwfYr",
        tags: ["HIP 72", "Realms"],
        name: "HIP 72: Secure Concentrators",
        status: "failed",
        endTs: 1690156800,
        gist: "https://api.github.com/gists/7d512295cb1e363b56624ea51e8cf8a1",
        github:
          "https://github.com/helium/HIP/blob/c13a68bac7f4d8df3cbbbe26ff0ea6649ab43d2d/0072-secure-concentrators.md",
        summary:
          "In this HIP, we propose an amendment to HIP 19 to enable a new type of IoT network actor: a Secure Concentrator Card (SCC). A Secure Concentrator Card is similar to a standard LoRaWAN concentrator card, but with an additional Secure Microcontroller Unit (SMCU) and onboard GPS receiver. The SMCU digitally signs LoRa data packets as they are received from the radio. In this way, packet data and its corresponding metadata (RSSI, Frequency, GPS location and time) can be verified to be authentic. The primary intention of this HIP is to combat Proof-of-Coverage gaming. Secure Concentrtors achieve this by providing trustworthy data upon which better gaming detectors and PoC algorithms can be built.",
        outcomes: [
          {
            value: "For HIP 72",
            votes: 369921986,
          },
          {
            value: "Against HIP 72",
            votes: 234458613,
          },
        ],
      },
    ],
    legacyProposals: [
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
            nickname: "et al.",
          },
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
            nickname: "et al.",
          },
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
          },
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
          },
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
          },
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
            link: "https://github.com/zer0tweets",
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
            nickname: "Joey Padden",
          },
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
            link: "https://github.com/EdBallou",
          },
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
            nickname: "Helium Core Developers",
          },
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
      },
      {
        id: "13Z3p82AX8H1EUQF74cP2qq7RmmhbKBAiGWWsyA7WLxQ9NENTVW",
        deadline: 1580900,
        link: "https://github.com/helium/HIP/blob/main/0073-consensus-deselection-history-weight.md",
        name: "Consensus Deselection Weighting",
        tags: {
          primary: "HIP 73",
          secondary: "Technical",
        },
        authors: [
          {
            nickname: "@PaulVMo",
            link: "https://github.com/paulvmo",
          },
        ],
        description:
          "HIP 73 proposes a new chain variable to improve the performance of the current Helium L1 and enable quick removal of low-performing Validators from the Consensus Group (CG). Specific details on how this would work are in the HIP but the outcome of this change would enable better performance of the chain when underperforming validators are elected into Consensus, thereby improving block production, Proof-of-Coverage activity, and overall stability of transaction processing.\n\nCode for this change is available for review by the community and has been reviewed by the Helium Core Developers. The chain variable gating this change will be activated shortly after HIP approval.\n\nWe will consider this proposal as approved if it passes with 2/3 of the vote power by the deadline.\n\nJoin the conversation on Discord and see the existing #hip‑73‑consensus‑deselection‑weighting channel for more details.",
        outcomes: [
          {
            value: "For HIP 73",
            address: "13wptC32h89s1K66uPTDiDe9XFbuZicyNuH2Di7NZyciKuLwvCT",
          },
          {
            value: "Against HIP 73",
            address: "143Vzv4Xr2mdF41Qy9HXt8wJU5KcHdv2pcyKRc9Z6RuKk4Mj5zX",
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
      },
      {
        id: "14jH67zhctwb3B5NmwiAjaXQuyF7jZMZCAnfyBYhSpRS3L22sQE",
        deadline: 1707000,
        link: "https://github.com/helium/HIP/blob/main/0074-mobile-poc-modeled-coverage-rewards.md",
        name: "MOBILE PoC - Modeled Coverage Rewards",
        tags: {
          primary: "HIP 74",
          secondary: "Economic / Technical",
        },
        authors: [
          {
            nickname: "@thehardbits",
            link: "https://github.com/thehardbits",
          },
          {
            nickname: "@zer0tweets",
            link: "https://github.com/zer0tweets",
          },
          {
            nickname: "@jpad-freedomfi",
            link: "https://github.com/jpad-freedomfi",
          },
          {
            nickname: "@meowshka",
            link: "https://github.com/meowshka",
          },
        ],
        description:
          "HIP-74 proposes an implementation of MOBILE Proof-of-Coverage called Modeled Coverage. Modeled Coverage replaces the current algorithm for MOBILE rewards initially introduced based on radio type multipliers. The new algorithm uses the location of the radio to calculate MOBILE rewards based on the hexes the radio covers. Modeled Coverage aims to improve the current method by considering the directionality of radios and environmental obstructions that prevent the propagation of the signals they generate. Modeled Coverage, combined with other parameters like uptime (Heartbeats) and backhaul (Speed Test), aims to allow for more fair rewards and incentivizes the deployment of radios at optimal locations.\n\nThis HIP affects only the Helium 5G network and has no impact on IoT rewards. \n\nApproving HIP-74 implies that the community has reviewed the implementation. We would consider this proposal as approved if it passes with 2/3 of the vote power by the deadline. \n\nJoin the conversation on Discord and see the #hip-74-mobile-poc-modeled-coverage-rewards channel for more details.",
        outcomes: [
          {
            value: "For HIP 74",
            address: "13DBZ5penZZWUg93TxbHAgVaQnsNLewKkyxLZbsSEMcyyDNtMZW",
          },
          {
            value: "Against HIP 74",
            address: "146Pjwm49hmk8HHhCzAPK5mNAC7kXjVuuQJaVitXE4wBYnWhv3h",
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
      },
      {
        id: "143vgVpLgC3LcXLZCyXYZiHCFcsH9UNz3vR8CL6SDxTLPL5tWtr",
        deadline: 1729100,
        link: "https://github.com/helium/HIP/blob/main/0075-mobile-poc-initiate-programmatic-minting-and-updated-emissions-curve.md",
        name: "MOBILE PoC - Initiate Programmatic Minting with an Updated Emissions Curve",
        tags: {
          primary: "HIP 75",
          secondary: "Economic / Technical",
        },
        authors: [
          {
            nickname: "@zer0tweets",
            link: "https://github.com/zer0tweets",
          },
          {
            nickname: "@meowshka",
            link: "https://github.com/meowshka",
          },
        ],
        description:
          "HIP-75 proposes to begin MOBILE minting on the Helium L1 alongside a revised MOBILE emissions curve. These proposed changes do not affect the monthly rewards that current MOBILE Hotspot deployers earn, which will continue to be 3 Billion MOBILE tokens per month. The proposed solution maintains rewards continuity for Hotspot owners between the premine and the permanent solution of L1 minting. The proposed new curve maintains rewards distributions as they are today to match the development pace of Mobile Proof-of-Coverage more closely. Under the current emissions schedule, and without this new curve, a large number of tokens would be minted in a shorter period, front-loading MOBILE rewards while decreasing later MOBILE rewards.\n\nThis HIP affects only the Helium 5G network and has no impact on HNT rewards. \n\nApproving HIP-75 implies that the community has reviewed the implementation. We would consider this proposal as approved if it passes with 2/3 of the vote power by the deadline. \n\nJoin the conversation on Discord and see the #hip-75-programmatic-minting-and-updated-curve channel for more details.",
        outcomes: [
          {
            value: "For HIP 75",
            address: "14EoGWxBjBGQootk1f9gE8CPJhSpSCUQ89Hk5nvHPruWjgQ2vnL",
          },
          {
            value: "Against HIP 75",
            address: "13QeGddbx4Z65h1UDFzdAeDPdLoGhvhuVz1szN6UkcGjsy4Jocz",
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
      },
      {
        id: "13KaGoC2ED8kEh2sXLZ7eGWrqDUMyFH5k48VQ3LLjU5QoQidMV4",
        deadline: 1740300,
        link: "https://github.com/helium/HIP/blob/main/0069-reassertion-fee-reduction.md",
        name: "Re-assertion Fee Reduction",
        tags: {
          primary: "HIP 69",
          secondary: "Economic",
        },
        authors: [
          {
            nickname: "@TheRealJohnMac50",
            link: "https://github.com/TheRealJohnMac50",
          },
        ],
        description:
          "HIP 69 proposes reducing re-assertion fees by half (from 1,000,000 DC to 500,000 DC) on the IOT/LoRaWAN network for a total of three months. If this HIP passes, the fee reduction will begin upon the Solana migration. The intended purpose of the reduced fee is to incentivize honest hotspot owners to reassert in less dense hexes and correct any inaccurately asserted hotspots. \n\nApproving HIP 69 implies that the community has reviewed the implementation. We would consider this proposal as approved if it passes with 2/3 of the vote power by the deadline. \n\nJoin the conversation on Discord and see the #hip-69-re-assertion-fee-reduction channel for more details.",
        outcomes: [
          {
            value: "For HIP 69",
            address: "139LARBfojBxAinZNfxEMbnx1Q7vRUv26Z2ZwP8wxDZV5grZ8Ae",
          },
          {
            value: "Against HIP 69",
            address: "13QJxjioAgQiLaNMXJE1CGXMj1786T39zGRNoojCchWzzqr5mig",
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
      },
      {
        id: "144wSVHr4cuVSjxEC62X1bHuLsc5Hcpq6XBhfSY8BQwiyMborFZ",
        deadline: 1783450,
        link: "https://github.com/helium/HIP/blob/main/0076-linear-lockup-curve.md",
        name: "Linear Lockup Curve",
        tags: {
          primary: "HIP 76",
          secondary: "Economic / Technical",
        },
        authors: [
          {
            nickname: "@Ferebee",
            link: "https://github.com/ferebee",
          },
        ],
        description:
          "HIP 76 proposes key technical and economic changes to the veHNT smart contracts for implementation upon the Solana Migration. HIP 76 proposes to: \n1) Simplify the lockup curve for veHNT and subDAO (veDNT) tokens. \n2) Eliminate the 6-month minimum lockup period, excluding Validators. \n3) Introduce a minimum of 1 HNT lockup position to prevent spam. \n4) Specify the 3x Landrush Rules that are unclearly defined in HIP 70.\n\nApproving HIP 76 implies that the community has reviewed the implementation. We would consider this proposal as approved if it passes with 2/3 of the vote power by the deadline.\n\nJoin the conversation on Discord and see the #hip-76-linear-lockup-curve channel for more details.",
        outcomes: [
          {
            value: "For HIP 76",
            address: "13Z46nMa5Su5p2h2FhAWADXcTimwADeXks8VB5tXwwsVuXuh3gF",
          },
          {
            value: "Against HIP 76",
            address: "12xdsVwZxhm5KXupbcovapYiruyxJCCFroAebgZE1yj6ZioTdik",
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
      },
      {
        id: "146pksPcH7C3Wz8hN5NxL544k1VVq6Z4W2iB14e1yJ1HFJ3Wtf3",
        deadline: 1830000,
        link: "https://github.com/helium/HIP/blob/main/0077-solana-parameters.md",
        name: "Launch Parameters for Solana Migration",
        tags: {
          primary: "HIP 77",
          secondary: "Economic / Technical",
        },
        authors: [
          {
            nickname: "@abhay",
            link: "https://github.com/abhay",
          },
          {
            nickname: "@ChewingGlass",
            link: "https://github.com/ChewingGlass",
          },
        ],
        description:
          "HIP 77 proposes essential parameters for initiating a Mainnet launch on Solana, addressing aspects such as governance, circuit breakers, and the decimal precision for HNT, IOT, and MOBILE, to eliminate overflow risks. Additionally, HIP 77 recommends establishing a multisig, initially managed by the Helium Foundation. \n\nApproving HIP 77 implies that the community has reviewed the implementation. We would consider this proposal as approved if it passes with 2/3 of the vote power by the deadline. \n\nJoin the conversation on Discord and see the #hip-77-solana-parameters channel for more details.",
        outcomes: [
          {
            value: "For HIP 77",
            address: "13r8YY1MCkxsnMhzv6QrXiVhPwNoXuztSnpUBHMgUrvve7Cg7f9",
          },
          {
            value: "Against HIP 77",
            address: "14rSs88Ky4n3cL1JCbu2yJmNxa51wgSmm99erfKrfJtGFf2D3TN",
          },
        ],
        filters: [
          // these are known exchange wallets, more can be added before the vote closes.
          "14YeKFGXE23yAdACj6hu5NWEcYzzKxptYbm5jHgzw9A1P1UQfMv", // binance.com
          "13HPSdf8Ng8E2uKpLm8Ba3sQ6wdNimTcaKXYmMkHyTUUeUELPwJ", // binance.us
          "148W6v8vaS4npmQQ2PtPQhSLBhNWg6oYjvxne3VdsEAQq8r2GeT", // binance.us (?)
          "13TFnZyGDy95neRAxnP5Y9FLHqW7Mu28U9VgmZz2hgNhi7qG3qF", // binance.us (?)
          "13PBfQf1kaZPD3zN8LyoY5QtEDSZKJYZS5N7S5hZYaEz2Kh8znT", // crypto.com
          "148W6v8vaS4npmQQ2PtPQhSLBhNWg6oYjvxne3VdsEAQq8r2GeT", // crypto.com
          "13d4ieU8x4n3v7XtkiLio1NmT9WzKJS4BFC7jDJNbGjB5xciQC8", // kucoin
          "13Nj4KCnuBruSYvbxCgTLdeoyTN6Q5cZsNnJw3rh8WLZt9wBYih", // kucoin
          "133d47AMU6nQ7mZ1fF4dFJfoLhqCUnTSRhZAwmcahBoEtZPGF4U", // gate.io
        ],
      },
      {
        id: "13F5AWLhxwTjhDMnZ6ww4oJWgRkBoW9ji4JnDzwQXjsQhiT2kcX",
        deadline: 1831250,
        link: "https://github.com/leogaggl/HIP/blob/d1c9b208410fe5e51c2504d92927b3e4bf411d7b/00YZ-au-frequency-plan-choice.md",
        name: "Guidance on Australian Frequency Plan",
        temperatureCheck:
          "Voting for this temperature check will provide guidance to the Helium Foundation on a regional frequency plan for Hotspots asserted in Australia.\n\nThis temperature check does not affect Hotspots asserted outside of Australia.",
        tags: {
          secondary: "Governance",
          tertiary: "Temp Check",
        },
        authors: [
          {
            nickname: "@plainsimpledot",
            link: "https://github.com/plainsimpledot",
          },
          {
            nickname: "@Buckshot22",
            link: "https://github.com/Buckshot22",
          },
          {
            nickname: "@mcauser",
            link: "https://github.com/mcauser",
          },
          {
            nickname: "@leogaggl",
            link: "https://github.com/leogaggl",
          },
          {
            nickname: "@tonysmith55",
            link: "https://github.com/tonysmith55",
          },
        ],
        description:
          'Two different channel plans are authorized for use in Australia, AU915 and AS923-1. The Helium network operated on AU915 sub-band 2 (SB2) until November 2022, when it was switched to an AS923-1 variant with support for AU915 sensors on SB6.\n\nA breakdown of the two options presented are as follows:\n\n➤ Return to AU915 plan with support for AU915 sensors on SB2\n\nThis option will re-enable support for all AU915 SB2 sensors as was the case prior to the chain variable change in November 2022. This option is currently supported by all known manufacturers but the Helium Foundation will confirm before pushing this configuration change.\n\n1. AU915 sensors will work on the network at 22dBm, some possibly higher.\n2. AU915 sensors on SB2 join the network faster vs sometimes not at all on AS923-1C\n3. Full support by Chirpstack and other LNS options (rather than having to split LNS for AU915 vs AS923 sensors).\n4. Helium continues to be part of the Australian public LoRaWAN network ecosystem. Private, commercial and public operators can roam the network.\n\nThis proposal has been presented by existing members of the AU community as a draft HIP which is linked as More Details on this page.\n\n➤ Remain on AS923-1C Plan with a power adjustment to 27 dBm\n\nThis option retains the existing "dual plan" for AS923 sensors and limited support for some AU915 sensors on SB6. Assuming hardware/firmware support from manufacturers, this option also allows for a power increase that should match prior expectations on power for Proof-of-Coverage. Specific additional details:\n\n1. AS923 sensors will work on the network at 16dBm, some possibly higher.\n2. AS923 is a dynamic frequency plan and can take advantage of upcoming spectrum changes in the region.\n3. Due to only two join channels AS923 sensors join the network faster.\n4. Commercial operators have expressed interest in roaming on AS923 but we are not aware of existing roaming activity at scale.\n\nIt should be noted that Proof-of-Coverage will be the same from a power perspective for both channel plan options and only operators using the specific frequency plan can roam on Helium Hotspots regardless of choice.\n\nPrevious discussions can be found on Discord: https://discord.gg/helium\n\nVoting on this temperature check implies that the community has reviewed the two options and is providing guidance to the Helium Foundation on a path forward of implementation in the IoT Configuration Service.\n\nJoin the conversation on Discord in the #hip-discussion channel for more details.',
        outcomes: [
          {
            value: "Return to AU915 Plan",
            address: "14jqcPiL8BYLgivEFLEczHHkWmFEgG9YCKq6P15BHtrZw1fKjSq",
          },
          {
            value: "Remain on AS923-1C Plan",
            address: "14jpcmeZU6JmL6YPhv26EwivZ3Bjse71UvdCsW7pwkSnfjYgVwg",
          },
        ],
        filters: [
          // these are known exchange wallets, more can be added before the vote closes.
          "14YeKFGXE23yAdACj6hu5NWEcYzzKxptYbm5jHgzw9A1P1UQfMv", // binance.com
          "13HPSdf8Ng8E2uKpLm8Ba3sQ6wdNimTcaKXYmMkHyTUUeUELPwJ", // binance.us
          "148W6v8vaS4npmQQ2PtPQhSLBhNWg6oYjvxne3VdsEAQq8r2GeT", // binance.us (?)
          "13TFnZyGDy95neRAxnP5Y9FLHqW7Mu28U9VgmZz2hgNhi7qG3qF", // binance.us (?)
          "13PBfQf1kaZPD3zN8LyoY5QtEDSZKJYZS5N7S5hZYaEz2Kh8znT", // crypto.com
          "148W6v8vaS4npmQQ2PtPQhSLBhNWg6oYjvxne3VdsEAQq8r2GeT", // crypto.com
          "13d4ieU8x4n3v7XtkiLio1NmT9WzKJS4BFC7jDJNbGjB5xciQC8", // kucoin
          "13Nj4KCnuBruSYvbxCgTLdeoyTN6Q5cZsNnJw3rh8WLZt9wBYih", // kucoin
          "133d47AMU6nQ7mZ1fF4dFJfoLhqCUnTSRhZAwmcahBoEtZPGF4U", // gate.io
        ],
      },
      {
        id: "14rmHKjpZhsnrA2j24KiGzg8teA1zAMRhVGcWVUdmTAomTrJJQf",
        deadline: 1836950,
        link: "https://github.com/helium/HIP/blob/main/0080-simplifying-dao-utility-score.md",
        name: "Simplifying the DAO Utility Score",
        tags: {
          primary: "HIP 80",
          secondary: "Economic",
        },
        authors: [
          {
            nickname: "@ferebee",
            link: "https://github.com/ferebee",
          },
          {
            nickname: "@jmfayal",
            link: "https://github.com/jmfayal",
          },
          {
            nickname: "@rawrmaan",
            link: "https://github.com/rawrmaan",
          },
          {
            nickname: "@gateholder",
            link: "https://github.com/gateholder",
          },
        ],
        description:
          "HIP 80 proposes a new DAO Utility Score formula, removing the number of Hotspots and their onboarding fees and instead using only the square root of the product of DC Burn and delegated veHNT. Additionally, a DC Burn Floor is added for all subDAOs with a 5x higher floor for the IOT subDAO. Although the onboarding fee is no longer relevant to the DAO Utility Score, the HIP proposes to maintain a $5 onboarding fee as revenue and spam resistance for the subDAO. As a one-time exception, all MOBILE Hotspots onboarded prior to the implementation of HIP 70 shall be considered onboarded to both the MOBILE and the IOT subDAOs. The specific updates to the formula can be seen in the HIP.\n\nApproving HIP 80 implies that the community has reviewed the implementation. \n\nThe HIP 80 vote is running concurrently with HIP 81. Both proposals should be voted on independently.\n\nWe would consider this proposal as approved if it passes with 2/3 of the vote power by the deadline. If both fail to reach a super majority, the original DAO Utility Score specified in HIP 51 will be implemented.\n\nJoin the conversation on Discord and see the #hip-80-simplifying-dao-utility-score channel for more details.",
        outcomes: [
          {
            value: "For HIP 80",
            address: "13nJcKR3nFNYqrQyTfb3pjx7Eq1ThgcV22P94fviLVf5BypAYyc",
          },
          {
            value: "Against HIP 80",
            address: "14d8wxarhR2uXG4PzqW7tutUJ6gMKNkZir4HMvW23jLoETM7juT",
          },
        ],
        filters: [
          // these are known exchange wallets, more can be added before the vote closes.
          "14YeKFGXE23yAdACj6hu5NWEcYzzKxptYbm5jHgzw9A1P1UQfMv", // binance.com
          "13HPSdf8Ng8E2uKpLm8Ba3sQ6wdNimTcaKXYmMkHyTUUeUELPwJ", // binance.us
          "148W6v8vaS4npmQQ2PtPQhSLBhNWg6oYjvxne3VdsEAQq8r2GeT", // binance.us (?)
          "13TFnZyGDy95neRAxnP5Y9FLHqW7Mu28U9VgmZz2hgNhi7qG3qF", // binance.us (?)
          "13PBfQf1kaZPD3zN8LyoY5QtEDSZKJYZS5N7S5hZYaEz2Kh8znT", // crypto.com
          "148W6v8vaS4npmQQ2PtPQhSLBhNWg6oYjvxne3VdsEAQq8r2GeT", // crypto.com
          "13d4ieU8x4n3v7XtkiLio1NmT9WzKJS4BFC7jDJNbGjB5xciQC8", // kucoin
          "13Nj4KCnuBruSYvbxCgTLdeoyTN6Q5cZsNnJw3rh8WLZt9wBYih", // kucoin
          "133d47AMU6nQ7mZ1fF4dFJfoLhqCUnTSRhZAwmcahBoEtZPGF4U", // gate.io
        ],
      },
      {
        id: "147pXvGVcLKU76D7Hdi7iTTLvLw9qX8jXsCgNkKSHqo3rnfzkby",
        deadline: 1836950,
        link: "https://github.com/helium/HIP/blob/main/0081-minimum-onboarding-fee.md",
        name: "Minimum Onboarding Fee",
        tags: {
          primary: "HIP 81",
          secondary: "Economic",
        },
        authors: [
          {
            nickname: "@mawdegroot",
            link: "https://github.com/mawdegroot",
          },
          {
            nickname: "@Maxgold91",
            link: "https://github.com/Maxgold91",
          },
        ],
        description:
          "HIP 81 proposes to maintain the DAO Utility Score codified by the community with HIP 51, but defines minimum onboarding fees for subDAOs as $10 with a halving schedule matching the halving schedule of HNT emissions. This proposal seeks to solve the problem created by radios that have not paid an onboarding fee by giving manufacturers and/or the subDAO a grace period ending on August 1, 2023 to retroactively onboard devices on behalf of the radio owners. The specific updates to the formula can be seen in the HIP.\n\nApproving HIP 81 implies that the community has reviewed the implementation. \n\nThe HIP 81 vote is running concurrently with HIP 80. Both proposals should be voted on independently.\n\nWe would consider this proposal as approved if it passes with 2/3 of the vote power by the deadline. If both fail to reach a super majority, the original DAO Utility Score specified in HIP 51 will be implemented.\n\nJoin the conversation on Discord and see the #hip-81-minimum-onboarding-fee channel for more details.",
        outcomes: [
          {
            value: "For HIP 81",
            address: "13JQNSJsGXf8iVZjkJdV4scxfjB4XgdMnkUwBMh36xPxYznkcX7",
          },
          {
            value: "Against HIP 81",
            address: "14akKMDWUmEvJoe2bojEkooBM6Sdfd1pWgpWXpCh94HxrrtGJGE",
          },
        ],
        filters: [
          // these are known exchange wallets, more can be added before the vote closes.
          "14YeKFGXE23yAdACj6hu5NWEcYzzKxptYbm5jHgzw9A1P1UQfMv", // binance.com
          "13HPSdf8Ng8E2uKpLm8Ba3sQ6wdNimTcaKXYmMkHyTUUeUELPwJ", // binance.us
          "148W6v8vaS4npmQQ2PtPQhSLBhNWg6oYjvxne3VdsEAQq8r2GeT", // binance.us (?)
          "13TFnZyGDy95neRAxnP5Y9FLHqW7Mu28U9VgmZz2hgNhi7qG3qF", // binance.us (?)
          "13PBfQf1kaZPD3zN8LyoY5QtEDSZKJYZS5N7S5hZYaEz2Kh8znT", // crypto.com
          "148W6v8vaS4npmQQ2PtPQhSLBhNWg6oYjvxne3VdsEAQq8r2GeT", // crypto.com
          "13d4ieU8x4n3v7XtkiLio1NmT9WzKJS4BFC7jDJNbGjB5xciQC8", // kucoin
          "13Nj4KCnuBruSYvbxCgTLdeoyTN6Q5cZsNnJw3rh8WLZt9wBYih", // kucoin
          "133d47AMU6nQ7mZ1fF4dFJfoLhqCUnTSRhZAwmcahBoEtZPGF4U", // gate.io
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
    config.resolve.alias = {
      ...config.resolve.alias,
      // Anything with context needs to resolve to only one version
      "@helium/account-fetch-cache-hooks": path.resolve(
        __dirname,
        "./node_modules/@helium/account-fetch-cache-hooks"
      ),
      "@helium/helium-react-hooks": path.resolve(
        __dirname,
        "./node_modules/@helium/helium-react-hooks"
      ),
      "@helium/voter-stake-registry-hooks": path.resolve(
        __dirname,
        "./node_modules/@helium/voter-stake-registry-hooks"
      ),
      "@solana/wallet-adapter-react": path.resolve(
        __dirname,
        "./node_modules/@solana/wallet-adapter-react"
      ),
    };
    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/hnt",
        permanent: false,
      },
      {
        source: "/147pXvGVcLKU76D7Hdi7iTTLvLw9qX8jXsCgNkKSHqo3rnfzkby",
        destination:
          "/legacy/147pXvGVcLKU76D7Hdi7iTTLvLw9qX8jXsCgNkKSHqo3rnfzkby",
        permanent: true,
      },
      {
        source: "/14rmHKjpZhsnrA2j24KiGzg8teA1zAMRhVGcWVUdmTAomTrJJQf",
        destination:
          "/legacy/14rmHKjpZhsnrA2j24KiGzg8teA1zAMRhVGcWVUdmTAomTrJJQf",
        permanent: true,
      },
      {
        source: "/146pksPcH7C3Wz8hN5NxL544k1VVq6Z4W2iB14e1yJ1HFJ3Wtf3",
        destination:
          "/legacy/146pksPcH7C3Wz8hN5NxL544k1VVq6Z4W2iB14e1yJ1HFJ3Wtf3",
        permanent: true,
      },
      {
        source: "/144wSVHr4cuVSjxEC62X1bHuLsc5Hcpq6XBhfSY8BQwiyMborFZ",
        destination:
          "/legacy/144wSVHr4cuVSjxEC62X1bHuLsc5Hcpq6XBhfSY8BQwiyMborFZ",
        permanent: true,
      },
      {
        source: "/143vgVpLgC3LcXLZCyXYZiHCFcsH9UNz3vR8CL6SDxTLPL5tWtr",
        destination:
          "/legacy/143vgVpLgC3LcXLZCyXYZiHCFcsH9UNz3vR8CL6SDxTLPL5tWtr",
        permanent: true,
      },
      {
        source: "/14jH67zhctwb3B5NmwiAjaXQuyF7jZMZCAnfyBYhSpRS3L22sQE",
        destination:
          "/legacy/14jH67zhctwb3B5NmwiAjaXQuyF7jZMZCAnfyBYhSpRS3L22sQE",
        permanent: true,
      },
      {
        source: "/13Z3p82AX8H1EUQF74cP2qq7RmmhbKBAiGWWsyA7WLxQ9NENTVW",
        destination:
          "/legacy/13Z3p82AX8H1EUQF74cP2qq7RmmhbKBAiGWWsyA7WLxQ9NENTVW",
        permanent: true,
      },
      {
        source: "/13Y79HnMVt4Epug2rbLYivMPvrcpC2wYUNbZK5Dga3tw3VBpBjk",
        destination:
          "/legacy/13Y79HnMVt4Epug2rbLYivMPvrcpC2wYUNbZK5Dga3tw3VBpBjk",
        permanent: true,
      },
      {
        source: "/13Y79HnMVt4Epug2rbLYivMPvrcpC2wYUNbZK5Dga3tw3VBpBjk",
        destination:
          "/legacy/13Y79HnMVt4Epug2rbLYivMPvrcpC2wYUNbZK5Dga3tw3VBpBjk",
        permanent: true,
      },
      {
        source: "/13KaGoC2ED8kEh2sXLZ7eGWrqDUMyFH5k48VQ3LLjU5QoQidMV4",
        destination:
          "/legacy/13KaGoC2ED8kEh2sXLZ7eGWrqDUMyFH5k48VQ3LLjU5QoQidMV4",
        permanent: true,
      },
      {
        source: "/13rA4AXq5ME5s9FEyZrE4BMjxiAF9W3kU2tnmUH8FkFGsV97jEp",
        destination:
          "/legacy/13rA4AXq5ME5s9FEyZrE4BMjxiAF9W3kU2tnmUH8FkFGsV97jEp",
        permanent: true,
      },
      {
        source: "/14cXnMdXYcS7WKNh33dYUaPeo8bZmRFn5AoPA78AZtAgfFXu9jf",
        destination:
          "/legacy/14cXnMdXYcS7WKNh33dYUaPeo8bZmRFn5AoPA78AZtAgfFXu9jf",
        permanent: true,
      },
      {
        source: "/14KhDJUdvAXNVVP5m5cqEaLGNC859sXvpHtxWX9r999pZKC8xAs",
        destination:
          "/legacy/14KhDJUdvAXNVVP5m5cqEaLGNC859sXvpHtxWX9r999pZKC8xAs",
        permanent: true,
      },
      {
        source: "/13UrtNApGd3NbeP3NyyTejqNEPAv3NGxkGjvtwTVdaRs24NT7Wy",
        destination:
          "/legacy/13UrtNApGd3NbeP3NyyTejqNEPAv3NGxkGjvtwTVdaRs24NT7Wy",
        permanent: true,
      },
      {
        source: "/14Rjhhz1DXLVmSRdzappqWgD6rfgu6XYxmdaSCvWLyLH8ZWbciK",
        destination:
          "/legacy/14Rjhhz1DXLVmSRdzappqWgD6rfgu6XYxmdaSCvWLyLH8ZWbciK",
        permanent: true,
      },
      {
        source: "/14me3X7jpEmn3eeFfnAkMvUoFU3cN6GAS3CDomqCikr7VQfHWrU",
        destination:
          "/legacy/14me3X7jpEmn3eeFfnAkMvUoFU3cN6GAS3CDomqCikr7VQfHWrU",
        permanent: true,
      },
      {
        source: "/14hfi6Vs9YmwYLwVHKygqyEqwTERRrx5kfQkVoX1uqMTxiE5EgJ",
        destination:
          "/legacy/14hfi6Vs9YmwYLwVHKygqyEqwTERRrx5kfQkVoX1uqMTxiE5EgJ",
        permanent: true,
      },
      {
        source: "/14XDEkg1t398kvqvgxMMKH8qzVGNBb1mgHhTjNmc5KkC3XJxu8p",
        destination:
          "/legacy/14XDEkg1t398kvqvgxMMKH8qzVGNBb1mgHhTjNmc5KkC3XJxu8p",
        permanent: true,
      },
      {
        source: "/14rifUhocpzdwsrWaG5PDbdREDkzyesKe1hXuWzibv8h9DdqKLe",
        destination:
          "/legacy/14rifUhocpzdwsrWaG5PDbdREDkzyesKe1hXuWzibv8h9DdqKLe",
        permanent: true,
      },
      {
        source: "/13NyqFtVKsifrh6HQ7DjSBKXRDi7qLHDoATHogoSgvBh56oZJv8",
        destination:
          "/legacy/13NyqFtVKsifrh6HQ7DjSBKXRDi7qLHDoATHogoSgvBh56oZJv8",
        permanent: true,
      },
      {
        source: "/14MnuexopPfDg3bmq8JdCm7LMDkUBoqhqanD9QzLrUURLZxFHBx",
        destination:
          "/legacy/14MnuexopPfDg3bmq8JdCm7LMDkUBoqhqanD9QzLrUURLZxFHBx",
        permanent: true,
      },
      {
        source: "/13wCuq7XGnc4xgxPAc9n9ragKsRfmH9t9jB3c1smfKPZWSikZkd",
        destination:
          "/legacy/13wCuq7XGnc4xgxPAc9n9ragKsRfmH9t9jB3c1smfKPZWSikZkd",
        permanent: true,
      },
      {
        source: "/14iwaexUYUe5taFgb5hx2BZw74z3TSyonRLYyZU1RbddV4bJest",
        destination:
          "/legacy/14iwaexUYUe5taFgb5hx2BZw74z3TSyonRLYyZU1RbddV4bJest",
        permanent: true,
      },
      {
        source: "/13F5AWLhxwTjhDMnZ6ww4oJWgRkBoW9ji4JnDzwQXjsQhiT2kcX",
        destination:
          "/legacy/13F5AWLhxwTjhDMnZ6ww4oJWgRkBoW9ji4JnDzwQXjsQhiT2kcX",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
