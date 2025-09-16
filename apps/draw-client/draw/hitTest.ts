"use client"
import { Shape } from "./types";

export function hitTest(shape: Shape, x: number, y: number): boolean {
  switch (shape.type) {
    case "rect":
      return (
        x >= shape.x &&
        x <= shape.x + shape.width &&
        y >= shape.y &&
        y <= shape.y + shape.height
      );

    case "circle": {
      const dx = x - shape.centerX;
      const dy = y - shape.centerY;
      return Math.sqrt(dx * dx + dy * dy) <= shape.radius;
    }

    case "line":
    case "arrow": {
      // Distance from point to line segment
      const A = x - shape.x1;
      const B = y - shape.y1;
      const C = shape.x2 - shape.x1;
      const D = shape.y2 - shape.y1;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = -1;
      if (lenSq !== 0) param = dot / lenSq;

      let xx, yy;
      if (param < 0) {
        xx = shape.x1;
        yy = shape.y1;
      } else if (param > 1) {
        xx = shape.x2;
        yy = shape.y2;
      } else {
        xx = shape.x1 + param * C;
        yy = shape.y1 + param * D;
      }

      const dx = x - xx;
      const dy = y - yy;
      return Math.sqrt(dx * dx + dy * dy) <= 5; // tolerance
    }

    case "pencil":
      return shape.path.some(
        (p) => Math.hypot(p.x - x, p.y - y) < 5
      );

    case "text":
      // Approx bounding box: width = charCount * 8px, height = 16px
      const approxWidth = shape.text.length * 8;
      const approxHeight = 16;
      return (
        x >= shape.x &&
        x <= shape.x + approxWidth &&
        y >= shape.y - approxHeight &&
        y <= shape.y
      );

    default:
      return false;
  }
}
