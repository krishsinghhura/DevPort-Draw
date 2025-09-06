import { state, screenToWorld } from "../state";
import { dragSelectedTo } from "../selection";
import { clearCanvas } from "../clearCanvas";
import { handleEraserMove } from "../eraser";
import { previewTool } from "../drawing";

export function onMouseMove(e: MouseEvent) {
  if (!state.canvas || !state.ctx) return;

  const rect = state.canvas.getBoundingClientRect();
  const rawX = e.clientX - rect.left;
  const rawY = e.clientY - rect.top;

  // --- Panning ---
  if (state.camera.isPanning) {
    state.camera.offsetX = state.camera.lastOffsetX + (rawX - state.camera.panStartX);
    state.camera.offsetY = state.camera.lastOffsetY + (rawY - state.camera.panStartY);
    clearCanvas(state.shapes, state.canvas, state.ctx);
    return;
  }

  const { x, y } = screenToWorld(rawX, rawY);

  // --- Resizing ---
  if (state.resizing && state.selectedShape) {
    const s = state.selectedShape;
    switch (s.type) {
      case "rect":
        if (state.activeHandle === "bottom-right") {
          s.width = x - s.x;
          s.height = y - s.y;
        } else if (state.activeHandle === "top-left") {
          s.width += s.x - x;
          s.height += s.y - y;
          s.x = x;
          s.y = y;
        }
        break;
      case "circle":
        s.radius = Math.abs(x - s.centerX);
        break;
      case "line":
      case "arrow":
        if (state.activeHandle === "start") {
          s.x1 = x;
          s.y1 = y;
        } else if (state.activeHandle === "end") {
          s.x2 = x;
          s.y2 = y;
        }
        break;
    }
    clearCanvas(state.shapes, state.canvas, state.ctx);
    return;
  }

  // --- Drag move ---
  if (state.activeTool === "select" && state.clicked && state.selectedShape) {
    dragSelectedTo(x, y);
    return;
  }

  // --- If not drawing, stop here ---
  if (!state.clicked || !state.activeTool) return;

  // --- Drawing mode ---
  clearCanvas(state.shapes, state.canvas, state.ctx);

  // Pencil path
  if (state.activeTool === "pencil") {
    state.currentPath.push({ x, y });
  }

  // Eraser
  if (state.activeTool === "eraser") {
    handleEraserMove(x, y);
    return;
  }

  state.ctx.save();
  state.ctx.translate(state.camera.offsetX, state.camera.offsetY);
  state.ctx.scale(state.camera.scale, state.camera.scale);

  previewTool(
    state.ctx,
    state.activeTool,
    state.startX,
    state.startY,
    x,
    y,
    state.currentPath
  );

  state.ctx.restore();
}
