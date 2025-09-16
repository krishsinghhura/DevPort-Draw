"use client"
import { Shape } from "./types";
import { drawArrow } from "./utils";
import { state } from "./state";

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const step = 50;
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 0.5;

  const startX = -width;
  const endX = width * 2;
  const startY = -height;
  const endY = height * 2;

  for (let x = startX; x <= endX; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, startY);
    ctx.lineTo(x, endY);
    ctx.stroke();
  }

  for (let y = startY; y <= endY; y += step) {
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
    ctx.stroke();
  }
}

function drawHandles(ctx: CanvasRenderingContext2D, shape: Shape) {
  const handles: { x: number; y: number }[] = [];

  if (shape.type === "rect") {
    handles.push(
      { x: shape.x, y: shape.y },
      { x: shape.x + shape.width, y: shape.y },
      { x: shape.x, y: shape.y + shape.height },
      { x: shape.x + shape.width, y: shape.y + shape.height }
    );
  } else if (shape.type === "circle") {
    handles.push(
      { x: shape.centerX + shape.radius, y: shape.centerY },
      { x: shape.centerX - shape.radius, y: shape.centerY },
      { x: shape.centerX, y: shape.centerY + shape.radius },
      { x: shape.centerX, y: shape.centerY - shape.radius }
    );
  } else if (shape.type === "line" || shape.type === "arrow") {
    handles.push(
      { x: shape.x1, y: shape.y1 },
      { x: shape.x2, y: shape.y2 }
    );
  }

  ctx.fillStyle = "red";
  handles.forEach((h) => {
    ctx.fillRect(h.x - 4, h.y - 4, 8, 8);
  });
}

export function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(state.camera.offsetX, state.camera.offsetY);
  ctx.scale(state.camera.scale, state.camera.scale);

  drawGrid(ctx, canvas.width, canvas.height);

  existingShapes.forEach((shape) => {
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";

    switch (shape.type) {
      case "rect":
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;

      case "circle":
        ctx.beginPath();
        ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case "line":
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
        break;

      case "arrow":
        drawArrow(ctx, shape.x1, shape.y1, shape.x2, shape.y2);
        break;

      case "pencil":
        if (shape.path.length > 1) {
          ctx.beginPath();
          ctx.moveTo(shape.path[0].x, shape.path[0].y);
          shape.path.forEach((p) => ctx.lineTo(p.x, p.y));
          ctx.stroke();
        }
        break;

      case "text":
        console.log("📝 Drawing text shape:", shape);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.textBaseline = "top"; 
        ctx.fillText(shape.text, shape.x, shape.y);
        break;
    }

    
    if (state.selectedShape && state.selectedShape.id === shape.id) {
      drawHandles(ctx, shape);
    }
  });

  ctx.restore();
}
