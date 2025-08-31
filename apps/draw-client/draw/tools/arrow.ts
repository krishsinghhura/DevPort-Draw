import { Shape } from "../types";
import { drawArrow } from "../utils";

export function previewArrow(ctx: CanvasRenderingContext2D, startX: number, startY: number, x: number, y: number) {
  drawArrow(ctx, startX, startY, x, y);
}

export function finalizeArrow(startX: number, startY: number, x: number, y: number): Shape {
  return { type: "arrow", x1: startX, y1: startY, x2: x, y2: y };
}
