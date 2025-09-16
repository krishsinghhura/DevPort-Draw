"use client";
import { useEffect, useState } from "react";
import { HTTP_BACKEND } from "@/config";

type Member = {
  id: string;
  name: string | null;
  email: string;
};

interface MembersPanelProps {
  roomId: string;
  isAdmin: boolean; 
}

export default function MembersPanel({ roomId, isAdmin }: MembersPanelProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const fetchMembers = async () => {
    setLoading(true);
    if (typeof window === 'undefined') return;
    const Token = localStorage.getItem("token");
    setToken(Token ?? "");
    try {
      const res = await fetch(`${HTTP_BACKEND}/get-members/${roomId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(Token ? { Authorization: `Bearer ${Token}` } : {}),
        },
      });
      const data: Member[] = await res.json();

      
      setMembers(data.slice(1));
    } catch (err) {
      console.error("Failed to fetch members", err);
    } finally {
      setLoading(false);
    }
  };

  const removeMember = (userIdToRemove: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== userIdToRemove));

    fetch(`${HTTP_BACKEND}/room/${roomId}/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ userIdToRemove }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          console.error("Remove failed:", error.message || "Failed to remove user");
          // ❌ Optionally restore if backend fails
          setMembers((prev) => [...prev, { id: userIdToRemove, name: "", email: "" }]);
        }
      })
      .catch((err) => {
        console.error("Error removing user:", err);
        setMembers((prev) => [...prev, { id: userIdToRemove, name: "", email: "" }]);
      });
  };

  useEffect(() => {
    if (open) fetchMembers();
  }, [open]);

  return (
    <div className="absolute top-4 left-4 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-3 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        {open ? "Close Members" : "Show Members"}
      </button>

      {/* Members list */}
      {open && (
        <div className="mt-2 w-64 max-h-80 overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-200 p-3">
          <h3 className="font-semibold text-gray-700 mb-2">Members</h3>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : members.length === 0 ? (
            <p className="text-sm text-gray-500">No members yet</p>
          ) : (
            <ul className="space-y-1">
              {members.map((m) => (
                <li
                  key={m.id}
                  className="flex items-center justify-between text-sm text-gray-800 px-2 py-1 rounded hover:bg-gray-100"
                >
                  <span>{m.name || m.email}</span>
                  {isAdmin && (
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                    >
                      🗑️
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
