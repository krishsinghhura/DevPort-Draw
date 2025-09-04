"use client"
import { log } from "console";
import { useState,useEffect } from "react"

export function useSocket(roomId?:string){
    const [loading,setLoading]=useState(true);
    const [socket,setSocket]=useState<WebSocket>()

    useEffect(()=>{
        const ws=new WebSocket("ws://localhost:3002?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmMDIxYzhjOC04OTQ5LTRkNjktOTRjOC02MzViMjY0ZTFlNDgiLCJpYXQiOjE3NTcwMjA3MTN9.XbbWDzyzCUsMOyAh6ZxYmfjAtXWe4u7JJq7SPSusJhw");

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