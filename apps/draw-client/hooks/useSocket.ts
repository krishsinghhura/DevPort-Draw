"use client"
import { log } from "console";
import { useState,useEffect } from "react"

export function useSocket(roomId?:string){
    const [loading,setLoading]=useState(true);
    const [socket,setSocket]=useState<WebSocket>()

    useEffect(()=>{
        const ws=new WebSocket("ws://localhost:3002?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc1NjkzNDU0MX0.FGczlbOTz6jAfDTk76AAu-c-zNjJ750upFFGFggEWZA");

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