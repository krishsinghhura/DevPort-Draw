"use client"
import { state } from "./state";
import { hitTest } from "./hitTest";
import type { Shape } from "./types";
import { clearCanvas } from "./clearCanvas";

export function selectAt(x: number, y: number) {
  state.selectedShape = null;

  for (let i = state.shapes.length - 1; i >= 0; i--) {
    const s = state.shapes[i];
    if (hitTest(s, x, y)) {
      state.selectedShape = s;
      if (s.type === "rect" || s.type === "text") {
        state.dragOffsetX = x - s.x;
        state.dragOffsetY = y - s.y;
      } else if (s.type === "circle") {
        state.dragOffsetX = x - s.centerX;
        state.dragOffsetY = y - s.centerY;
      } else if (s.type === "line" || s.type === "arrow") {
        state.dragOffsetX = x - s.x1;
        state.dragOffsetY = y - s.y1;
      } else if (s.type === "pencil") {
        state.dragOffsetX = x - s.path[0].x;
        state.dragOffsetY = y - s.path[0].y;
      }
      break;
    }
  }
}

export function dragSelectedTo(x: number, y: number) {
  const s = state.selectedShape as Shape | null;
  if (!s) return;

  switch (s.type) {
    case "rect":
    case "text":
      s.x = x - state.dragOffsetX;
      s.y = y - state.dragOffsetY;
      break;
    case "circle":
      s.centerX = x - state.dragOffsetX;
      s.centerY = y - state.dragOffsetY;
      break;
    case "line":
    case "arrow": {
      const dx = x - state.dragOffsetX - s.x1;
      const dy = y - state.dragOffsetY - s.y1;
      s.x1 += dx; s.y1 += dy;
      s.x2 += dx; s.y2 += dy;
      break;
    }
    case "pencil": {
      const dx = x - state.dragOffsetX - s.path[0].x;
      const dy = y - state.dragOffsetY - s.path[0].y;
      s.path = s.path.map(p => ({ x: p.x + dx, y: p.y + dy }));
      break;
    }
  }

  if (state.ctx && state.canvas) {
    clearCanvas(state.shapes, state.canvas, state.ctx);
  }
}
