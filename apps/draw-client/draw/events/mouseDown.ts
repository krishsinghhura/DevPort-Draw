// draw/events/mouseDown.ts
import { state } from "../state";
import { selectAt } from "../selection";

export function onMouseDown(e: MouseEvent) {
  if (!state.canvas || !state.getTool) return;
  const rect = state.canvas.getBoundingClientRect();
  state.startX = e.clientX - rect.left;
  state.startY = e.clientY - rect.top;
  state.activeTool = state.getTool();

  if (state.activeTool === "select") {
    selectAt(state.startX, state.startY);
    state.clicked = !!state.selectedShape;
    return;
  }

  state.clicked = true;
  if (state.activeTool === "pencil") {
    state.currentPath = [{ x: state.startX, y: state.startY }];
  }
}
