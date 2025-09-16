"use client"
import { Shape } from "../types";

// tools/circle.ts
export function previewCircle(ctx: CanvasRenderingContext2D, startX: number, startY: number, x: number, y: number) {
  const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
  ctx.beginPath();
  ctx.arc(startX, startY, radius, 0, Math.PI * 2);
  ctx.stroke(); // uses ctx.strokeStyle
}


export function finalizeCircle(startX: number, startY: number, x: number, y: number,id:string): Shape {
  return {
    id,
    type: "circle",
    centerX: startX,
    centerY: startY,
    radius: Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2)),
  };
}
