const Redis = require("ioredis");

const REDIS_URL = process.env.REDIS_URL
  ? process.env.REDIS_URL
  : "redis://localhost:6379";

console.log(process.env.REDIS_URL);

const redis = new Redis(REDIS_URL);

module.exports = { redis };
