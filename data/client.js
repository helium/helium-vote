import Client, { Network } from "@helium/http";

export const TAKE_MAX = 100000;

const client = new Client(
  new Network({
    // the only request this client will make is to grab the current block height
    // the results calculation client is defined in /jobs/client.js
    baseURL: "https://helium-api.stakejoy.com",
    version: 1,
  }),
  {
    userAgent: "helium-vote-site",
  }
);

// const client = new Client(
//   new Network({
//     baseURL: "https://tileserver.skittles.stakejoy.com",
//     version: 1,
//   }),
//   {
//     userAgent: "helium-vote",
//   }
// );
//
// const client = new Client(Network.staging);
//
// const client = new Client();

export default client;
