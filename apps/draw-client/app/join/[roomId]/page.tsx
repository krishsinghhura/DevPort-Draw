"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { HTTP_BACKEND } from "@/config";

export default function JoinPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  useEffect(() => {
    const joinRoom = async () => {
      if (typeof window === 'undefined') return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${HTTP_BACKEND}/room/${roomId}/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.message || "Failed to join");
          return;
        }

        router.push(`/canvas/${roomId}`);
      } catch (err) {
        console.error("Error joining room:", err);
      }
    };

    joinRoom();
  }, [roomId, router]);

  return (
    <div className="h-screen flex items-center justify-center text-lg">
      Joining room...
    </div>
  );
}