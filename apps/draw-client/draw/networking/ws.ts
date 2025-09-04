// draw/networking/setupWS.ts
import type { Shape } from "../types";
import { state } from "../state";
import { clearCanvas } from "../clearCanvas";

// 🔹 Merge updates instead of replacing to preserve existing properties
function upsertShape(shapes: Shape[], updated: Shape) {
  const idx = shapes.findIndex((s) => s.id === updated.id);
  if (idx !== -1) {
    shapes[idx] = { ...shapes[idx], ...updated };
  } else {
    shapes.push(updated);
  }
}

export function setupWS() {
  if (!state.socket || !state.roomId || !state.ctx || !state.canvas) return;

  state.socket.onopen = () => {
    state.socket!.send(
      JSON.stringify({ type: "join-room", roomId: state.roomId })
    );
  };

  state.socket.onmessage = (event) => {
    let message;
    try {
      message = JSON.parse(event.data);
    } catch (err) {
      console.error("Invalid WS message:", event.data, err);
      return;
    }

    const handleShapeUpdate = (shape: Shape) => {
      upsertShape(state.shapes, shape);
      clearCanvas(state.shapes, state.canvas!, state.ctx!);
    };

    switch (message.type) {
      case "init-history":
        state.shapes = [];
        message.events.forEach((e: any) => {
          let parsed: any;
          try {
            parsed =
              typeof e === "string"
                ? JSON.parse(e)
                : e.message
                ? JSON.parse(e.message)
                : e;

            if (["draw", "move", "update", "resize"].includes(parsed.type)) {
              handleShapeUpdate(parsed.shape);
            }

            if (parsed.type === "erase") {
              state.shapes = state.shapes.filter(
                (s) => !parsed.ids.includes(s.id)
              );
              clearCanvas(state.shapes, state.canvas!, state.ctx!);
            }
          } catch (err) {
            console.error("Failed to parse history event:", e, err);
          }
        });
        break;

      case "init-shapes":
        state.shapes = message.shapes as Shape[];
        clearCanvas(state.shapes, state.canvas!, state.ctx!);
        break;

      case "draw":
      case "move":
      case "update":
      case "resize":
        handleShapeUpdate(message.shape as Shape);
        break;

      case "erase":
        state.shapes = state.shapes.filter((s) => !message.ids.includes(s.id));
        clearCanvas(state.shapes, state.canvas!, state.ctx!);
        break;
    }
  };
}

// 🔹 Event senders
export function wsDraw(shape: Shape) {
  if (!state.isServerMode) return;
  state.socket!.send(
    JSON.stringify({ type: "draw", shape, roomId: state.roomId })
  );
}

export function wsErase(ids: string[]) {
  if (!state.isServerMode) return;
  state.socket!.send(
    JSON.stringify({ type: "erase", ids, roomId: state.roomId })
  );
}

export function wsMove(shape: Shape) {
  if (!state.isServerMode) return;
  state.socket!.send(
    JSON.stringify({ type: "move", shape, roomId: state.roomId })
  );
}

export function wsUpdate(shape: Shape) {
  if (!state.isServerMode) return;
  state.socket!.send(
    JSON.stringify({ type: "update", shape, roomId: state.roomId })
  );
}

export function wsResize(shape: Shape) {
  if (!state.isServerMode) return;
  state.socket!.send(
    JSON.stringify({ type: "resize", shape, roomId: state.roomId })
  );
}
