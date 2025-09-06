import { Shape } from "./types";
import { HTTP_BACKEND } from "@/config";

export async function getOldShapes(roomId: string): Promise<Shape[]> {
  const token = localStorage.getItem("token");

  await fetch(`${HTTP_BACKEND}/room/${roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).catch((err) => {
    console.error("Failed to warm cache:", err);
  });

  
  return [];
}
