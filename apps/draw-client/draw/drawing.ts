// draw/drawing.ts
import { state } from "./state";
import type { Shape, Tool, Point } from "./types";
import { previewRect, finalizeRect } from "./tools/rect";
import { previewCircle, finalizeCircle } from "./tools/circle";
import { previewLine, finalizeLine } from "./tools/line";
import { previewArrow, finalizeArrow } from "./tools/arrow";
import { previewPencil, finalizePencil } from "./tools/pencil";

export function previewTool(
  ctx: CanvasRenderingContext2D,
  tool: Tool,
  startX: number, startY: number,
  x: number, y: number,
  currentPath: Point[],
) {
  ctx.save();
  ctx.strokeStyle = state.selectedColor || "white";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]); // dashed preview outline

  switch (tool) {
    case "rect":   previewRect(ctx, startX, startY, x, y); break;
    case "circle": previewCircle(ctx, startX, startY, x, y); break;
    case "line":   previewLine(ctx, startX, startY, x, y); break;
    case "arrow":  previewArrow(ctx, startX, startY, x, y); break;
    case "pencil": previewPencil(ctx, currentPath); break;
  }

  ctx.restore();
}

export function finalizeTool(
  tool: Tool,
  startX: number, startY: number,
  x: number, y: number,
  currentPath: Point[],
  makeId: () => string,
): Shape | null {
  let shape: Shape | null = null;

  switch (tool) {
    case "rect": {
      const s = finalizeRect(startX, startY, x, y, makeId());
      if ("width" in s && "height" in s) {
        if (s.width === 0 || s.height === 0) return null;
      }
      shape = s;
      break;
    }
    case "circle": shape = finalizeCircle(startX, startY, x, y, makeId()); break;
    case "line":   shape = finalizeLine(startX, startY, x, y, makeId()); break;
    case "arrow":  shape = finalizeArrow(startX, startY, x, y, makeId()); break;
    case "pencil": shape = finalizePencil(currentPath, makeId()); break;
  }

  if (shape) {
    // attach selected color to shape
    (shape as any).color = state.selectedColor;
  }

  return shape;
}
