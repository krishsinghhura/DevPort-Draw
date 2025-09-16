"use client"
import { Shape } from "./types";

export function getShapeAtPosition(
  shapes: Shape[],
  x: number,
  y: number
): Shape | null {
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];
    switch (shape.type) {
      case "rect":
        if (
          x >= shape.x &&
          x <= shape.x + shape.width &&
          y >= shape.y &&
          y <= shape.y + shape.height
        ) {
          return shape;
        }
        break;

      case "circle":
        const dx = x - shape.centerX;
        const dy = y - shape.centerY;
        if (dx * dx + dy * dy <= shape.radius * shape.radius) {
          return shape;
        }
        break;

      case "line":
      case "arrow": {
        const distToLine =
          Math.abs(
            (shape.y2 - shape.y1) * x -
              (shape.x2 - shape.x1) * y +
              shape.x2 * shape.y1 -
              shape.y2 * shape.x1
          ) /
          Math.hypot(shape.x2 - shape.x1, shape.y2 - shape.y1);
        if (distToLine < 5) return shape; // 5px tolerance
        break;
      }

      case "pencil":
        for (let j = 0; j < shape.path.length - 1; j++) {
          const p1 = shape.path[j];
          const p2 = shape.path[j + 1];
          const dist =
            Math.abs((p2.y - p1.y) * x - (p2.x - p1.x) * y + p2.x * p1.y - p2.y * p1.x) /
            Math.hypot(p2.x - p1.x, p2.y - p1.y);
          if (dist < 5) return shape;
        }
        break;

      case "text":
        // simple bounding box hit detection
        const approxWidth = shape.text.length * 10; // crude text width estimate
        const approxHeight = 20;
        if (
          x >= shape.x &&
          x <= shape.x + approxWidth &&
          y >= shape.y - approxHeight &&
          y <= shape.y
        ) {
          return shape;
        }
        break;
    }
  }

  return null;
}
