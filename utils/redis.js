import Redis from "ioredis";

const REDIS_URL = process.env.NEXT_PUBLIC_REDIS_URL
  ? process.env.NEXT_PUBLIC_REDIS_URL
  : "redis://localhost:6379";

export const redis = new Redis(REDIS_URL);
