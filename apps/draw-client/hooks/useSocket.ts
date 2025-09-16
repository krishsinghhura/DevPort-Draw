"use client"
import { useState,useEffect } from "react"
import { WS_BACKEND } from "@/config";

export function useSocket(roomId?:string){
    const [loading,setLoading]=useState(true);
    const [socket,setSocket]=useState<WebSocket>()

    useEffect(()=>{
        const token=localStorage.getItem("token");
        const ws=new WebSocket(`${WS_BACKEND}?token=${token}`);

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