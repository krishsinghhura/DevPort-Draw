import { prismaClient } from "@repo/db/client";
import { redisClient } from "@repo/servers-common/redisClient";
import { v4 as uuidv4 } from "uuid"; // for unique event IDs

// 🔹 Safe JSON.parse wrapper
function safeParse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

type EventPayload =
  | { type: "chat"; message: string; userId: string; roomId: string; id?: string; origin?: string }
  | { type: "draw"; shape: any; userId: string; roomId: string; id?: string; origin?: string }
  | { type: "erase"; ids: string[]; userId: string; roomId: string; id?: string; origin?: string }
  | { type: "move"; shape: any; userId: string; roomId: string; id?: string; origin?: string }
  | { type: "update"; shape: any; userId: string; roomId: string; id?: string; origin?: string };

export async function flushRoomEvents(roomId: string) {
  const redisKey = `room:${roomId}:events`;

  // 1️⃣ Fetch all unsaved events from Redis
  const events = await redisClient.lRange(redisKey, 0, -1);
  if (events.length === 0) return;

  // 2️⃣ Parse + validate events
  const valid = events
    .map((e) => safeParse<EventPayload>(e))
    .filter((e): e is EventPayload => !!e && e.origin !== "history");

  if (valid.length === 0) {
    console.warn(`⚠️ No valid events to flush for roomId=${roomId}`);
    return;
  }

  try {
    // 3️⃣ Assign unique IDs if missing
    const eventsWithId = valid.map((e) => ({
      ...e,
      id: e.id || uuidv4(),
    }));

    // 4️⃣ Persist into DB in bulk
    await prismaClient.chatHistory.createMany({
      data: eventsWithId.map((e) => ({
        message: JSON.stringify(e),
        userId: e.userId,
        roomId,
      })),
      skipDuplicates: true,
    });

    // 5️⃣ Delete only if DB insert succeeds
    await redisClient.del(redisKey);

    console.log(`✅ Flushed ${eventsWithId.length} events for roomId=${roomId}`);
  } catch (err) {
    console.error(`❌ Failed to flush roomId=${roomId}`, err);
    // 🔄 Keep Redis data → retry on next run
  }
}

export async function flushAllRooms() {
  const keys = await redisClient.keys("room:*:events");

  for (const key of keys) {
    const parts = key.split(":");
    if (parts.length < 3) continue;
    const roomId = parts[1]!;
    
    await flushRoomEvents(roomId);
  }
}
