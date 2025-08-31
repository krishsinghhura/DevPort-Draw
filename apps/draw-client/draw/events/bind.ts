// draw/events/bind.ts
import { onMouseDown } from "./mouseDown";
import { onMouseMove } from "./mouseMove";
import { onMouseUp } from "./mouseUp";
import { onDblClick } from "./dblClick";
import { onKeyDown } from "./keyDown";

export function bindAll(canvas: HTMLCanvasElement) {
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("dblclick", onDblClick);
  window.addEventListener("keydown", onKeyDown);
}
