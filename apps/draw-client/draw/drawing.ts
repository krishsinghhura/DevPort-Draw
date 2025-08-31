// draw/drawing.ts
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
  switch (tool) {
    case "rect":   return previewRect(ctx, startX, startY, x, y);
    case "circle": return previewCircle(ctx, startX, startY, x, y);
    case "line":   return previewLine(ctx, startX, startY, x, y);
    case "arrow":  return previewArrow(ctx, startX, startY, x, y);
    case "pencil": return previewPencil(ctx, currentPath);
  }
}

export function finalizeTool(
  tool: Tool,
  startX: number, startY: number,
  x: number, y: number,
  currentPath: Point[],
  makeId: () => string,
): Shape | null {
  switch (tool) {
    case "rect": {
      const s = { ...finalizeRect(startX, startY, x, y), id: makeId() };
      if ("width" in s && "height" in s) {
        if (s.width === 0 || s.height === 0) return null;
      }
      return s;
    }
    case "circle": return { ...finalizeCircle(startX, startY, x, y), id: makeId() };
    case "line":   return { ...finalizeLine(startX, startY, x, y), id: makeId() };
    case "arrow":  return { ...finalizeArrow(startX, startY, x, y), id: makeId() };
    case "pencil": return { ...finalizePencil(currentPath), id: makeId() };
  }
  return null;
}
