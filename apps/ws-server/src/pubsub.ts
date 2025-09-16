import { redisClient } from "@repo/servers-common/redisClient";
import { broadcastLocal } from "./brodcast";

export async function setupRedisPubSub() {
  const sub = redisClient.duplicate();
  await sub.connect();

  await sub.pSubscribe("room:*", (message:any) => {
    try {
      const payload = JSON.parse(message);
      const roomId = payload.roomId;
      if (!roomId) return;
      broadcastLocal(roomId, payload);
    } catch (err) {
      console.error("PubSub parse error:", err);
    }
  });
}
