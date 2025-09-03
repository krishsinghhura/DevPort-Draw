// draw/clearCanvas.ts
import { Shape } from "./types";
import { drawArrow } from "./utils";
import { state } from "./state";

// Draws an infinite-looking grid
function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const step = 50; // grid spacing in world units
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 0.5;

  // Because we are in world coordinates, we can draw a repeating pattern
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

export function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  // Clear the whole screen
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Apply camera transform (pan + zoom)
  ctx.save();
  ctx.translate(state.camera.offsetX, state.camera.offsetY);
  ctx.scale(state.camera.scale, state.camera.scale);

  // Draw background grid (optional, looks infinite when panning/zooming)
  drawGrid(ctx, canvas.width, canvas.height);

  // Draw all shapes in world coordinates
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
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(shape.text, shape.x, shape.y);
        break;
    }
  });

  // Restore transform so UI overlays (like selection boxes) can be drawn later in screen coords
  ctx.restore();
}
