// draw/state.ts
import type { Shape, Tool, Point } from "./types";

export const state = {
  // canvas
  canvas: null as HTMLCanvasElement | null,
  ctx: null as CanvasRenderingContext2D | null,

  // tool + pointer
  activeTool: null as Tool | null,
  clicked: false,
  startX: 0,
  startY: 0,
  currentPath: [] as Point[],

  // selection
  selectedShape: null as Shape | null,
  dragOffsetX: 0,
  dragOffsetY: 0,

  // resizing
  resizing: false,
  activeHandle: null as string | null,

  // shapes + history + clipboard
  shapes: [] as Shape[],
  undoStack: [] as Shape[][],
  redoStack: [] as Shape[][],
  clipboard: null as Shape[] | null,

  // environment
  getTool: null as (() => Tool) | null,
  roomId: null as number | null, // 🔹 now a number
  socket: null as WebSocket | null,
  isServerMode: false,

  // camera (for infinite canvas)
  camera: {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    isPanning: false,
    panStartX: 0,
    panStartY: 0,
    lastOffsetX: 0,
    lastOffsetY: 0,
  },
};

export function setEnv(opts: {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  getTool: () => Tool;
  roomId?: number | null;
  socket?: WebSocket | null;
}) {
  state.canvas = opts.canvas;
  state.ctx = opts.ctx;
  state.getTool = opts.getTool;
  state.roomId = opts.roomId ?? null;
  state.socket = opts.socket ?? null;
  state.isServerMode = !!(opts.socket && opts.roomId);
}

// helper: screen -> world coords
export function screenToWorld(x: number, y: number) {
  return {
    x: (x - state.camera.offsetX) / state.camera.scale,
    y: (y - state.camera.offsetY) / state.camera.scale,
  };
}
