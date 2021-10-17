import Client, { Network } from "@helium/http";

export const TAKE_MAX = 100000;

// const client = new Client(
//   new Network({ baseURL: "https://helium-api.stakejoy.com", version: 1 }),
//   { retry: 3 }
// );
const client = new Client(Network.staging);

export default client;
