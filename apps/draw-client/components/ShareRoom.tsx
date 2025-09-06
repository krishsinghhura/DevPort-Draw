"use client";
import { useState } from "react";
import { HTTP_BACKEND } from "@/config";

interface ShareRoomProps {
  roomId: string;
  isAdmin: boolean;
}

export default function ShareRoom({ roomId, isAdmin }: ShareRoomProps) {
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const makePublic = async () => {
    if (!isAdmin) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${HTTP_BACKEND}/room/${roomId}/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to make room public");
      }

      const publicLink = `${window.location.origin}/join/${roomId}`;
      setLink(publicLink);
      setOpen(true);
    } catch (err) {
      console.error("Error making room public:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    alert("Copied link to clipboard!");
  };

  if (!isAdmin) return null;

  return (
    <>
      <button
        onClick={makePublic}
        disabled={loading}
        className="px-3 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
      >
        {loading ? "Generating..." : "Share Room"}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background blur */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal content */}
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-96 z-10">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Share this room
            </h2>
            <p className="text-sm text-gray-600 mb-3">
              Anyone with this link can join within 24 hours:
            </p>
            <div className="flex items-center justify-between border rounded-lg px-3 py-2 bg-gray-50">
              <span className="truncate text-sm text-gray-800">{link}</span>
              <button
                onClick={copyToClipboard}
                className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
              >
                Copy
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
