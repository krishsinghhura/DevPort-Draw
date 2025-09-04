import { Roomcanvas as CanvasComponent } from "@/components/RoomCanvas";

export default async function CanvasPage({params}:{
  params:{
    roomId:string
  } 
}){
  const roomId=(await params).roomId;
  return <CanvasComponent roomId={roomId} />;
}