// draw/events/mouseDown.ts
import { state, screenToWorld } from "../state";
import { selectAt } from "../selection";

export function onMouseDown(e: MouseEvent) {
  if (!state.canvas || !state.getTool) return;
  const rect = state.canvas.getBoundingClientRect();
  const rawX = e.clientX - rect.left;
  const rawY = e.clientY - rect.top;

  // Panning (space+drag or middle mouse)
  if (e.button === 1 || e.button === 2 || e.shiftKey || e.metaKey || e.ctrlKey) {
    state.camera.isPanning = true;
    state.camera.panStartX = rawX;
    state.camera.panStartY = rawY;
    state.camera.lastOffsetX = state.camera.offsetX;
    state.camera.lastOffsetY = state.camera.offsetY;
    return;
  }

  const { x, y } = screenToWorld(rawX, rawY);
  state.startX = x;
  state.startY = y;
  state.activeTool = state.getTool();

  if (state.activeTool === "select") {
    selectAt(x, y);
    state.clicked = !!state.selectedShape;
    return;
  }

  state.clicked = true;
  if (state.activeTool === "pencil") {
    state.currentPath = [{ x, y }];
  }
}
