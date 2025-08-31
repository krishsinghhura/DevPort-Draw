"use client"
import {useState,useEffect} from "react";
export function useSocket(roomId?:string){
    const [loading,setLoading]=useState(true);
    const [socket,setSocket]=useState<WebSocket>();

    useEffect(()=>{
        const ws =new WebSocket("ws://localhost:3002?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1NjE0NDUxMX0.yXRNkJIoYZVmfMn5h7tfMbyIJhJqYHZu4_GSU_FgkFI");
        ws.onopen=()=>{
            console.log("opening connection");
        
        ws.send(JSON.stringify({
          type:"join-room",
          roomId
        }))
            setLoading(false);
            setSocket(ws)
        }
    },[])

    return {
        socket,loading
    }
}