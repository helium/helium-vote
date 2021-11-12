const { redis } = require("./redis");

const get = async (key) => {
  const value = await redis.get(key);
  if (!value) return null;
  return JSON.parse(value);
};

const set = async (key, value) => {
  if (value) {
    await redis.set(key, JSON.stringify(value));
  } else {
    console.error("Error setting results");
  }
  return value;
};

module.exports = { get, set };
