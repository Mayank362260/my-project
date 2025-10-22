import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function ChatSocket() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState("You");

  useEffect(() => {
    socket.on("history", (data) => setMessages(data));
    socket.on("receive_message", (data) => setMessages((prev) => [...prev, data]));
    return () => {
      socket.off("history");
      socket.off("receive_message");
    };
  }, []);

  const send = () => {
    if (!text.trim()) return;
    socket.emit("send_message", { user, text });
    setText("");
  };

  return (
    <div style={{ border: "1px solid gray", padding: 20, borderRadius: 10 }}>
      <h3>ChatSocket (Realtime)</h3>
      <div style={{ height: 150, overflowY: "auto", background: "#f9f9f9", marginBottom: 10, padding: 10 }}>
        {messages.map((m) => (
          <div key={m.id}>
            <b>{m.user}:</b> {m.text}
          </div>
        ))}
      </div>
      <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Name" style={{ marginRight: 5 }} />
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type..." />
      <button onClick={send}>Send</button>
    </div>
  );
}
