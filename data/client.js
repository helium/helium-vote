import Client, { Network } from "@helium/http";

export const TAKE_MAX = 100000;

const client = new Client(
  new Network({
    baseURL: "https://tileserver.skittles.stakejoy.com",
    version: 1,
  }),
  {
    userAgent: "helium-vote",
  }
);
//
// const client = new Client(Network.staging);
//
// const client = new Client();

export default client;
