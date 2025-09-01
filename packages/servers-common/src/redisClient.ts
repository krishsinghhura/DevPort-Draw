import { createClient } from "redis";

export const redisClient = createClient({
  username: "default",
  password: "crLm9qZLLF8ZWyMjuPwhBmrneaFlQQcV",
  socket: {
    host: "redis-11477.c8.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 11477,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
