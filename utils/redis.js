import Redis from "ioredis";

export const redis = new Redis(process.env.NEXT_PUBLIC_REDIS_URL);
