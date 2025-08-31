import { Shape } from "../types";
import { isShapeNearPoint } from "../utils";

export function previewEraser(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.strokeStyle = "red";
  ctx.strokeRect(x - 10, y - 10, 20, 20); // just a cursor indicator
}

export function finalizeEraser(shapes: Shape[], x: number, y: number): Shape[] {
  // remove entire shapes if eraser overlaps
  return shapes.filter((s) => !isShapeNearPoint(s, x, y));
}
