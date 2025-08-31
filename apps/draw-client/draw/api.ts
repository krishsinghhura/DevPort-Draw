import axios from "axios";
import { HTTP_BACKEND } from "@/config";

export async function getOldShapes(roomId: string) {
  const response = await axios.get(`${HTTP_BACKEND}/room/${roomId}`);
  const messages: { message: string }[] = response.data || [];

  const shapes = messages
    .map((x) => {
      try {
        return JSON.parse(x.message);
      } catch {
        console.warn("Message is not JSON, skipping:", x.message);
        return null;
      }
    })
    .filter(Boolean);

  return shapes;
}
