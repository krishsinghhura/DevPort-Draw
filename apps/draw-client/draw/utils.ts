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


function distanceToLine(x: number, y: number, x1: number, y1: number, x2: number, y2: number): number {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

export function isShapeNearPoint(shape: Shape, x: number, y: number): boolean {
  const tolerance = 10; // eraser size
  const eraserBox = { x: x - tolerance, y: y - tolerance, w: tolerance * 2, h: tolerance * 2 };

  const boxIntersects = (bx: number, by: number, bw: number, bh: number) =>
    !(eraserBox.x > bx + bw ||
      eraserBox.x + eraserBox.w < bx ||
      eraserBox.y > by + bh ||
      eraserBox.y + eraserBox.h < by);

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
    // Excalidraw actually erases segment by segment, 
    // but to mimic "bounded erase", just remove whole path if any point is inside eraser box
    return shape.path.some(
      (p) =>
        p.x >= eraserBox.x &&
        p.x <= eraserBox.x + eraserBox.w &&
        p.y >= eraserBox.y &&
        p.y <= eraserBox.y + eraserBox.h
    );
  }

  return false;
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}