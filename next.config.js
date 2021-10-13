module.exports = {
  serverRuntimeConfig: {
    votes: [
      {
        id: "13YxdDMkDsjnWAk1MSBKADveZm5RnMTLEqq1yTvzHKBZnvjsZF1",
        deadline: 1075000,
        link: "https://github.com/helium/HIP/blob/master/0039-hnt-redenomination.md",
        name: "HIP 39: HNT Redenomination",
        description: "This proposal suggests a redenomination of the conversion rate between bones and HNT. Currently there are 100,000,000 (10^8) bones per HNT and under the proposed redenomination the conversion rate would be adjusted to 100,000 (10^5) bones per HNT.",
        outcomes: [
          {
            value: "For HNT Redenomination",
            address: "13DB1TNxeCiVATE8tfC38NisYXJebx59K2SCXY6tuWv2McYW1rw",
          },
          {
            value: "Against HNT Redenomination",
            address: "14QKWs6GhqJkrXhwj2r3aXJFQVN5TbhHfDMnkGGAtxTg5apx32M",
          },
        ],
      },
      {
        id: "13YxdDMkDsjnWAk1MSBKADveZm5RnMTLEqq1yTvzHKBZnvjsZF2",
        deadline: 10750000,
        link: "https://github.com/helium/HIP/blob/master/0040-validator-denylist.md",
        name: "HIP 40: Validator Denylist",
        description: "This plan proposes that validators would maintain a denylist file of Hotspot addresses which are selected from a basic floor function, selecting the hotspots where earnings are abnormal.",
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
