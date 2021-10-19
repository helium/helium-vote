module.exports = {
  serverRuntimeConfig: {
    votes: [
      {
        id: "135xR8htbqTHCkWVPJEeqJuDVtyZJB852WuAzL7XwSVaVhdtH8q",
        deadline: 1059000,
        link: "https://github.com/helium/HIP",
        name: "Test Vote: Ice Cream",
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
