const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let cards = [
    { id: 1, suit: "Hearts", value: "Ace" },
    { id: 2, suit: "Spades", value: "King" }
];

app.get("/", (req, res) => {
    res.send("🎴 Welcome to Playing Cards API! Use /cards to get started.");
});

app.get("/cards", (req, res) => {
    res.json(cards);
});

app.post("/cards", (req, res) => {
    const newCard = {
        id: cards.length + 1,
        suit: req.body.suit,
        value: req.body.value
    };
    cards.push(newCard);
    res.status(201).json(newCard);
});

app.put("/cards/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const card = cards.find(c => c.id === id);
    if (!card) {
        return res.status(404).json({ message: "Card not found" });
    }
    card.suit = req.body.suit || card.suit;
    card.value = req.body.value || card.value;
    res.json(card);
});

app.delete("/cards/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = cards.findIndex(c => c.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Card not found" });
    }
    const deletedCard = cards.splice(index, 1);
    res.json(deletedCard);
});

app.listen(PORT, () => {
    console.log(`🎴 Server running at http://localhost:${PORT}`);
});
