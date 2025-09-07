import { redisClient, connectRedis } from "@repo/servers-common/redisClient";

connectRedis();

export { redisClient };
