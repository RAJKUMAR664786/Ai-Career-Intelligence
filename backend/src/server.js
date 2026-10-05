import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import academicRoutes from "./routes/academicRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import { isGeminiConfigured, testGeminiConnection } from "./config/gemini.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/academic", academicRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    service: "AI-Powered Student Career Intelligence API",
    geminiLive: isGeminiConfigured(),
    timestamp: new Date().toISOString()
  });
});

// Dedicated Gemini AI live probe endpoint
app.get("/api/health/gemini", async (req, res) => {
  try {
    const result = await testGeminiConnection();
    res.json(result);
  } catch (err) {
    res.status(500).json({
      configured: false,
      connected: false,
      error: err.message || "Failed to execute Gemini AI probe"
    });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Student Career Intelligence Backend API is active and running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "An unexpected error occurred"
  });
});

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Student Career Intelligence Server running on port ${PORT}`);
  console.log(`🤖 Gemini AI Configured: ${isGeminiConfigured() ? "YES (Live Gemini)" : "NO (Smart Fallback Active)"}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`📡 Gemini Health: http://localhost:${PORT}/api/health/gemini`);
  console.log(`====================================================`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Port ${PORT} is already in use by another running server instance.`);
    console.error(`👉 To free port ${PORT} on Windows PowerShell, run:`);
    console.error(`   Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
  } else {
    console.error("Server listen error:", err);
  }
  process.exit(1);
});
