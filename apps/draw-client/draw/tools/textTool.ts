"use client"
import { Shape, Tool } from "../types";
import { clearCanvas } from "../clearCanvas";
import { getShapeAtPosition } from "../textUtils";

// helper uid
function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ✅ safe remove so removeChild never throws
function safeRemoveInput(input: HTMLInputElement) {
  if (input && input.parentNode) {
    try {
      input.parentNode.removeChild(input);
    } catch {
      // ignore race condition
    }
  }
}

/**
 * Handles text adding/editing on double-click when tool = "select"
 */
export function handleTextDblClick(
  e: MouseEvent,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  roomId: string | null,
  socket: WebSocket | null,
  existingShapes: Shape[],
  getTool: () => Tool
) {
  if (getTool() !== "select") return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const targetShape = getShapeAtPosition(existingShapes, x, y);

  const saveGuest = () => {
    if (typeof window === 'undefined') return;
    localStorage.setItem("guest-canvas", JSON.stringify(existingShapes));
  };

  const sendShape = (shape: Shape, isNew: boolean) => {
    if (socket && roomId) {
      socket.send(
        JSON.stringify({
          type: isNew ? "draw" : "update",
          shape,
          roomId,
        })
      );
    } else {
      // Guest mode → overwrite unified storage
      saveGuest();
    }
  };

  // --- Case 1: editing existing text ---
  if (targetShape && targetShape.type === "text") {
    const input = createInput(e.clientX, e.clientY, targetShape.text);
    let finalized = false;

    const finalizeEdit = () => {
      if (finalized) return;
      finalized = true;

      targetShape.text = input.value.trim();
      safeRemoveInput(input);

      sendShape(targetShape, false);
      clearCanvas(existingShapes, canvas, ctx);
      cleanup();
    };

    const handleKey = (ev: KeyboardEvent) => {
      if (ev.key === "Enter") finalizeEdit();
    };
    const handleBlur = () => setTimeout(finalizeEdit, 0);
    const cleanup = () => {
      input.removeEventListener("blur", handleBlur);
      input.removeEventListener("keydown", handleKey);
    };

    input.addEventListener("blur", handleBlur);
    input.addEventListener("keydown", handleKey);
    return;
  }

  // --- Case 2: empty space → create new text ---
  const input = createInput(e.clientX, e.clientY);
  let finalized = false;

  const finalizeNew = () => {
    if (finalized) return;
    finalized = true;

    const shape: Shape = {
      id: uid(),
      type: "text",
      x,
      y,
      text: input.value.trim(),
    };
    safeRemoveInput(input);

    if (shape.text) {
      existingShapes.push(shape);
      sendShape(shape, true);
      clearCanvas(existingShapes, canvas, ctx);
    }
    cleanup();
  };

  const handleKey = (ev: KeyboardEvent) => {
    if (ev.key === "Enter") finalizeNew();
  };
  const handleBlur = () => setTimeout(finalizeNew, 0);
  const cleanup = () => {
    input.removeEventListener("blur", handleBlur);
    input.removeEventListener("keydown", handleKey);
  };

  input.addEventListener("blur", handleBlur);
  input.addEventListener("keydown", handleKey);
}

// --- helper to create overlay input ---
function createInput(
  clientX: number,
  clientY: number,
  value = ""
): HTMLInputElement {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.style.position = "absolute";
  input.style.left = `${clientX}px`;
  input.style.top = `${clientY}px`;
  input.style.font = "20px Arial";
  input.style.background = "transparent";
  input.style.color = "white";
  input.style.border = "1px solid white";
  input.style.outline = "none";
  input.style.zIndex = "9999"; // keep it on top

  document.body.appendChild(input);
  input.focus();
  return input;
}
