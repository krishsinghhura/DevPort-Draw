import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/servers-common/config";
import { middleware } from "./middleware";
import { SignupSchema, SigninSchema, CreateRoom } from "@repo/common/zodTypes";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt-ts";
import { redisClient, connectRedis } from "@repo/servers-common/redisClient";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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
  const redisKey = `room:${roomId}:events`;

  const userId = req.userId;
  

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
      include: { members: { select: { id: true } } },
    });

    if (!room) {
      return res.status(404).json({ error: "No Room found" });
    }
    

    const isMember = room.members.some((m) => {
      return m.id === userId;
    });

    

    if (!isMember) {
      return res.status(403).json({ error: "Not a room member" });
    }
  } catch (error: any) {
    return res.status(500).json(error);
  }

  try {
    // 1️⃣ Try Redis
    const cached = await redisClient.lRange(redisKey, 0, -1);
    if (cached.length > 0) {
      const events = cached.map((m) => JSON.parse(m));
      console.log(`[Cache] Returned events for roomId:${roomId}`);
      return res.json(events);
    }

    // 2️⃣ Fallback to DB
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

    // 3️⃣ Cache
    if (events.length > 0) {
      await redisClient.rPush(
        redisKey,
        events.map((e) => JSON.stringify(e))
      );
      await redisClient.expire(redisKey, 24 * 60 * 60);
    }

    console.log(`[DB] Returned events for roomId:${roomId}`);
    return res.json(events);
  } catch (error: any) {
    console.error("Error fetching room history:", error);
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

app.listen(3001, () => {
  console.log("✅ HTTP server running on :3001");
});
