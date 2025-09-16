"use client";

import React from "react";
import { Roomcanvas as CanvasComponent } from "@/components/RoomCanvas";

export default function CanvasPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = React.use(params);

  return <CanvasComponent roomId={roomId} />;
}
