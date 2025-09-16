"use client"
import { state } from "../state";
import { undo, redo, pushState } from "../history";
import { saveGuest } from "../storage";
import { wsDraw } from "../networking/ws";
import type { Point } from "../types";
import { uid } from "../utils";
import { clearCanvas } from "../clearCanvas";

export function onKeyDown(e: KeyboardEvent) {
  if (!state.ctx || !state.canvas) return;

  const key = e.key.toLowerCase();
  if (e.ctrlKey && key === "z") return void undo();
  if (e.ctrlKey && key === "y") return void redo();

  if (e.ctrlKey && key === "c") {
    if (state.selectedShape) {
      state.clipboard = [JSON.parse(JSON.stringify(state.selectedShape))];
    }
  }

  if (e.ctrlKey && key === "v") {
    if (!state.clipboard) return;
    pushState();

    const clones = state.clipboard.map((s) => {
      const n = JSON.parse(JSON.stringify(s));
      n.id = uid();
      if ("x" in n) n.x += 10;
      if ("y" in n) n.y += 10;
      if ("centerX" in n) n.centerX += 10;
      if ("centerY" in n) n.centerY += 10;
      if ("x1" in n) { n.x1 += 10; n.x2 += 10; }
      if ("y1" in n) { n.y1 += 10; n.y2 += 10; }
      if ("path" in n) {
        n.path = n.path.map((p: Point) => ({ x: p.x + 10, y: p.y + 10 }));
      }
      return n;
    });

    state.shapes.push(...clones);
    clearCanvas(state.shapes, state.canvas, state.ctx);
    if (!state.isServerMode) {
      saveGuest(state.shapes);
    } else {
      clones.forEach((shape) => wsDraw(shape));
    }
  }
}
