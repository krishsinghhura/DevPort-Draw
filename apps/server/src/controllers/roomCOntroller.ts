import { prismaClient } from "@repo/db/client";
import { redisClient } from "@repo/servers-common/redisClient";
import { CreateRoom } from "@repo/common/zodTypes";

export const roomController = {
  createRoom: async (req: any, res: any) => {
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
          members: { connect: { id: String(userId) } },
        },
      });

      res.json({ roomId: room.id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getRoom: async (req: any, res: any) => {
    const roomId = req.params.roomId;
    const cacheKey = `room:${roomId}:cache`;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const room = await prismaClient.room.findUnique({
        where: { id: roomId },
        include: { members: { select: { id: true } } },
      });

      if (!room) return res.status(404).json({ error: "No Room found" });

      const isMember = room.members.some((m:any) => m.id === userId);
      if (!isMember) return res.status(403).json({ error: "Not a room member" });
    } catch (error: any) {
      return res.status(500).json(error);
    }

    try {
      const cached = await redisClient.lRange(cacheKey, 0, -1);
      if (cached.length > 0) {
        console.log(`[Cache] Warm cache already exists for roomId:${roomId}`);
        return res.json({ message: "Cache already warm" });
      }

      const rows = await prismaClient.chatHistory.findMany({
        where: { roomId },
        orderBy: { createdAt: "asc" },
        take: 50,
      });

      const events = rows.map((r:any) => {
        try {
          return JSON.parse(r.message);
        } catch {
          return { type: "chat", message: r.message, userId: r.userId, roomId };
        }
      });

      if (events.length > 0) {
        await redisClient.rPush(cacheKey, events.map((e:any) => JSON.stringify(e)));
        await redisClient.expire(cacheKey, 24 * 60 * 60);
        console.log(`[DB→Cache] Warmed up cache for roomId:${roomId}`);
      }

      return res.json({ message: "Cache warmed" });
    } catch (error: any) {
      console.error("Error warming cache:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  removeUser: async (req: any, res: any) => {
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
  },

  joinRoom: async (req: any, res: any) => {
    const { roomId } = req.params;
    const userId = req.userId;

    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
      include: { members: true },
    });

    if (!room) return res.status(404).json({ message: "Room not found" });

    if (!room.isPublic || !room.publicExpiresAt || room.publicExpiresAt < new Date()) {
      return res.status(403).json({ message: "Room is private or link expired" });
    }

    const alreadyMember = room.members.some((m:any) => m.id === userId);
    if (!alreadyMember) {
      await prismaClient.room.update({
        where: { id: roomId },
        data: { members: { connect: { id: userId?.toString() } } },
      });
    }

    res.json({ message: "Joined successfully" });
  },

  makeRoomPublic: async (req: any, res: any) => {
    const { roomId } = req.params;
    const userId = req.userId;

    const room = await prismaClient.room.findUnique({ where: { id: roomId } });
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.adminId !== userId)
      return res.status(403).json({ message: "Only admin can make public" });

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prismaClient.room.update({
      where: { id: roomId },
      data: { isPublic: true, publicExpiresAt: expiresAt },
    });

    res.json({ message: "Room is now public", expiresAt });
  },

  getMembers: async (req: any, res: any) => {
    const { roomId } = req.params;

    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
      include: { members: true },
    });

    return res.json(room?.members);
  },

  deleteOrLeaveRoom: async (req: any, res: any) => {
    const { roomId } = req.params;
    const userId = req.userId;

    try {
      const room = await prismaClient.room.findUnique({
        where: { id: roomId },
        include: { members: true },
      });

      if (!room) return res.status(404).json({ message: "Room not found" });

      if (room.adminId === userId) {
        await prismaClient.room.delete({ where: { id: roomId } });

        const cacheKey = `room:${roomId}:cache`;
        await redisClient.del(cacheKey);

        return res.json({ message: "Room deleted successfully" });
      } else {
        const isMember = room.members.some((m:any) => m.id === userId);
        if (!isMember) {
          return res.status(400).json({ message: "User is not a member of this room" });
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
  },
};
