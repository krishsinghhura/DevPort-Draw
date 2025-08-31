"use client"
import { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";


export default function Home() {
  const router=useRouter();

  const [roomId,setRoomId]=useState("");

  const joinRoom=()=>{
    router.push(`/room/${roomId}`);
  }
  return (
    <div className={styles.page}>
      <div >
        <input value={roomId} onChange={(e)=>{
        setRoomId(e.target.value);
      }} type="text" style={{
        padding:10
      }} placeholder="Enter Room id"/> 
      
      <button onClick={joinRoom} style={{
        padding:10,
        margin:10
      }}>Join Room</button>
      
      </div>
    </div>
  );
}
