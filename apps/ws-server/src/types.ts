import { WebSocket } from "ws";

export type UserSession = {
  userId: string;
  rooms: string[];
  ws: WebSocket;
};

export type RoomEvent = {
  type: string;
  roomId: string;
  userId?: string;
  origin?: "history" | "live";
  [key: string]: any;
};
