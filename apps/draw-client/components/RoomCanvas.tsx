"use client";
import type { Tool } from "@/draw/types";
import { useSocket } from "@/hooks/useSocket";
import Canvas from "./Canvas";
import Toolbar from "./Toolbar";
import DevPortDrawLoader from "../components/ui/loader";
import MembersPanel from "./MembersPanel";
import { useState } from "react";
import ShareRoom from "../components/ShareRoom";
import GeminiPrompt from "./GeminiPrompt";

export default function Roomcanvas({ roomId }: { roomId: string }) {
  const { socket, loading } = useSocket(roomId);
  const [tool, setTool] = useState<Tool>("select"); 

  if (loading || !socket) {
    return (
      <div className="h-screen">
        <DevPortDrawLoader message="Connecting to server…" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
 
  <div className="fixed top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-50">
    <Toolbar onSelect={setTool} activeTool={tool} />
    <GeminiPrompt roomId={roomId} />
  </div>

 
  <Canvas key={roomId} roomId={roomId} socket={socket} tool={tool} />

 
  <MembersPanel roomId={roomId} isAdmin={true} />

 
  <div className="fixed top-4 right-4 z-50">
    <ShareRoom roomId={roomId} isAdmin={true} />
  </div>
</div>

  );
}
