import { redis } from "./redis";

const fetch = async (key, fetcherFunction, expires) => {
  const existing = await get(key);

  if (existing) return existing;

  return set(key, fetcherFunction, expires);
};

const get = async (key) => {
  const value = await redis.get(key);
  if (!value) return null;
  return JSON.parse(value);
};

const set = async (key, fetcherFunction, expires) => {
  const value = await fetcherFunction();

  await redis.set(key, JSON.stringify(value), "EX", expires);
  return value;
};

export default { fetch, set };
