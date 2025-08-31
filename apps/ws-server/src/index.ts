import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/servers-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 3002 });

type UserSession = {
  userId: number;
  rooms: string[];
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
 * Send event to all clients in the same room
 */
function broadcast(roomId: string, payload: any) {
  const msg = JSON.stringify(payload);
  users.forEach((user) => {
    if (user.rooms.includes(roomId)) {
      user.ws.send(msg);
    }
  });
}

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
      console.log(`User ${userId} joined room ${roomId}`);
      if (!session.rooms.includes(roomId)) {
        session.rooms.push(roomId);

        // load existing history from DB (chat + shapes)
        const history = await prismaClient.chatHistory.findMany({
          where: {
            room: { slug: roomId }
          },
          orderBy: { createdAt: "asc" }
        });

        const events = history.map((h) => {
          try {
            // shape/chat both stored in message
            return JSON.parse(h.message);
          } catch {
            return { type: "chat", text: h.message, userId: h.userId };
          }
        });

        // send replay to new user
        ws.send(JSON.stringify({
          type: "init-history",
          roomId,
          events
        }));
      }
    }

    // --- LEAVE ROOM ---
    if (type === "leave-room") {
      console.log(`User ${userId} left room ${roomId}`);
      session.rooms = session.rooms.filter((r) => r !== roomId);
    }

    // --- CHAT MESSAGE ---
    if (type === "chat") {
      const { message } = parsed;
      console.log(`Chat in ${roomId} from ${userId}: ${message}`);

      const payload = { type: "chat", message, roomId, userId };

      // persist as plain string
      await prismaClient.chatHistory.create({
        data: {
          message: JSON.stringify(payload),
          user: { connect: { id: userId } },
          room: { connect: { slug: roomId } },
        },
      });

      broadcast(roomId, payload);
    }

    // --- DRAW SHAPE ---
    if (type === "draw") {
      const { shape } = parsed;
      console.log(`Draw in ${roomId} from ${userId}: ${shape.id}`);

      const payload = { type: "draw", shape, roomId, userId };

      // persist as JSON string
      await prismaClient.chatHistory.create({
        data: {
          message: JSON.stringify(payload),
          user: { connect: { id: userId } },
          room: { connect: { slug: roomId } },
        },
      });

      broadcast(roomId, payload);
    }

    // --- ERASE SHAPES ---
    if (type === "erase") {
      const { ids } = parsed;
      console.log(`Erase in ${roomId} from ${userId}: ${ids}`);

      const payload = { type: "erase", ids, roomId, userId };

      // persist as JSON string
      await prismaClient.chatHistory.create({
        data: {
          message: JSON.stringify(payload),
          user: { connect: { id: userId } },
          room: { connect: { slug: roomId } },
        },
      });

      broadcast(roomId, payload);
    }
  });

  ws.on("close", () => {
    console.log(`User ${userId} disconnected, cleaning up`);
    const idx = users.indexOf(session);
    if (idx !== -1) users.splice(idx, 1);
  });
});
