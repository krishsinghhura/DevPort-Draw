import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/servers-common/config";
import { middleware } from "./middleware";
import { SignupSchema, SigninSchema, CreateRoom } from "@repo/common/zodTypes";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt-ts";
import { getRoomId } from "./utils/getRoomId";
import { redisClient, connectRedis } from "@repo/servers-common/redisClient";

const app = express();
app.use(express.json());

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
      return res.status(404).json({ message: `No user with ${parseddata.data.email}` });
    }

    const checkPassword = await bcrypt.compare(parseddata.data.password, user.password);
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
        adminId: Number(userId),
      },
    });

    res.json({ roomId: room.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Fetch room history
 * → Redis cache first, fallback to DB
 */
app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug;
  const redisKey = `room:${slug}:events`;

  try {
    // 1️⃣ Try Redis first
    const cached = await redisClient.lRange(redisKey, 0, -1);
    if (cached.length > 0) {
      const events = cached.map((m) => JSON.parse(m));
      console.log(`[Cache] Returned events for room:${slug}`);
      return res.json(events);
    }

    // 2️⃣ Fallback to DB
    const roomId = await getRoomId(slug);
    if (roomId === null) {
      return res.status(404).json({ error: "Room not found" });
    }

    const rows = await prismaClient.chatHistory.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    const events = rows.map((r) => {
      try {
        return JSON.parse(r.message); // if structured JSON
      } catch {
        return { type: "chat", message: r.message, userId: r.userId, roomId: slug };
      }
    });

    // 3️⃣ Cache in Redis for next time
    if (events.length > 0) {
      await redisClient.rPush(redisKey, events.map((e) => JSON.stringify(e)));
      await redisClient.expire(redisKey, 24 * 60 * 60); // 24h TTL
    }

    console.log(`[DB] Returned events for room:${slug}`);
    return res.json(events);
  } catch (error: any) {
    console.error("Error fetching room history:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3001, () => {
  console.log("✅ HTTP server running on :3001");
});
