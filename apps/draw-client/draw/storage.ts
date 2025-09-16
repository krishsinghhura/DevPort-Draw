"use client"
import type { Shape } from "./types";

export function loadGuest(): Shape[] {
  const saved = localStorage.getItem("guest-canvas");
  if (!saved) return [];
  const parsed: Shape[] = JSON.parse(saved);
  return parsed.filter((s) => {
    if (s.type === "rect") return s.width > 0 && s.height > 0;
    if (s.type === "circle") return s.radius > 0;
    return true;
  });
}

export function saveGuest(shapes: Shape[]) {
  localStorage.setItem("guest-canvas", JSON.stringify(shapes));
}
