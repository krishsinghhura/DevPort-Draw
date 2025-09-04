// ws-server/index.ts
import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/servers-common/config";
import { prismaClient } from "@repo/db/client";
import { redisClient, connectRedis } from "@repo/servers-common/redisClient";
import cron from "node-cron";
import { flushAllRooms } from "./utils/flushWoker";

const wss = new WebSocketServer({ port: 3002 });

// 🔹 User session type
type UserSession = {
  userId: string;
  rooms: string[]; // store roomIds instead of slugs
  ws: WebSocket;
};

const users: UserSession[] = [];

// --- JWT verification ---
function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || typeof decoded === "string") return null;
    return decoded.userId;
  } catch {
    return null;
  }
}

// --- Local broadcast ---
function broadcastLocal(roomId: string, payload: any) {
  const msg = JSON.stringify(payload);
  users.forEach((user) => {
    if (user.rooms.includes(roomId)) {
      user.ws.send(msg);
    }
  });
}

// --- Flush job ---
cron.schedule("*/1 * * * *", async () => {
  console.log("⏳ Running flush job...");
  await flushAllRooms();
});

// --- Save events in Redis ---
async function saveEvent(roomId: string, payload: any) {
  if (payload.origin === "history") return;
  await redisClient.rPush(`room:${roomId}:events`, JSON.stringify(payload));
}

// --- Persist events in DB ---
async function persistEvent(roomId: string, payload: any, userId: string) {
  if (payload.origin === "history") return;

  const room = await prismaClient.room.findUnique({
    where: { id: roomId },
    select: { id: true },
  });

  if (!room) {
    console.error(`❌ No room found with id=${roomId}, event not saved`);
    return;
  }

  await prismaClient.chatHistory.create({
    data: {
      message: JSON.stringify(payload),
      userId,
      roomId: room.id,
    },
  });
}

// --- Load past events ---
async function loadRoomHistory(roomId: string) {
  const redisKey = `room:${roomId}:cache`;

  const cached = await redisClient.lRange(redisKey, 0, -1);
  if (cached.length > 0) {
    return cached.map((c) => ({ ...JSON.parse(c), origin: "history" }));
  }

  const history = await prismaClient.chatHistory.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
  });

  const events = history.map((h) => {
    try {
      return { ...JSON.parse(h.message), origin: "history" };
    } catch {
      return {
        type: "chat",
        text: h.message,
        userId: h.userId,
        origin: "history",
      };
    }
  });

  if (events.length > 0) {
    await redisClient.rPush(
      redisKey,
      events.map((e) => JSON.stringify(e))
    );
    await redisClient.expire(redisKey, 60 * 5);
  }

  return events;
}

// --- Setup Redis pub/sub ---
async function setupRedisPubSub() {
  const sub = redisClient.duplicate();
  await sub.connect();

  sub.pSubscribe("room:*", (message, channel) => {
    const payload = JSON.parse(message);
    const roomId = payload.roomId;
    broadcastLocal(roomId, payload);
  });
}

// --- Init server ---
(async () => {
  await connectRedis();
  await setupRedisPubSub();
  console.log("✅ Redis connected, WebSocket server running on :3002");
})();

// --- WebSocket handling ---
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

    // --- JOIN ROOM ---
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

      session.rooms.push(roomId);

      const events = await loadRoomHistory(roomId);
      ws.send(JSON.stringify({ type: "init-history", roomId, events }));
    }

    // --- LEAVE ROOM ---
    if (type === "leave-room") {
      console.log(`User ${userId} left room ${roomId}`);
      session.rooms = session.rooms.filter((r) => r !== roomId);
    }

    // --- HANDLE USER EVENTS ---
    const eventTypes = ["chat", "draw", "erase", "move", "update", "resize"];
    if (eventTypes.includes(type)) {
      const payload = { ...parsed, roomId, userId };
      await saveEvent(roomId, payload);
      await persistEvent(roomId, payload, userId);
      await redisClient.publish(`room:${roomId}`, JSON.stringify(payload));
    }
  });

  ws.on("close", () => {
    console.log(`User ${userId} disconnected, cleaning up`);
    const idx = users.indexOf(session);
    if (idx !== -1) users.splice(idx, 1);
  });
});
