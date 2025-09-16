"use client";

import { useState } from "react";
import { state } from "@/draw/state";
import { clearCanvas } from "@/draw/clearCanvas";
import type { Shape } from "@/draw/types";
import { HTTP_BACKEND } from "@/config";

export default function GeminiPrompt({ roomId }: { roomId: string }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  function upsertShape(shapes: Shape[], updated: Shape) {
    const idx = shapes.findIndex((s) => s.id === updated.id);
    if (idx !== -1) {
      shapes[idx] = { ...shapes[idx], ...updated };
    } else {
      shapes.push(updated);
    }
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${HTTP_BACKEND}/generate-diagram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ prompt, roomId }),
      });

      const data = await res.json();

      if (
        data.type === "init-history" &&
        Array.isArray(data.events) &&
        state.canvas &&
        state.ctx
      ) {
        data.events.forEach((event: any) => {
          if (
            ["draw", "move", "update", "resize"].includes(event.type) &&
            event.shape
          ) {
            upsertShape(state.shapes, event.shape);
          } else if (event.type === "erase" && Array.isArray(event.ids)) {
            state.shapes = state.shapes.filter(
              (s) => !event.ids.includes(s.id)
            );
          }
        });

        clearCanvas(state.shapes, state.canvas, state.ctx);
      }
    } catch (err) {
      console.error("❌ Error generating diagram:", err);
    } finally {
      setLoading(false);
      setOpen(false);
      setPrompt("");
    }
  };

  if (!open) {
    return (
      <button
        className="ml-4 flex items-center gap-1 rounded-md px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-medium shadow hover:opacity-90 transition"
        onClick={() => setOpen(true)}
      >
        <span className="text-lg">✨</span>
        <span>AI</span>
      </button>
    );
  }

  return (
    <div className="ml-4 flex flex-col gap-2 p-3 bg-white shadow-lg rounded-xl w-64 border border-gray-200">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask AI to generate a diagram..."
        className="w-full h-24 p-2 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setOpen(false)}
          disabled={loading}
          className="px-3 py-1 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-700 text-sm disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}
