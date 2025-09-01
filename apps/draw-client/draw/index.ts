// draw/index.ts
import { clearCanvas } from "./clearCanvas";
import { state, setEnv } from "./state";
import { loadGuest } from "./storage";
import { setupWS } from "./networking/ws";
import { bindAll } from "./events/bind";
import { getOldShapes } from "./api";
import type { Tool, Shape } from "./types";

export async function initDraw(
  canvas: HTMLCanvasElement,
  getTool: () => Tool,
  roomId?: string | null,
  socket?: WebSocket | null
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    clearCanvas(state.shapes, canvas, ctx!);
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  setEnv({ canvas, ctx, getTool, roomId, socket });

  if (state.isServerMode && roomId) {
    try {
      // ✅ now returns Shape[]
      const shapes: Shape[] = await getOldShapes(roomId);
      console.log("Fetched shapes:", shapes);

      state.shapes = shapes;
      clearCanvas(state.shapes, canvas, ctx);
    } catch (err) {
      console.error("Failed to fetch shapes from API:", err);
    }

    setupWS();
  } else {
    state.shapes = loadGuest();
    clearCanvas(state.shapes, canvas, ctx);
  }

  bindAll(canvas);
}
