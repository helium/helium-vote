const { default: Client, Network } = require("@helium/http");

const TAKE_MAX = 100000;
const STAKEJOY_API_BASE_URL = "https://tileserver.skittles.stakejoy.com";

const client = new Client(
  new Network({ baseURL: STAKEJOY_API_BASE_URL, version: 1 }),
  { retry: 3, userAgent: "helium-vote-calculation-job" }
);

module.exports = { client, TAKE_MAX, STAKEJOY_API_BASE_URL };
