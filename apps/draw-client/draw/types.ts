"use client"
export type TextShape = {
  id: string;
  type: "text";
  x: number;
  y: number;
  text: string;
};

export type Point = { x: number; y: number };

type BaseShape = {
  id: string;
  type: "rect" | "circle" | "line" | "arrow" | "pencil" | "text";
};

export type RectShape = BaseShape & {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CircleShape = BaseShape & {
  type: "circle";
  centerX: number;
  centerY: number;
  radius: number;
};

export type LineShape = BaseShape & {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type ArrowShape = BaseShape & {
  type: "arrow";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type PencilShape = BaseShape & {
  type: "pencil";
  path: Point[];
};

export type Shape =
  | RectShape
  | CircleShape
  | LineShape
  | ArrowShape
  | PencilShape
  | TextShape;

export type Tool =
  | "rect"
  | "circle"
  | "line"
  | "arrow"
  | "pencil"
  | "eraser"
  | "select"
  | "text";
