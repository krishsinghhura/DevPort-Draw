// draw/events/bind.ts
import { onMouseDown } from "./mouseDown";
import { onMouseMove } from "./mouseMove";
import { onMouseUp } from "./mouseUp";
import { onDblClick } from "./dblClick";
import { onKeyDown } from "./keyDown";
import { state } from "../state";
import { clearCanvas } from "../clearCanvas";

export function bindAll(canvas: HTMLCanvasElement) {
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("dblclick", onDblClick);
  window.addEventListener("keydown", onKeyDown);

  // zoom with wheel
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;

    const rect = canvas.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const worldX = (rawX - state.camera.offsetX) / state.camera.scale;
    const worldY = (rawY - state.camera.offsetY) / state.camera.scale;

    state.camera.scale *= zoomFactor;

    state.camera.offsetX = rawX - worldX * state.camera.scale;
    state.camera.offsetY = rawY - worldY * state.camera.scale;

    clearCanvas(state.shapes, canvas, state.ctx!);
  }, { passive: false });
}
