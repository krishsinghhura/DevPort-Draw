import cron from "node-cron";
import { flushAllRooms } from "./utils/flushWoker";

export function setupCronJobs() {
  cron.schedule("*/1 * * * *", async () => {
    console.log("⏳ Running flush job...");
    await flushAllRooms();
  });
}
