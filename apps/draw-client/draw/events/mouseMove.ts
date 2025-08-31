// draw/events/mouseMove.ts
import { state } from "../state";
import { dragSelectedTo } from "../selection";
import { clearCanvas } from "../clearCanvas";
import { handleEraserMove } from "../eraser";
import { previewTool } from "../drawing";

export function onMouseMove(e: MouseEvent) {
  if (!state.canvas || !state.ctx) return;

  const rect = state.canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (state.activeTool === "select" && state.clicked && state.selectedShape) {
    dragSelectedTo(x, y);
    return;
  }

  if (!state.clicked || !state.activeTool) return;

  clearCanvas(state.shapes, state.canvas, state.ctx);

  if (state.activeTool === "pencil") {
    state.currentPath.push({ x, y });
  }

  if (state.activeTool === "eraser") {
    handleEraserMove(x, y);
    return;
  }

  previewTool(state.ctx, state.activeTool, state.startX, state.startY, x, y, state.currentPath);
}
