// draw/networking/ws.ts
import type { Shape } from "../types";
import { state } from "../state";
import { clearCanvas } from "../clearCanvas";

export function setupWS() {
  if (!state.socket || !state.roomId || !state.ctx || !state.canvas) return;

  state.socket.onopen = () => {
    state.socket!.send(JSON.stringify({ type: "join-room", roomId: state.roomId }));
  };

  state.socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    // 🔹 Replay history when joining
    if (message.type === "init-history") {
      const shapes: Shape[] = [];

      message.events.forEach((e: any) => {
        try {
          const parsed = JSON.parse(e.message);

          if (parsed.type === "draw") {
            shapes.push(parsed.shape);
          }

          if (parsed.type === "erase") {
            for (const id of parsed.ids) {
              const idx = shapes.findIndex((s) => s.id === id);
              if (idx !== -1) shapes.splice(idx, 1);
            }
          }

          if (parsed.type === "move") {
            const moved = parsed.shape;
            const idx = shapes.findIndex((s) => s.id === moved.id);
            if (idx !== -1) shapes[idx] = moved;
          }
        } catch (err) {
          console.error("Failed to parse history event:", e, err);
        }
      });

      state.shapes = shapes;
      clearCanvas(state.shapes, state.canvas!, state.ctx!);
    }

    // 🔹 Live updates
    if (message.type === "init-shapes") {
      state.shapes = message.shapes as Shape[];
      clearCanvas(state.shapes, state.canvas!, state.ctx!);
    }

    if (message.type === "draw") {
      state.shapes.push(message.shape as Shape);
      clearCanvas(state.shapes, state.canvas!, state.ctx!);
    }

    if (message.type === "erase") {
      const erasedIds: string[] = message.ids;
      state.shapes = state.shapes.filter((s) => !erasedIds.includes(s.id));
      clearCanvas(state.shapes, state.canvas!, state.ctx!);
    }

    if (message.type === "move") {
      const moved: Shape = message.shape;
      const idx = state.shapes.findIndex((s) => s.id === moved.id);
      if (idx !== -1) state.shapes[idx] = moved;
      clearCanvas(state.shapes, state.canvas!, state.ctx!);
    }
  };
}

export function wsDraw(shape: Shape) {
  if (!state.isServerMode) return;
  state.socket!.send(JSON.stringify({ type: "draw", shape, roomId: state.roomId }));
}

export function wsErase(ids: string[]) {
  if (!state.isServerMode) return;
  state.socket!.send(JSON.stringify({ type: "erase", ids, roomId: state.roomId }));
}

export function wsMove(shape: Shape) {
  if (!state.isServerMode) return;
  state.socket!.send(JSON.stringify({ type: "move", shape, roomId: state.roomId }));
}
