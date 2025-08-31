import { Shape } from "../types";

export function previewLine(ctx: CanvasRenderingContext2D, startX: number, startY: number, x: number, y: number) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(x, y);
  ctx.stroke();
}

export function finalizeLine(startX: number, startY: number, x: number, y: number): Shape {
  return { type: "line", x1: startX, y1: startY, x2: x, y2: y };
}
