// draw/state.ts
import type { Shape, Tool, Point } from "./types";

export type ChatMessage = {
  id?: string; // optional if server generates it
  userId: string;
  roomId: string;
  message: any; // could be string or parsed object (e.g. text shape)
};

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

  // 🔹 chats
  chats: [] as ChatMessage[],

  // environment
  getTool: null as (() => Tool) | null,
  roomId: null as string | null,
  socket: null as WebSocket | null,
  isServerMode: false,

  // 🔹 style
  selectedColor: "white", // default stroke color

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
  roomId?: string | null;
  socket?: WebSocket | null;
}) {
  state.canvas = opts.canvas;
  state.ctx = opts.ctx;
  state.getTool = opts.getTool;
  state.roomId = opts.roomId ?? null;
  state.socket = opts.socket ?? null;
  state.isServerMode = !!(opts.socket && opts.roomId);

  // reset chats whenever we switch environment
  state.chats = [];
}

// helper: screen -> world coords
export function screenToWorld(x: number, y: number) {
  return {
    x: (x - state.camera.offsetX) / state.camera.scale,
    y: (y - state.camera.offsetY) / state.camera.scale,
  };
}
