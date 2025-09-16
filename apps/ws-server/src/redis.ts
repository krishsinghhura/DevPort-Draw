import { redisClient } from "@repo/servers-common/redisClient";
import { RoomEvent } from "./types";

export const MAX_EVENTS_PER_ROOM = 100;
export const EVENTS_TTL_SECONDS = 24 * 60 * 60;

export function roomCacheKey(roomId: string) {
  return `room:${roomId}:cache`;
}

export function roomEventsKey(roomId: string) {
  return `room:${roomId}:events`;
}

export async function saveEvent(roomId: string, payload: RoomEvent) {
  if (payload.origin === "history") return;

  const cacheKey = roomCacheKey(roomId);
  const eventsKey = roomEventsKey(roomId);
  const msg = JSON.stringify(payload);

  const pipeline = redisClient.multi();
  pipeline.rPush(cacheKey, msg);
  pipeline.lTrim(cacheKey, -MAX_EVENTS_PER_ROOM, -1);
  pipeline.expire(cacheKey, EVENTS_TTL_SECONDS);

  pipeline.rPush(eventsKey, msg);
  pipeline.expire(eventsKey, EVENTS_TTL_SECONDS);

  await pipeline.exec();
}

export async function loadRoomHistory(roomId: string) {
  const key = roomCacheKey(roomId);
  const cached = await redisClient.lRange(key, 0, -1);

  return cached.map((c:any) => {
    try {
      return { ...JSON.parse(c), origin: "history" };
    } catch {
      return { type: "unknown", raw: c, roomId, origin: "history" };
    }
  });
}
