import { createClient } from "redis";
import {REDIS_HOST,REDIS_PASSWORD} from "./index";

export const redisClient = createClient({
  username: "default",
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
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
