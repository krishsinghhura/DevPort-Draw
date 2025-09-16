"use client";

import Roomcanvas from "@/components/RoomCanvas";
import { useEffect, useState } from "react";

interface CanvasPageProps {
  params: Promise<{ roomId: string }>;
}

export default function CanvasPage({ params }: CanvasPageProps) {
  const [roomId, setRoomId] = useState<string>("");

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setRoomId(resolvedParams.roomId);
    }
    getParams();
  }, [params]);

  if (!roomId) {
    return <div>Loading...</div>;
  }

  return <Roomcanvas roomId={roomId} />;
}