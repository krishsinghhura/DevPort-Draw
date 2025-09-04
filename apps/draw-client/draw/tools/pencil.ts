import { Shape, Point } from "../types";

export function previewPencil(ctx: CanvasRenderingContext2D, path: Point[]) {
  if (path.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  path.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.stroke();
}

export function finalizePencil(path: Point[],id:string): Shape {
  return { id,type: "pencil", path };
}
