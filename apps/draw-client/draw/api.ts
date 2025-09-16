// draw/api.ts
"use client";

import { Shape } from "./types";
import { HTTP_BACKEND } from "@/config";

export async function getOldShapes(
  roomId: string,
  token: string
): Promise<Shape[]> {
  try {
    const res = await fetch(`${HTTP_BACKEND}/room/${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch old shapes:", res.statusText);
      return [];
    }

    const data = await res.json().catch(() => []);
    return (data?.shapes as Shape[]) || [];
  } catch (err) {
    console.error("Failed to warm cache:", err);
    return [];
  }
}
