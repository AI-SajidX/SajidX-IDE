
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("SajidX IDE Backend is Running!");
});

// Test API Route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Frontend connected successfully!",
  });
});

// Server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
