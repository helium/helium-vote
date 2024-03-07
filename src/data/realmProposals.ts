import { HNT_MINT, IOT_MINT, MOBILE_MINT } from "@helium/spl-utils";

export const realmProposals = {
  [HNT_MINT.toBase58()]: [
    {
      tags: ["HIP 88", "Realms"],
      name: "HIP 88: Adjustment of DAO Utility A Score",
      status: "passed",
      endTs: 1690329600,
      href: "https://app.realms.today/dao/hnt/proposal/6qgUFLqXkaJAcDvSufHFafQkRXt1MWegtZ9qsHvizp7S",
      summary: `This HIP proposes to make the $A$ factor of the subDAO utility score more granular by using the individual onboarding fee of an active device paid instead of relying on a homogeneous onboarding fee. This will allow subDAOs to change their onboarding fee without either negatively affecting their subDAO utility score.`,
      outcomes: [
        {
          votes: 253457245,
        },
        {
          votes: 2337953,
        },
      ],
    },
  ],
  [MOBILE_MINT.toBase58()]: [
    {
      tags: ["HIP 96", "Realms"],
      name: "HIP 96: WiFi AP Onboarding Structure",
      status: "passed",
      endTs: 1700524800,
      href: "https://app.realms.today/dao/mobile/proposal/5pPPhWfuMx7cHNW4Um9PTuceJLw7RrqwJ7LKQ8Ldc98q",
      summary: `This HIP outlines the onboarding fee structure for two new device types: "Indoor WiFi APs" and "Outdoor WiFi APs". The proposed onboarding fees are designed to be approximately 10% of the Manufacturer's Suggested Retail Price (MSRP) of the devices (please see below for specifics). The fees consist of a combination of HNT derived data credits and MOBILE tokens. It is expected that future devices of different classes will follow a similar pricing structure based on their respective MSRP.`,
      outcomes: [
        {
          votes: 14279117910,
        },
        {
          votes: 1911617830,
        },
      ],
    },
    {
      tags: ["HIP 93", "Realms"],
      name: "HIP 93: Addition of Wi-Fi Access Points to the Helium Mobile SubDAO",
      status: "passed",
      endTs: 1696723200,
      href: "https://app.realms.today/dao/mobile/proposal/8Nd4VFUZcBUhP28sSkz4SDcKEWrGu5j9Hsaz8RLn4hao",
      summary: `This HIP outlines important aspects of adding Wi-Fi access points to the Helium Mobile Network. It describes location verification during onboarding for indoor access points and suggests approaches to continuously verify the locations of such access points. Additionally, the HIP proposes an algorithm and reward structure for Wi-Fi access points similar to what is defined in HIP-74 but adjusted for the technical specifics of Wi-Fi compared to CBRS radios.`,
      outcomes: [
        {
          votes: 19626804010,
        },
        {
          votes: 390619450,
        },
      ],
    },
    {
      tags: ["HIP 85", "Realms"],
      name: "HIP 85: MOBILE Hex Coverage Limit",
      status: "passed",
      endTs: 1696723200,
      href: "https://app.realms.today/dao/mobile/proposal/GRrnrpk1BRQz54EyrNFcst1bo1iNiD1ZALh7KFbX9j6U",
      summary:
        "This Helium Improvement Proposal (HIP) suggests adding a baseline hex multiplier score to the MOBILE Proof-of-Coverage (PoC) Modeled Coverage Points based on whether other coverage from Helium 5G deployments exists within that res12 hex. This will reward unique coverage with more Modeled Coverage PoC points than redundant and overlapping coverage. This HIP only applies to outdoor radios, and no changes to the reward structure of indoor mobile radios are being made with this HIP.",
      outcomes: [
        {
          votes: 27964616800,
        },
        {
          votes: 8007876000,
        },
      ],
    },
    {
      tags: ["HIP 87", "Realms"],
      name: "HIP 87: Proportional Service Provider Rewards",
      status: "passed",
      endTs: 1630147200,
      href: "https://app.realms.today/dao/mobile/proposal/DtMtA61XvnNWAPb3rr9isaPPHopUQCHFhAu5QJmaNy1k",
      summary:
        "This proposal clarifies Service Provider eligibility for rewards established in HIP-53 (currently defined as 10% of emissions). It implements a usage-based approach to calculating Service Provider rewards similar to HIP-10 for the IOT Network. Service Providers will be rewarded in MOBILE tokens at a 1:1 ratio to burned Data Credits. The proposal also specifies that any part of this category that is not rewarded will not be minted. This prevents a Service Provider from claiming the full MOBILE Service Provider Reward Bucket while burning less than an equivalent amount of Data Credits (DC). A proportional distribution will be applied if the total Data Credits exceeds the emissions value for this category of rewards.",
      outcomes: [
        {
          votes: 14923931950,
        },
        {
          votes: 483651500,
        },
      ],
    },
    {
      tags: ["HIP 89", "Realms"],
      name: "HIP 89: MOBILE Network Onboarding Fees",
      status: "passed",
      endTs: 1686182400,
      href: "https://app.realms.today/dao/mobile/proposal/8AZepByGXEejTYwy3mLKA57k19w27uukc9QUhJHFVYwj",
      summary:
        "This HIP requests that Helium Foundation correct the MOBILE Onboarding Fee from 0 USD to 40 USD and the MOBILE Location Assert Fee from 0 USD to 10 USD as soon as possible so that the fees are in compliance with HIP-53 and HIP-19.",
      outcomes: [
        {
          votes: 40134791690,
        },
        {
          votes: 1343213560,
        },
      ],
    },
    {
      tags: ["HIP 84", "Realms"],
      name: "HIP 84: Service Provider Hex Boosting",
      status: "passed",
      endTs: 1686873600,
      href: "https://app.realms.today/dao/mobile/proposal/E2XvmWoYx2ZGs1uWHjNszgmsnq3Dtd1x2a64tsqJyDKT",
      summary:
        "HIP 84 proposes a framework to enhance the growth and optimization of the Mobile Network by allowing Service Providers to influence the deployment of coverage in specific locations. The aim is to improve the usefulness and coverage of the network by targeting areas with a high potential for data offloading.",
      outcomes: [
        {
          votes: 32064766060,
        },
        {
          votes: 1024175030,
        },
      ],
    },
    {
      tags: ["HIP 82", "Realms"],
      name: "HIP 82: Add Helium Mobile as a Service Provider to the Helium Mobile subDAO",
      status: "passed",
      endTs: 1686873600,
      href: "https://app.realms.today/dao/mobile/proposal/3u2DUcZ2GMRviU5Ycy827urBtovutUiGrt3jqJHQek3w",
      summary:
        "HIP 82 proposes the addition of Helium Mobile as a Service Provider to the Helium Mobile Network subNetwork. The Helium Community has made significant progress in building the Helium Mobile Network, and Helium Mobile, a subsidiary of Nova Labs, seeks to build on this opportune time by initiating the first Service Provider of the Mobile Network. Helium Mobile aims to offload its subscriber traffic onto the network, paving the way for other Service Providers to join and improving the overall network traffic and rewards for Hotspot operators.",
      outcomes: [
        {
          votes: 39630647870,
        },
        {
          votes: 2405833,
        },
      ],
    },
    {
      tags: ["HIP 79", "Realms"],
      name: "HIP 79: Mobile PoC - Mappers Rewards",
      status: "passed",
      endTs: 1686873600,
      href: "https://app.realms.today/dao/mobile/proposal/3r2bTix8eGGKiu1HTzLpXY7PdS5321n4sFqNs8cBDRNR",
      summary:
        "HIP 79 proposes creating a new rewardable entity for the Mobile Network, Mobile Mappers. It introduces a framework for rewarding different types of mapping activities, such as verification mapping and discovery mapping. The proposal suggests reducing the Service Provider reward bucket from 20% to 10% and increasing the Mapper reward bucket from 10% to 20% to increase reward incentives for Mappers. Mappers will be eligible for specific percentages of emitted MOBILE rewards based on their participation in mapping activities.",
      outcomes: [
        {
          votes: 28342688270,
        },
        {
          votes: 6090792060,
        },
      ],
    },
  ],
  [IOT_MINT.toBase58()]: [
    {
      tags: ["HIP 100", "Realms"],
      name: "HIP 100: Deploy EU868 Region Plan to the Majority of Africa",
      status: "passed",
      endTs: 1703270056,
      href: "https://app.realms.today/dao/iot/proposal/99ca9Adku8Zk151vGiySEPcGJxdd8V2wAQkGFK4PcE54",
      summary:
        "This HIP recommends that the community provisionally sets the majority of the currently unspecified and EU433 region countries in the Africa region to the EU868 regional frequency plan.",
      outcomes: [
        {
          votes: 378364305,
        },
        {
          votes: 254809,
        },
      ],
    },
    {
      tags: ["HIP 83", "Realms"],
      name: "HIP 83: Restore First to Respond Witness Rewarding",
      status: "passed",
      endTs: 1698105600,
      href: "https://app.realms.today/dao/iot/proposal/H5mGJg9927DBRr1NH64VVk6hoSTJdnAC5kngGxgvumUS",
      summary:
        "Currently, the Proof-of-Coverage Oracles collect all the witnesses for a beacon and randomly reward a selection of 14 witnesses. This HIP proposes to revert to rewarding the first 14 Hotspots responding to a beacon, incentivizing the most useful Hotspots to sensor traffic by prioritizing the low latency connections that sensors need for uplinks, downlinks, and join requests to work correctly.",
      outcomes: [
        {
          votes: 8630277560,
        },
        {
          votes: 3639242980,
        },
      ],
    },
    {
      tags: ["HIP 92", "Realms"],
      name: "HIP 92: Correcting IOT Pre-mine Calculation Errors",
      status: "failed",
      endTs: 1697155200,
      href: "https://app.realms.today/dao/iot/proposal/4TZE7E3KvRgZiaSMF8h4s7F9UhWDJUgNdNuBz8y1dGzq",
      summary:
        'Based on the specifications in Helium Docs, and in HIP 52, all Hotspots that were active, not on the denylist, and earned rewards from either beaconing, witnessing or passing rewardable data, were supposed to receive the IOT pre-mine at the migration. This HIP proposes to correct for a coding error that left out all "Data Only" Hotspots, as well as an error in the selection process during the migration, which missed some active Hotspots with PoC rewards.',
      outcomes: [
        {
          votes: 3651135780,
        },
        {
          votes: 5307502230,
        },
      ],
    },
    {
      tags: ["HIP 91", "Realms"],
      name: "HIP 91: Continuation of Reduced IOT Location Assertion Cost",
      status: "passed",
      endTs: 1690156800,
      href: "https://app.realms.today/dao/iot/proposal/GDDd639STzeJgJfuha2Ciyx1uDixYHhr4B5sUisG6v5K",
      summary:
        "This HIP proposes an extension of the reduced Hotspot location assertion fees on the network. Currently, the fees for IOT hotspots were halved as per HIP-69 since the Solana migration. However, this adjustment is set to expire on July 20th, 2023, at midnight UTC, after which the fee will increase back to $10 in Data Credits. This proposal suggests maintaining the reduced fee for an additional 6 months to incentivize hotspot relocation and gather more data on the impact of a $5 versus a $10 reassert fee.",
      outcomes: [
        {
          votes: 2631673530,
        },
        {
          votes: 104254030,
        },
      ],
    },
    {
      tags: ["HIP 72", "Realms"],
      name: "HIP 72: Secure Concentrators",
      status: "failed",
      endTs: 1690156800,
      href: "https://app.realms.today/dao/iot/proposal/E3LHMo2Ke59vFUH5gMjtUSQoSHokodHujkNqPu5GwfYr",
      summary:
        "In this HIP, we propose an amendment to HIP 19 to enable a new type of IoT network actor: a Secure Concentrator Card (SCC). A Secure Concentrator Card is similar to a standard LoRaWAN concentrator card, but with an additional Secure Microcontroller Unit (SMCU) and onboard GPS receiver. The SMCU digitally signs LoRa data packets as they are received from the radio. In this way, packet data and its corresponding metadata (RSSI, Frequency, GPS location and time) can be verified to be authentic. The primary intention of this HIP is to combat Proof-of-Coverage gaming. Secure Concentrtors achieve this by providing trustworthy data upon which better gaming detectors and PoC algorithms can be built.",
      outcomes: [
        {
          votes: 3699219860,
        },
        {
          votes: 2344586130,
        },
      ],
    },
  ],
};
