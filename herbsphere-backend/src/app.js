const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const plantRoutes = require("./routes/plantRoutes");

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/plants", plantRoutes);

// Base test route
app.get("/", (req, res) => {
  res.send("🌿 HerbSphere Backend API is running");
});

module.exports = app;
