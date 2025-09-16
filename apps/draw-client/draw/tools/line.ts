"use client"
import { Shape } from "../types";

// tools/line.ts
export function previewLine(ctx: CanvasRenderingContext2D, startX: number, startY: number, x: number, y: number) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(x, y);
  ctx.stroke(); // keeps selectedColor
}


export function finalizeLine(startX: number, startY: number, x: number, y: number, id:string): Shape {
  return { id,type: "line", x1: startX, y1: startY, x2: x, y2: y };
}
