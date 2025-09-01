import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/servers-common/config";
import { prismaClient } from "@repo/db/client";
import { redisClient, connectRedis } from "@repo/servers-common/redisClient";
import cron from "node-cron";
import { flushAllRooms } from "./utils/flushWoker";

const wss = new WebSocketServer({ port: 3002 });

type UserSession = {
  userId: number;
  rooms: string[]; // slugs
  ws: WebSocket;
};

const users: UserSession[] = [];

/**
 * Decode and verify JWT
 */
function checkUser(token: string): number | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || typeof decoded === "string") return null;
    return Number(decoded.userId);
  } catch {
    return null;
  }
}

/**
 * Send event to all clients in the same room (local server only)
 */
function broadcastLocal(slug: string, payload: any) {
  const msg = JSON.stringify(payload);
  users.forEach((user) => {
    if (user.rooms.includes(slug)) {
      user.ws.send(msg);
    }
  });
}

/**
 * Flush job runs every 1 min
 */
cron.schedule("*/1 * * * *", async () => {
  console.log("⏳ Running flush job...");
  await flushAllRooms();
});

/**
 * Save live event in Redis list (for flush worker)
 */
async function saveEvent(slug: string, payload: any) {
  await redisClient.rPush(`room:${slug}:events`, JSON.stringify(payload));
}

/**
 * Load history for a room (slug):
 *   1. Try Redis cache (room:<slug>:cache)
 *   2. If empty, load from DB and cache it
 */
async function loadRoomHistory(slug: string) {
  const cached = await redisClient.lRange(`room:${slug}:cache`, 0, -1);
  if (cached.length > 0) {
    return cached.map((c) => JSON.parse(c));
  }

  // fallback to DB
  const history = await prismaClient.chatHistory.findMany({
    where: { room: { slug } },
    orderBy: { createdAt: "asc" },
  });

  const events = history.map((h) => {
    try {
      return JSON.parse(h.message);
    } catch {
      return { type: "chat", text: h.message, userId: h.userId };
    }
  });

  // cache in Redis (cache only, not events)
  if (events.length > 0) {
    await redisClient.rPush(
      `room:${slug}:cache`,
      events.map((e) => JSON.stringify(e))
    );
    await redisClient.expire(`room:${slug}:cache`, 60 * 5); // 5 min TTL
  }

  return events;
}

/**
 * Redis Pub/Sub for broadcasting to all servers
 */
async function setupRedisPubSub() {
  const sub = redisClient.duplicate();
  await sub.connect();

  sub.pSubscribe("room:*", (message, channel) => {
    const payload = JSON.parse(message);
    const slug = payload.slug;
    broadcastLocal(slug, payload);
  });
}

(async () => {
  await connectRedis();
  await setupRedisPubSub();
  console.log("✅ Redis connected, WebSocket server running on :3002");
})();

wss.on("connection", async (ws, request) => {
  wss.on("error", console.error);

  const url = request.url;
  if (!url) return;

  const params = new URLSearchParams(url.split("?")[1]);
  const token = params.get("token") || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  const session: UserSession = { userId, rooms: [], ws };
  users.push(session);

  ws.on("message", async (raw) => {
    let parsed: any;
    try {
      parsed = JSON.parse(raw.toString());
    } catch {
      console.error("Invalid WS message:", raw.toString());
      return;
    }

    const { type, slug } = parsed;

    // --- JOIN ROOM ---
    if (type === "join-room") {
      console.log(`User ${userId} joined room ${slug}`);
      if (!session.rooms.includes(slug)) {
        session.rooms.push(slug);

        const events = await loadRoomHistory(slug);

        ws.send(
          JSON.stringify({
            type: "init-history",
            slug,
            events,
          })
        );
      }
    }

    // --- LEAVE ROOM ---
    if (type === "leave-room") {
      console.log(`User ${userId} left room ${slug}`);
      session.rooms = session.rooms.filter((r) => r !== slug);
    }

    // --- CHAT MESSAGE ---
    if (type === "chat") {
      const { message } = parsed;
      const payload = { type: "chat", message, slug, userId };

      await saveEvent(slug, payload);
      await redisClient.publish(`room:${slug}`, JSON.stringify(payload));
    }

    // --- DRAW SHAPE ---
    if (type === "draw") {
      const { shape, state } = parsed;
      const payload = { type: "draw", shape, slug, userId };

      await saveEvent(slug, payload);
      await redisClient.publish(`room:${slug}`, JSON.stringify(payload));
    }

    // --- ERASE SHAPES ---
    if (type === "erase") {
      const { ids } = parsed;
      const payload = { type: "erase", ids, slug, userId };

      await saveEvent(slug, payload);
      await redisClient.publish(`room:${slug}`, JSON.stringify(payload));
    }
  });

  ws.on("close", () => {
    console.log(`User ${userId} disconnected, cleaning up`);
    const idx = users.indexOf(session);
    if (idx !== -1) users.splice(idx, 1);
  });
});
