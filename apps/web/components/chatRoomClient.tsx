"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
  messages,
  id,
}: {
  messages: { message: string; userId?: number }[];
  id: string;
}) {
  const { socket, loading } = useSocket(id);
  const [chatMessages, setChatMessages] = useState(messages);
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    if (socket && !loading) {
      socket.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);

        if (parsedData.type === "chat") {
          console.log(parsedData);

          setChatMessages((c) => [
            ...c,
            { message: parsedData.message, userId: parsedData.userId },
          ]);
        }
      };
    }
  }, [socket, loading, id]);

  const SendMessage = async () => {
    if (!socket) {
      console.log("not connected");
      return;
    }
    socket.send(
      JSON.stringify({
        type: "chat",
        roomId: id,
        message: currentMessage,
      })
    );

    setCurrentMessage("");
  };

  return (
    <div>
      <h2>Chat Room {id}</h2>
      <ul>
        {chatMessages.map((msg, idx) => (
          <li key={idx}>
            <b>{msg.userId ?? "Anon"}:</b> {msg.message}
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Type your text here"
        value={currentMessage}
        onChange={(e) => {
          setCurrentMessage(e.target.value);
        }}
        style={{
          padding: 10,
          margin: 10,
        }}
      />

      <button
        style={{
          padding: 10,
          margin: 10,
        }}
        onClick={SendMessage}
      >
        Send Message
      </button>
    </div>
  );
}
