"use client";
import { JSX } from "react";
import {
  Square,
  Circle,
  MousePointer,
  Pencil,
  Eraser,
  ArrowRight,
  Minus,
} from "lucide-react";
import type { Tool } from "@/draw/types"; // central type

interface ToolbarProps {
  onSelect: (tool: Tool) => void;
  activeTool: Tool;
}

export default function Toolbar({ onSelect, activeTool }: ToolbarProps) {
  const tools: { type: Tool; icon: JSX.Element; label: string }[] = [
    { type: "select", icon: <MousePointer size={18} />, label: "Select" },
    { type: "rect", icon: <Square size={18} />, label: "Rectangle" },
    { type: "circle", icon: <Circle size={18} />, label: "Circle" },
    { type: "arrow", icon: <ArrowRight size={18} />, label: "Arrow" },
    { type: "line", icon: <Minus size={18} />, label: "Line" },
    { type: "pencil", icon: <Pencil size={18} />, label: "Pencil" },
    { type: "eraser", icon: <Eraser size={18} />, label: "Eraser" },
    // "text" can also be added here if you want a button for it
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 flex bg-white/90 backdrop-blur-md shadow-md rounded-2xl px-3 py-2 gap-2 z-50">
      {tools.map(({ type, icon, label }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={`flex items-center justify-center p-2 rounded-xl transition ${
            activeTool === type
              ? "bg-blue-500 text-white shadow-md"
              : "hover:bg-gray-200 text-gray-700"
          }`}
          title={label}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
