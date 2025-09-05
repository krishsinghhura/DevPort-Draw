///draw/api.ts
import { Shape } from "./types";
import { HTTP_BACKEND } from "@/config";

export async function getOldShapes(roomId: string): Promise<Shape[]> {
  const token = localStorage.getItem("token");
  
  const res = await fetch(`${HTTP_BACKEND}/room/${roomId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}), 
    },
  });  

  const rows = await res.json();

  const shapes: Shape[] = rows
    .map((row: any) => {
      // --- Determine if row is DB format or Redis format ---
      const msg = row.message ? safeParse(row.message) : row;

      if (!msg || msg.type !== "draw" || !msg.shape) return null;

      const s = msg.shape;

      // 🔹 normalize shapes so they match clearCanvas expectations
      switch (s.type) {
        case "rect":
          return {
            type: "rect",
            x: s.x,
            y: s.y,
            width: s.width,
            height: s.height,
            id: s.id,
          };
        case "circle":
          return {
            type: "circle",
            centerX: s.centerX,
            centerY: s.centerY,
            radius: s.radius,
            id: s.id,
          };
        case "line":
          return {
            type: "line",
            x1: s.x1,
            y1: s.y1,
            x2: s.x2,
            y2: s.y2,
            id: s.id,
          };
        case "arrow":
          return {
            type: "arrow",
            x1: s.x1,
            y1: s.y1,
            x2: s.x2,
            y2: s.y2,
            id: s.id,
          };
        case "pencil":
          return { type: "pencil", path: s.path || [], id: s.id };
        case "text":
          return { type: "text", x: s.x, y: s.y, text: s.text, id: s.id };
        default:
          return null;
      }
    })
    .filter((s: Shape | null): s is Shape => s !== null);

  return shapes;
}

// safe JSON parse helper
function safeParse(str: string) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
