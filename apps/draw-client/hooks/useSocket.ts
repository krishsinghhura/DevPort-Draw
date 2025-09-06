"use client"
import { log } from "console";
import { useState,useEffect } from "react"

export function useSocket(roomId?:string){
    const [loading,setLoading]=useState(true);
    const [socket,setSocket]=useState<WebSocket>()

    useEffect(()=>{
        const token=localStorage.getItem("token");
        const ws=new WebSocket(`ws://localhost:3002?token=${token}`);

        ws.onopen=()=>{
            console.log("Opening a connection");

            ws.send(JSON.stringify({
                type:"join-room",
                roomId
            }))

            setLoading(false);
            setSocket(ws);
            
        }
    },[roomId])

    return {
        socket,
        loading
    }
}