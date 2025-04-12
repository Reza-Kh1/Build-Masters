import redis from './redisClient';
const expiryTime = Number(process.env.REDIS_TIMER) || 864000;

const deleteCahce = async (value: string) => {
  const keys = await redis.keys(value);
  if (keys.length > 0) {
    await redis.del(keys);
  }
};
const getCache = async (key: string): Promise<any | null> => {
  try {
    const cachedData = await redis.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (_error) {
    return null;
  }
};
const setCache = async (
  value: string,
  data: any,
  num?: number
): Promise<void> => {
  try {
    await redis.setex(value, num || expiryTime, JSON.stringify(data));
  } catch (err) {
    console.log(err);
  }
};

export { deleteCahce, getCache, setCache };
