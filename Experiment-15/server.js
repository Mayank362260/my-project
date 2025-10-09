const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Variant Schema
const variantSchema = new mongoose.Schema({
  color: { type: String, required: true },
  size: { type: String, required: true },
  stock: { type: Number, default: 0 },
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  variants: [variantSchema],
});

const Product = mongoose.model("Product", productSchema);

// 🔹 Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get products by category
app.get("/products/category/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get products by variant color
app.get("/products/by-color/:color", async (req, res) => {
  try {
    const products = await Product.find({ "variants.color": req.params.color });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get products by variant size
app.get("/products/by-size/:size", async (req, res) => {
  try {
    const products = await Product.find({ "variants.size": req.params.size });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Add a new product
app.post("/products", async (req, res) => {
  try {
    const { name, price, category, variants } = req.body;

    // Manual validation
    if (!name || !price || !category) {
      return res.status(400).json({ error: "Missing required fields: name, price, category" });
    }

    const product = new Product({ name, price, category, variants });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Update a variant's stock
app.put("/products/:id/variant", async (req, res) => {
  const { color, size, stock } = req.body;

  try {
    const updated = await Product.updateOne(
      { _id: req.params.id, "variants.color": color, "variants.size": size },
      { $set: { "variants.$.stock": stock } }
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({ error: "Variant not found or no change made" });
    }

    res.json({ message: "Variant stock updated", result: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Delete a variant
app.delete("/products/:id/variant", async (req, res) => {
  const { color, size } = req.body;

  try {
    const updated = await Product.updateOne(
      { _id: req.params.id },
      { $pull: { variants: { color, size } } }
    );

    if (updated.modifiedCount === 0) {
      return res.status(404).json({ error: "Variant not found" });
    }

    res.json({ message: "Variant deleted", result: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Delete a product
app.delete("/products/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted", product: deleted });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
