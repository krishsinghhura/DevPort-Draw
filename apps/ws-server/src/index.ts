import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/servers-common/config";
import { prismaClient } from "@repo/db/client";
import { redisClient, connectRedis } from "@repo/servers-common/redisClient";
import cron from "node-cron";
import { flushAllRooms } from "./utils/flushWoker";

const PORT = 3002;
const MAX_EVENTS_PER_ROOM = 100;
const EVENTS_TTL_SECONDS = 24 * 60 * 60;

const wss = new WebSocketServer({ port: PORT });

type UserSession = {
  userId: string;
  rooms: string[];
  ws: WebSocket;
};

const users: UserSession[] = [];

function roomCacheKey(roomId: string) {
  return `room:${roomId}:cache`;
}

function roomEventsKey(roomId: string) {
  return `room:${roomId}:events`;
}

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || typeof decoded === "string") return null;
    return decoded.userId;
  } catch {
    return null;
  }
}

function broadcastLocal(roomId: string, payload: any) {
  const msg = JSON.stringify(payload);
  users.forEach((user) => {
    if (user.rooms.includes(roomId)) {
      try {
        user.ws.send(msg);
      } catch (err) {
        console.error("WS send error:", err);
      }
    }
  });
}

cron.schedule("*/1 * * * *", async () => {
  console.log("⏳ Running flush job...");
  await flushAllRooms();
});

async function saveEvent(roomId: string, payload: any) {
  if (payload.origin === "history") return;

  const cacheKey = roomCacheKey(roomId);
  const eventsKey = roomEventsKey(roomId);

  await redisClient.rPush(cacheKey, JSON.stringify(payload));
  await redisClient.lTrim(cacheKey, -MAX_EVENTS_PER_ROOM, -1);
  await redisClient.expire(cacheKey, EVENTS_TTL_SECONDS);

  await redisClient.rPush(eventsKey, JSON.stringify(payload));
  await redisClient.expire(eventsKey, EVENTS_TTL_SECONDS);
}

async function loadRoomHistory(roomId: string) {
  const key = roomCacheKey(roomId);
  const cached = await redisClient.lRange(key, 0, -1);

  return cached.map((c) => {
    try {
      return { ...JSON.parse(c), origin: "history" };
    } catch {
      return { type: "unknown", raw: c, roomId, origin: "history" };
    }
  });
}

async function setupRedisPubSub() {
  const sub = redisClient.duplicate();
  await sub.connect();

  await sub.pSubscribe("room:*", (message, channel) => {
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

(async () => {
  await connectRedis();
  await setupRedisPubSub();
  console.log(`✅ Redis connected, WebSocket server running on :${PORT}`);
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

    const { type, roomId } = parsed;

    if (type === "join-room") {
      const room = await prismaClient.room.findUnique({
        where: { id: roomId },
        include: { members: true },
      });

      if (!room) return;
      const isMember = room.members.some((m) => m.id === userId);
      if (!isMember) {
        ws.send(
          JSON.stringify({ type: "error", message: "Not a room member" })
        );
        return;
      }

      if (!session.rooms.includes(roomId)) {
        session.rooms.push(roomId);
      }

      const events = await loadRoomHistory(roomId);
      ws.send(JSON.stringify({ type: "init-history", roomId, events }));
      return;
    }

    if (type === "leave-room") {
      session.rooms = session.rooms.filter((r) => r !== roomId);
      return;
    }

    const eventTypes = ["chat", "draw", "erase", "move", "update", "resize"];
    if (eventTypes.includes(type)) {
      const payload = { ...parsed, roomId, userId };
      await saveEvent(roomId, payload);
      await redisClient.publish(`room:${roomId}`, JSON.stringify(payload));
      return;
    }
  });

  ws.on("close", () => {
    const idx = users.indexOf(session);
    if (idx !== -1) users.splice(idx, 1);
  });
});
