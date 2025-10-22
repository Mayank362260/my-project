// server/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(bodyParser.json());

let messages = [];

// REST API endpoints
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.post("/api/messages", (req, res) => {
  const { user = "Anonymous", text } = req.body;
  if (!text) return res.status(400).json({ error: "Message text required" });
  const msg = { id: Date.now(), user, text, ts: new Date().toISOString() };
  messages.push(msg);
  io.emit("receive_message", msg); // broadcast to all clients
  res.status(201).json(msg);
});

// WebSocket logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.emit("history", messages); // send old messages

  socket.on("send_message", (data) => {
    const msg = { id: Date.now(), user: data.user || "Anonymous", text: data.text, ts: new Date().toISOString() };
    messages.push(msg);
    io.emit("receive_message", msg);
  });

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

// Start server
const PORT = 5000;
server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
