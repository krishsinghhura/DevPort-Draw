"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { HTTP_BACKEND } from "@/config";

export default function JoinPage({ params }: { params: { roomId: string } }) {
  const router = useRouter();
  const { roomId } = params;

  useEffect(() => {
    const joinRoom = async () => {
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
