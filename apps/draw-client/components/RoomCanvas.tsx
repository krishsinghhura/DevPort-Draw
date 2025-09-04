"use client"
import type { Tool } from "@/draw/types"; // central Tool type
import { useSocket } from "@/hooks/useSocket";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import DevPortDrawLoader from "../components/ui/loader";
import { useState } from "react";

export function Roomcanvas({ roomId }: { roomId: number }) {
  const { socket, loading } = useSocket(roomId);
  const [tool, setTool] = useState<Tool>("select"); // use central type

  if (loading || !socket) {
    return (
      <div className="h-screen">
        <DevPortDrawLoader message="Connecting to server…" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <Toolbar onSelect={setTool} activeTool={tool} />

      {/* key forces a clean remount if roomId changes, preventing listener leaks */}
      <Canvas key={roomId} roomId={roomId} socket={socket} tool={tool} />
    </div>
  );
}
