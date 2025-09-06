import { WebSocketServer } from "ws";
import { connectRedis } from "@repo/servers-common/redisClient";
import { checkUser } from "./auth";
import { setupCronJobs } from "./cron";
import { setupRedisPubSub } from "./pubsub";
import { handleMessage } from "./events";
import { addUser, removeUser, UserSession } from "./brodcast";

const PORT = 3002;

const wss = new WebSocketServer({ port: PORT });

(async () => {
  await connectRedis();
  await setupRedisPubSub();
  setupCronJobs();
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
  addUser(session);

  ws.on("message", async (raw) => {
    await handleMessage(ws, session, raw.toString());
  });

  ws.on("close", () => {
    removeUser(session);
  });
});
