"use client"
import { Roomcanvas as CanvasComponent } from "@/components/RoomCanvas";

export default  function CanvasPage({params}:{
  params:{
    roomId:string
  } 
}){
  const roomId=params.roomId;
  return <CanvasComponent roomId={roomId} />;
}