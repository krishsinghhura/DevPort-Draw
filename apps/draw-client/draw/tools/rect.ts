import { Shape } from "../types";

// tools/rect.ts
export function previewRect(ctx: CanvasRenderingContext2D, startX: number, startY: number, x: number, y: number) {
  ctx.beginPath();
  ctx.rect(startX, startY, x - startX, y - startY);
  ctx.stroke(); // uses ctx.strokeStyle set in previewTool
}


export function finalizeRect(startX: number, startY: number, x: number, y: number,id:string): Shape {
  return {id, type: "rect", x: startX, y: startY, width: x - startX, height: y - startY };
}
