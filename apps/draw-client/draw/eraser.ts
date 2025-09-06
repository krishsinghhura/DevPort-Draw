import { state } from "./state";
import { previewEraser, finalizeEraser } from "./tools/eraser";
import { clearCanvas } from "./clearCanvas";
import { pushState } from "./history";
import { saveGuest } from "./storage";
import { wsErase } from "./networking/ws";

export function handleEraserMove(x: number, y: number) {
  if (!state.ctx || !state.canvas) return;

  const before = state.shapes.length;
  const updated = finalizeEraser(state.shapes, x, y);

  if (updated.length !== before) {
    const erasedIds = state.shapes
      .filter((s) => !updated.includes(s))
      .map((s) => s.id);

    pushState();
    state.shapes = updated;
    if (!state.isServerMode) saveGuest(state.shapes);
    else wsErase(erasedIds);
  }

  clearCanvas(state.shapes, state.canvas, state.ctx);
  previewEraser(state.ctx, x, y);
}
