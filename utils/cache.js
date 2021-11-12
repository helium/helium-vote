import { redis } from "./redis";

const get = async (key) => {
  const value = await redis.get(key);
  if (!value) return null;
  return JSON.parse(value);
};

export default { get };
