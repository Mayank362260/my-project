import React, { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../services/api";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState("You");

  useEffect(() => {
    getMessages().then((res) => setMessages(res.data));
  }, []);

  const handleSend = async () => {
    if (!text.trim()) return;
    await sendMessage({ user, text });
    setText("");
  };

  return (
    <div style={{ border: "1px solid gray", padding: 20, borderRadius: 10 }}>
      <h3>ChatBox (Axios)</h3>
      <div style={{ height: 150, overflowY: "auto", background: "#f9f9f9", marginBottom: 10, padding: 10 }}>
        {messages.map((m) => (
          <div key={m.id}>
            <b>{m.user}:</b> {m.text}
          </div>
        ))}
      </div>
      <input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Name" style={{ marginRight: 5 }} />
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type message..." />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
