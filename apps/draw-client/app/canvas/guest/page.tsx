"use client";

import { useRef, useEffect, useState } from "react";
import { initDraw } from "@/draw/index";
import type { Tool } from "@/draw/types";
import Toolbar from "@/components/Toolbar";

export default function GuestCanvasPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ✅ Use state instead of ref
  const [activeTool, setActiveTool] = useState<Tool>("select");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // ✅ Always return the current tool from state
    const getTool = () => activeTool;

    initDraw(canvas, getTool);
  }, [activeTool]); // re-run initDraw if tool changes

  return (
    <>
      <Toolbar
        activeTool={activeTool}
        onSelect={(t) => setActiveTool(t)} // ✅ updates state -> UI re-renders
      />
      <canvas
        ref={canvasRef}
        className="block bg-black"
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
}
