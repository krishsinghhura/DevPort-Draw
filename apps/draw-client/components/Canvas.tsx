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

  // keep the latest tool without re-running initDraw
  const toolRef = useRef<Tool>(tool);
  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // size once on mount
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // IMPORTANT: init once per room/socket; it will pull tool via the getter
    const getTool = () => toolRef.current;
    initDraw(canvas, getTool, roomId, socket);

    // no cleanup because initDraw owns event listeners for this canvas instance

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, socket]); // don't depend on `tool` — we read it from toolRef

  return (
    <canvas
      ref={canvasRef}
      className="block bg-black"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
