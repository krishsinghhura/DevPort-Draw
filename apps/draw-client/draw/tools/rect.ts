import { Shape } from "../types";

export function previewRect(ctx: CanvasRenderingContext2D, startX: number, startY: number, x: number, y: number) {
  ctx.strokeRect(startX, startY, x - startX, y - startY);
}

export function finalizeRect(startX: number, startY: number, x: number, y: number): Shape {
  return { type: "rect", x: startX, y: startY, width: x - startX, height: y - startY };
}
