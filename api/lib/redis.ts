import { Redis } from "@upstash/redis";

const HASH_KEY = "station_votes";

let client: Redis | null | undefined;

export function isRedisConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
  );
}

export function getRedis(): Redis | null {
  if (!isRedisConfigured()) return null;
  if (client === undefined) {
    client = Redis.fromEnv();
  }
  return client;
}

export { HASH_KEY };
