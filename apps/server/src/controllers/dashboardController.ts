import { prismaClient } from "../config/prisma";
import { Request, Response } from "express";

export async function getDashboard(req:Request, res:Response){
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

    const dashboardData = rooms.map((room:any) => ({
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
}