// draw/events/mouseUp.ts
import { state, screenToWorld } from "../state";
import { finalizeTool } from "../drawing";
import { pushState } from "../history";
import { saveGuest } from "../storage";
import { wsDraw, wsMove } from "../networking/ws";
import { clearCanvas } from "../clearCanvas";
import { uid } from "../utils";

export function onMouseUp(e: MouseEvent) {
  if (state.camera.isPanning) {
    state.camera.isPanning = false;
    return;
  }

  if (!state.clicked || !state.activeTool || !state.canvas || !state.ctx) return;

  const rect = state.canvas.getBoundingClientRect();
  const rawX = e.clientX - rect.left;
  const rawY = e.clientY - rect.top;
  const { x, y } = screenToWorld(rawX, rawY);

  // move
  if (state.activeTool === "select" && state.selectedShape) {
    if (!state.isServerMode) saveGuest(state.shapes);
    else wsMove(state.selectedShape);
    state.clicked = false;
    return;
  }

  // draw
  const shape = finalizeTool(
    state.activeTool, state.startX, state.startY, x, y, state.currentPath, uid
  );

  state.clicked = false;
  state.activeTool = null;

  if (!shape) return;

  pushState();
  state.shapes.push(shape);
  clearCanvas(state.shapes, state.canvas, state.ctx);

  if (!state.isServerMode) saveGuest(state.shapes);
  else wsDraw(shape);
}
