import { prismaClient } from "@repo/db/client";
import { redisClient } from "@repo/servers-common/redisClient";
import { v4 as uuidv4 } from "uuid";

function safeParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

type BasePayload = {
  userId: string;
  roomId: string;
  id?: string;
  origin?: string;
};

type EventPayload =
  | (BasePayload & { type: "chat"; message: string })
  | (BasePayload & { type: "draw"; shape: any })
  | (BasePayload & { type: "erase"; ids: string[] })
  | (BasePayload & { type: "move"; shape: any })
  | (BasePayload & { type: "update"; shape: any })
  | (BasePayload & { type: "resize"; shape: any });

function roomEventsKey(roomId: string) {
  return `room:${roomId}:events`;
}

export async function flushRoomEvents(roomId: string) {
  const key = roomEventsKey(roomId);
  const rawEvents = await redisClient.lRange(key, 0, -1);
  if (rawEvents.length === 0) return;

  const valid = rawEvents
    .map((e:any) => safeParse<EventPayload>(e))
    .filter((e:any): e is EventPayload => !!e && e.origin !== "history");

  if (valid.length === 0) {
    await redisClient.del(key);
    return;
  }

  try {
    const eventsWithId = valid.map((e:any) => ({
      ...e,
      id: e.id || uuidv4(),
    }));

    await prismaClient.chatHistory.createMany({
      data: eventsWithId.map((e:any) => ({
        message: JSON.stringify(e),
        userId: e.userId,
        roomId: e.roomId,
      })),
      skipDuplicates: true,
    });

    await redisClient.del(key);
    console.log(`✅ Flushed ${eventsWithId.length} events for roomId=${roomId}`);
  } catch (err) {
    console.error(`❌ Failed to flush roomId=${roomId}`, err);
  }
}

export async function flushAllRooms() {
  const keys = await redisClient.keys("room:*:events");
  for (const key of keys) {
    const parts = key.split(":");
    if (parts.length !== 3) continue;
    const roomId = parts[1]!;
    await flushRoomEvents(roomId);
  }
}
