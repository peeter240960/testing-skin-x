import { config } from 'dotenv';
import Redis from 'ioredis';
config();

let _redisClient: Redis;

function getRedisClient() {
  if (_redisClient) {
    return _redisClient;
  }

  _redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 0,
  });

  return _redisClient;
}

export const redisClient = getRedisClient();

export const redisSubscriberClient = getRedisClient();

export const redisPublisherClient = getRedisClient();
