// draw/history.ts
import { state } from "./state";
import { clearCanvas } from "./clearCanvas";
import { saveGuest } from "./storage";

export function pushState() {
  state.undoStack.push(JSON.parse(JSON.stringify(state.shapes)));
  state.redoStack = [];
}

export function undo() {
  if (state.undoStack.length === 0 || !state.ctx || !state.canvas) return;
  state.redoStack.push(JSON.parse(JSON.stringify(state.shapes)));
  state.shapes = state.undoStack.pop()!;
  clear();
}

export function redo() {
  if (state.redoStack.length === 0 || !state.ctx || !state.canvas) return;
  state.undoStack.push(JSON.parse(JSON.stringify(state.shapes)));
  state.shapes = state.redoStack.pop()!;
  clear();
}

function clear() {
  clearCanvas(state.shapes, state.canvas!, state.ctx!);
  if (!state.isServerMode) saveGuest(state.shapes);
}
