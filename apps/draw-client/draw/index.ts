// draw/index.ts
import { clearCanvas } from "./clearCanvas";
import { state, setEnv } from "./state";
import { loadGuest } from "./storage";
import { setupWS } from "./networking/ws";
import { bindAll } from "./events/bind";
import type { Tool } from "./types";

export function initDraw(
  canvas: HTMLCanvasElement,
  getTool: () => Tool,
  roomId?: string | null,
  socket?: WebSocket | null
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  setEnv({ canvas, ctx, getTool, roomId, socket });

  if (state.isServerMode) {
    setupWS();
  } else {
    state.shapes = loadGuest();
    clearCanvas(state.shapes, canvas, ctx);
  }

  bindAll(canvas);
}
