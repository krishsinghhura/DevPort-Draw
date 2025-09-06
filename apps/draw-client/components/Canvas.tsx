"use client";
import { useEffect, useRef } from "react";
import { initDraw } from "@/draw/index";
import type { Tool } from "@/draw/types";

export default function Canvas({
  roomId,
  socket,
  tool,
}: {
  roomId: string;
  socket: WebSocket;
  tool: Tool;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  
  const toolRef = useRef<Tool>(tool);
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    
    const getTool = () => toolRef.current;
    initDraw(canvas, getTool, roomId, socket);

    
  }, [roomId, socket]);

  return (
    <canvas
      ref={canvasRef}
      className="block bg-black"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
