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
  | { type: "chat"; message: string; userId: number; roomId: string; id?: string; origin?: string }
  | { type: "draw"; shape: any; userId: number; roomId: string; id?: string; origin?: string }
  | { type: "erase"; ids: string[]; userId: number; roomId: string; id?: string; origin?: string }
  | { type: "move"; shape: any; userId: number; roomId: string; id?: string; origin?: string }
  | { type: "update"; shape: any; userId: number; roomId: string; id?: string; origin?: string };

export async function flushRoomEvents(slug: string, roomId: number) {
  const redisKey = `room:${slug}:events`;

  // 1️⃣ Fetch all unsaved events from Redis
  const events = await redisClient.lRange(redisKey, 0, -1);
  if (events.length === 0) return;

  // 2️⃣ Parse + validate events
  const valid = events
    .map((e) => safeParse<EventPayload>(e))
    .filter((e): e is EventPayload => !!e && e.origin !== "history"); // skip history events

  if (valid.length === 0) {
    console.warn(`⚠️ No valid events to flush for room:${slug}`);
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
      skipDuplicates: true, // ensures duplicate UUIDs are not inserted
    });

    // 5️⃣ Delete only if DB insert succeeds
    await redisClient.del(redisKey);

    console.log(`✅ Flushed ${eventsWithId.length} events for room:${slug}`);
  } catch (err) {
    console.error(`❌ Failed to flush room:${slug}`, err);
    // 🔄 Keep Redis data → retry on next run
  }
}

export async function flushAllRooms() {
  const keys = await redisClient.keys("room:*:events");

  for (const key of keys) {
    const parts = key.split(":");
    if (parts.length < 3) continue; // sanity check
    const slug = parts[1] as string;

    // 🔹 Lookup real roomId once per flush
    const room = await prismaClient.room.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!room) {
      console.warn(`⚠️ No room found for slug:${slug}`);
      continue;
    }

    await flushRoomEvents(slug, room.id);
  }
}
