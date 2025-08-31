import axios from "axios";
import { BACKEND_URL } from "../../config";
import { ChatRoomClient } from "../../../components/chatRoomClient";

async function getChat(slug:string){
    const response=await axios.get(`${BACKEND_URL}/room/${slug}`);
    return response;
}

export default async function Room({
    params
}:{
    params:{
        slug:string
    }
}){
    const slug=(await params).slug;

    const chats=await getChat(slug);

    return (
    <div>
      <h1>Room: {slug}</h1>
      <ChatRoomClient messages={chats.data} id={slug} />
    </div>
  );
}