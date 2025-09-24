const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let seats = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  status: "available",
  lockedBy: null,
  lockTimeout: null
}));

app.get("/", (req, res) => {
  res.send("🎟️ Welcome to the Ticket Booking API! Use /seats to view seats.");
});

app.get("/seats", (req, res) => {
  res.json(seats);
});

app.post("/lock/:id", (req, res) => {
  const seatId = parseInt(req.params.id);
  const user = req.body.user || "guest";
  const seat = seats.find(s => s.id === seatId);

  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }
  if (seat.status === "booked") {
    return res.status(400).json({ message: "Seat already booked" });
  }
  if (seat.status === "locked") {
    return res.status(400).json({ message: "Seat already locked" });
  }

  seat.status = "locked";
  seat.lockedBy = user;

  seat.lockTimeout = setTimeout(() => {
    seat.status = "available";
    seat.lockedBy = null;
    seat.lockTimeout = null;
  }, 10000);

  res.json({ message: `Seat ${seatId} locked for ${user}. Confirm within 10 seconds.` });
});

app.post("/confirm/:id", (req, res) => {
  const seatId = parseInt(req.params.id);
  const user = req.body.user || "guest";
  const seat = seats.find(s => s.id === seatId);

  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }
  if (seat.status !== "locked" || seat.lockedBy !== user) {
    return res.status(400).json({ message: "Seat not locked by you" });
  }

  clearTimeout(seat.lockTimeout);
  seat.status = "booked";
  seat.lockedBy = user;
  seat.lockTimeout = null;

  res.json({ message: `Seat ${seatId} successfully booked by ${user}` });
});

app.post("/release/:id", (req, res) => {
  const seatId = parseInt(req.params.id);
  const user = req.body.user || "guest";
  const seat = seats.find(s => s.id === seatId);

  if (!seat) {
    return res.status(404).json({ message: "Seat not found" });
  }
  if (seat.status !== "locked" || seat.lockedBy !== user) {
    return res.status(400).json({ message: "Seat not locked by you" });
  }

  clearTimeout(seat.lockTimeout);
  seat.status = "available";
  seat.lockedBy = null;
  seat.lockTimeout = null;

  res.json({ message: `Seat ${seatId} released by ${user}` });
});

app.listen(PORT, () => {
  console.log(`🎟️ Ticket Booking Server running at http://localhost:${PORT}`);
});
