import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/servers-common/config";
import { middleware } from "./middleware";
import { SignupSchema, SigninSchema, CreateRoom } from "@repo/common/zodTypes";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt-ts";
import { redisClient, connectRedis } from "@repo/servers-common/redisClient";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const ai = new GoogleGenAI({
  vertexai: false,
  apiKey: process.env.GEMENI_API_KEY,
});
prismaClient.$connect();
connectRedis();

/**
 * Signup
 */
app.post("/signup", async (req, res) => {
  if (!req.body) {
    return res.status(400).json("No valid inputs");
  }

  const parseddata = SignupSchema.safeParse(req.body);
  if (!parseddata.success) {
    return res.status(400).json({ message: "Incorrect Inputs" });
  }

  const hashedPassword = bcrypt.hashSync(parseddata.data.password, 10);
  try {
    const signupResponse = await prismaClient.user.create({
      data: {
        name: parseddata.data.name,
        email: parseddata.data.email,
        password: hashedPassword,
      },
    });

    res.json({ signupResponse });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * Signin
 */
app.post("/signin", async (req, res) => {
  if (!req.body) {
    return res.status(400).json("No Valid inputs");
  }

  const parseddata = SigninSchema.safeParse(req.body);
  if (!parseddata.success) {
    return res.status(400).json({ message: "Incorrect Inputs" });
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: { email: parseddata.data.email },
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: `No user with ${parseddata.data.email}` });
    }

    const checkPassword = await bcrypt.compare(
      parseddata.data.password,
      user.password
    );
    if (!checkPassword) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Create Room
 */
app.post("/create-room", middleware, async (req, res) => {
  const parseddata = CreateRoom.safeParse(req.body);
  if (!parseddata.success) {
    return res.status(400).json({ message: "Incorrect Inputs" });
  }

  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parseddata.data.slug,
        adminId: String(userId),
        members: { connect: { id: String(userId) } }, // Admin auto joins
      },
    });

    res.json({ roomId: room.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/room/:roomId", middleware, async (req, res) => {
  const roomId = req.params.roomId;
  const cacheKey = `room:${roomId}:cache`;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // ✅ Check membership
    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
      include: { members: { select: { id: true } } },
    });

    if (!room) {
      return res.status(404).json({ error: "No Room found" });
    }

    const isMember = room.members.some((m) => m.id === userId);
    if (!isMember) {
      return res.status(403).json({ error: "Not a room member" });
    }
  } catch (error: any) {
    return res.status(500).json(error);
  }

  try {
    // 1️⃣ Check if already cached
    const cached = await redisClient.lRange(cacheKey, 0, -1);
    if (cached.length > 0) {
      console.log(`[Cache] Warm cache already exists for roomId:${roomId}`);
      return res.json({ message: "Cache already warm" });
    }

    // 2️⃣ Warm up cache from DB (but don’t return the events)
    const rows = await prismaClient.chatHistory.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    const events = rows.map((r) => {
      try {
        return JSON.parse(r.message);
      } catch {
        return { type: "chat", message: r.message, userId: r.userId, roomId };
      }
    });

    if (events.length > 0) {
      await redisClient.rPush(
        cacheKey,
        events.map((e) => JSON.stringify(e))
      );
      await redisClient.expire(cacheKey, 24 * 60 * 60);
      console.log(`[DB→Cache] Warmed up cache for roomId:${roomId}`);
    }

    // 🚫 Don’t return DB data — just say cache is ready
    return res.json({ message: "Cache warmed" });
  } catch (error: any) {
    console.error("Error warming cache:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/room/:roomId/remove", middleware, async (req, res) => {
  const { roomId } = req.params;
  const { userIdToRemove } = req.body;
  const userId = req.userId;

  const room = await prismaClient.room.findUnique({ where: { id: roomId } });
  if (!room) return res.status(404).json({ message: "Room not found" });
  if (room.adminId !== userId)
    return res.status(403).json({ message: "Only admin can remove members" });

  await prismaClient.room.update({
    where: { id: roomId },
    data: { members: { disconnect: { id: userIdToRemove } } },
  });

  res.json({ message: "User removed" });
});

app.post("/room/:roomId/join", middleware, async (req, res) => {
  const { roomId } = req.params;
  const userId = req.userId;

  const room = await prismaClient.room.findUnique({
    where: { id: roomId },
    include: { members: true },
  });

  if (!room) return res.status(404).json({ message: "Room not found" });

  if (
    !room.isPublic ||
    !room.publicExpiresAt ||
    room.publicExpiresAt < new Date()
  ) {
    return res.status(403).json({ message: "Room is private or link expired" });
  }

  // Add user if not already a member
  const alreadyMember = room.members.some((m) => m.id === userId);
  if (!alreadyMember) {
    await prismaClient.room.update({
      where: { id: roomId },
      data: { members: { connect: { id: userId?.toString() } } },
    });
  }

  res.json({ message: "Joined successfully" });
});

app.post("/room/:roomId/public", middleware, async (req, res) => {
  const { roomId } = req.params;
  const userId = req.userId;

  const room = await prismaClient.room.findUnique({ where: { id: roomId } });
  if (!room) return res.status(404).json({ message: "Room not found" });
  if (room.adminId !== userId)
    return res.status(403).json({ message: "Only admin can make public" });

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hrs

  await prismaClient.room.update({
    where: { id: roomId },
    data: { isPublic: true, publicExpiresAt: expiresAt },
  });

  res.json({ message: "Room is now public", expiresAt });
});

app.get("/get-members/:roomId", async (req, res) => {
  const { roomId } = req.params;

  const room = await prismaClient.room.findUnique({
    where: { id: roomId },
    include: { members: true },
  });

  return res.json(room?.members);
});

app.get("/dashboard", middleware, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const rooms = await prismaClient.room.findMany({
      where: {
        members: { some: { id: String(userId) } },
      },
      include: {
        members: { select: { id: true, name: true } },
      },
    });

    const dashboardData = rooms.map((room) => ({
      id: room.id,
      slug: room.slug,
      adminId: room.adminId,
      isPublic: room.isPublic,
      publicExpiresAt: room.publicExpiresAt,
      memberCount: room.members.length,
    }));

    return res.json({ rooms: dashboardData });
  } catch (error: any) {
    console.error("Error fetching dashboard:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.delete("/room/:roomId", middleware, async (req, res) => {
  const { roomId } = req.params;
  const userId = req.userId;

  try {
    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
      include: { members: true },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.adminId === userId) {
      // 🗑️ Admin → delete whole room
      await prismaClient.room.delete({
        where: { id: roomId },
      });

      // Clear Redis cache
      const cacheKey = `room:${roomId}:cache`;
      await redisClient.del(cacheKey);

      return res.json({ message: "Room deleted successfully" });
    } else {
      // 👤 Non-admin → leave room
      const isMember = room.members.some((m) => m.id === userId);
      if (!isMember) {
        return res
          .status(400)
          .json({ message: "User is not a member of this room" });
      }

      await prismaClient.room.update({
        where: { id: roomId },
        data: { members: { disconnect: { id: userId?.toString() } } },
      });

      return res.json({ message: "You have left the room" });
    }
  } catch (error: any) {
    console.error("Error in delete/leave room:", error);
    return res.status(500).json({ error: error.message });
  }
});

const SYSTEM_PROMPT = `
You are an AI that generates diagrams for a collaborative whiteboard app.
Output must STRICTLY follow this schema:

{
  "type": "init-history",
  "roomId": "<roomId>",
  "events": [
    {
      "type": "draw",
      "shape": {
        "id": "<unique-id>",
        "type": "rect" | "circle" | "line" | "arrow" | "text",
        ...shape-specific-fields,
        "color": "white"
      },
      "userId": "AI"
    },
    { "type": "move", "shape": { ... } }
  ]
}

Shape-specific rules:
- rect: {id, type:"rect", x, y, width, height, color}
- circle: {id, type:"circle", centerX, centerY, radius, color}
- line: {id, type:"line", x1, y1, x2, y2, color}
- arrow: {id, type:"arrow", x1, y1, x2, y2, color}
- text: {id, type:"text", x, y, text, color}

Constraints:
- Coordinates (x,y) should be spaced logically (e.g., server left, client right).
- radius/width/height must be realistic (no zero or negative).
- Add a short natural language "description" field summarizing the diagram.

Rules:
- Do not include markdown or text outside JSON.
- Every shape must have x,y,width,height,radius etc. positioned to fit canvas.
- Add a description in a \"description\" field at the top.
- Output ONLY JSON.
`;

app.post("/generate-diagram", middleware, async (req, res) => {
  const { prompt, roomId } = req.body;
  const userId = req.userId; // ✅ from middleware

  if (!prompt || !roomId || !userId) {
    return res.status(400).json({ error: "prompt, roomId and userId are required" });
  }

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nUser request: ${prompt}\nRoomId: ${roomId}`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json", // force JSON
      },
    });

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text) {
      return res.status(500).json({ error: "AI did not return any JSON" });
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Invalid JSON returned from AI", raw: text });
    }

    // ✅ Update all events' userId with actual userId
    if (parsed?.events && Array.isArray(parsed.events)) {
      parsed.events = parsed.events.map((event: any) => ({
        ...event,
        userId, // overwrite AI with real user
      }));
    }

    // ✅ Push events into Redis
    const redisKeyEvents = `room:${roomId}:events`;
    const redisKeyCache = `room:${roomId}:cache`;

    const serializedEvents = parsed.events.map((e: any) => JSON.stringify(e));

    if (serializedEvents.length > 0) {
      await redisClient.rPush(redisKeyEvents, serializedEvents);
      await redisClient.rPush(redisKeyCache, serializedEvents);
      await redisClient.expire(redisKeyCache, 24 * 60 * 60); // keep cache fresh
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error("AI generation failed:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log("✅ HTTP server running on :3001");
});
