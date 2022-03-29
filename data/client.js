import Client, { Network } from "@helium/http";

export const TAKE_MAX = 100000;

const client = new Client(
  new Network({
    // the only request this client will make is to grab the current block height
    // the results calculation client is defined in /jobs/client.js
    baseURL: "https://api.helium.io",
    version: 1,
  }),
  {
    userAgent: "helium-vote-site",
  }
);

export default client;
