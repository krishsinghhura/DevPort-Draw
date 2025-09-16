"use client"
import { Shape } from "./types";

// helper: draw arrow
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  const headlen = 10; // length of arrowhead lines
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);

  ctx.beginPath();
  // main line
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);

  // left head
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headlen * Math.cos(angle - Math.PI / 6),
    y2 - headlen * Math.sin(angle - Math.PI / 6)
  );

  // right head
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headlen * Math.cos(angle + Math.PI / 6),
    y2 - headlen * Math.sin(angle + Math.PI / 6)
  );

  ctx.stroke();
}

export function isShapeNearPoint(shape: Shape, x: number, y: number): boolean {
  const tolerance = 10; // eraser size
  const eraserBox = { x: x - tolerance, y: y - tolerance, w: tolerance * 2, h: tolerance * 2 };

  const boxIntersects = (bx: number, by: number, bw: number, bh: number) =>
    !(
      eraserBox.x > bx + bw ||
      eraserBox.x + eraserBox.w < bx ||
      eraserBox.y > by + bh ||
      eraserBox.y + eraserBox.h < by
    );

  if (shape.type === "rect") {
    return boxIntersects(shape.x, shape.y, shape.width, shape.height);
  }

  if (shape.type === "circle") {
    return boxIntersects(
      shape.centerX - shape.radius,
      shape.centerY - shape.radius,
      shape.radius * 2,
      shape.radius * 2
    );
  }

  if (shape.type === "line" || shape.type === "arrow") {
    const minX = Math.min(shape.x1, shape.x2);
    const minY = Math.min(shape.y1, shape.y2);
    const w = Math.abs(shape.x2 - shape.x1);
    const h = Math.abs(shape.y2 - shape.y1);
    return boxIntersects(minX, minY, w, h);
  }

  if (shape.type === "pencil") {
    // erase entire path if any point is inside eraser box
    return shape.path.some(
      (p) =>
        p.x >= eraserBox.x &&
        p.x <= eraserBox.x + eraserBox.w &&
        p.y >= eraserBox.y &&
        p.y <= eraserBox.y + eraserBox.h
    );
  }

  if (shape.type === "text") {
    // Approximate bounding box for text (since you draw with 20px Arial)
    const fontSize = 20;
    const textWidth = shape.text.length * fontSize * 0.6; // rough estimate
    const textHeight = fontSize;
    return boxIntersects(shape.x, shape.y, textWidth, textHeight);
  }

  return false;
}


export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}