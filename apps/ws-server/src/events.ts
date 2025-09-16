import { WebSocket } from "ws";
import { prismaClient } from "@repo/db/client";
import { saveEvent, loadRoomHistory } from "./redis";
import { broadcastLocal } from "./brodcast";
import { UserSession, RoomEvent } from "./types";

const EVENT_TYPES = ["chat", "draw", "erase", "move", "update", "resize"];

export async function handleMessage(
  ws: WebSocket,
  session: UserSession,
  raw: string
) {
  let parsed: RoomEvent;
  try {
    parsed = JSON.parse(raw.toString());
  } catch {
    console.error("Invalid WS message:", raw.toString());
    return;
  }

  const { type, roomId } = parsed;

  if (!type || !roomId) return;

  if (type === "join-room") {
    const room = await prismaClient.room.findUnique({
      where: { id: roomId },
      include: { members: true },
    });

    if (!room) return;

    const isMember = room.members.some((m:any) => m.id === session.userId);
    if (!isMember) {
      ws.send(JSON.stringify({ type: "error", message: "Not a room member" }));
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

  if (EVENT_TYPES.includes(type)) {
    const payload: RoomEvent = { ...parsed, roomId, userId: session.userId };
    await saveEvent(roomId, payload);
    await broadcastLocal(roomId, payload);
    return;
  }
}
