// draw/events/mouseDown.ts
import { state, screenToWorld } from "../state";
import { selectAt } from "../selection";

// --- Define handle types for shapes ---
type RectHandle = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type CircleHandle = "left" | "right" | "top" | "bottom";
type LineHandle = "start" | "end";

type Handle = RectHandle | CircleHandle | LineHandle;

// Hit-test to see if user clicked on a resize handle
function hitHandle(shape: any, x: number, y: number): Handle | null {
  const size = 6; // hitbox size in px

  if (shape.type === "rect") {
    const handles: Record<RectHandle, { x: number; y: number }> = {
      "top-left": { x: shape.x, y: shape.y },
      "top-right": { x: shape.x + shape.width, y: shape.y },
      "bottom-left": { x: shape.x, y: shape.y + shape.height },
      "bottom-right": { x: shape.x + shape.width, y: shape.y + shape.height },
    };
    for (const key of Object.keys(handles) as RectHandle[]) {
      const h = handles[key];
      if (Math.abs(x - h.x) < size && Math.abs(y - h.y) < size) return key;
    }
  } else if (shape.type === "circle") {
    const handles: Record<CircleHandle, { x: number; y: number }> = {
      right: { x: shape.centerX + shape.radius, y: shape.centerY },
      left: { x: shape.centerX - shape.radius, y: shape.centerY },
      bottom: { x: shape.centerX, y: shape.centerY + shape.radius },
      top: { x: shape.centerX, y: shape.centerY - shape.radius },
    };
    for (const key of Object.keys(handles) as CircleHandle[]) {
      const h = handles[key];
      if (Math.abs(x - h.x) < size && Math.abs(y - h.y) < size) return key;
    }
  } else if (shape.type === "line" || shape.type === "arrow") {
    if (Math.abs(x - shape.x1) < size && Math.abs(y - shape.y1) < size) return "start";
    if (Math.abs(x - shape.x2) < size && Math.abs(y - shape.y2) < size) return "end";
  }

  return null;
}

export function onMouseDown(e: MouseEvent) {
  if (!state.canvas || !state.getTool) return;

  const rect = state.canvas.getBoundingClientRect();
  const rawX = e.clientX - rect.left;
  const rawY = e.clientY - rect.top;

  // --- Panning (middle mouse or modifier key) ---
  if (e.button === 1 || e.button === 2 || e.shiftKey || e.metaKey || e.ctrlKey) {
    state.camera.isPanning = true;
    state.camera.panStartX = rawX;
    state.camera.panStartY = rawY;
    state.camera.lastOffsetX = state.camera.offsetX;
    state.camera.lastOffsetY = state.camera.offsetY;
    return;
  }

  // --- Convert to world coords ---
  const { x, y } = screenToWorld(rawX, rawY);
  state.startX = x;
  state.startY = y;
  state.activeTool = state.getTool();

  // --- Selection / Resizing ---
  if (state.activeTool === "select") {
    if (state.selectedShape) {
      const handle = hitHandle(state.selectedShape, x, y);
      if (handle) {
        state.resizing = true;
        state.activeHandle = handle;
        return;
      }
    }
    selectAt(x, y);
    state.clicked = !!state.selectedShape;
    return;
  }

  // --- Drawing ---
  state.clicked = true;
  if (state.activeTool === "pencil") {
    state.currentPath = [{ x, y }];
  }
}
