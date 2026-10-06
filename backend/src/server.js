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

// Dedicated Cloud Firestore live probe endpoint (free of browser CORS restrictions)
app.get("/api/health/firestore", async (req, res) => {
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "ai-student-intelligence-ed261";
  const apiKey = process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "";
  
  if (!projectId) {
    return res.status(400).json({
      configured: false,
      connected: false,
      status: "not_configured",
      message: "Firebase Project ID is not configured in backend environment."
    });
  }

  try {
    const probeUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents?key=${apiKey}`;
    const startTime = Date.now();
    const response = await fetch(probeUrl);
    const latencyMs = Date.now() - startTime;
    const status = response.status;

    // Check if 404 HTML (database default does not exist in the GCP/Firebase project yet)
    if (status === 404) {
      return res.json({
        configured: true,
        connected: false,
        status: "action_required",
        code: "DATABASE_NOT_CREATED",
        httpStatus: 404,
        projectId,
        latencyMs,
        message: `Cloud Firestore database '(default)' has not been created yet in project '${projectId}'. Please create it in the Firebase Console.`,
        actionLabel: "Create Firestore Database in Firebase Console",
        actionUrl: `https://console.firebase.google.com/project/${projectId}/firestore`
      });
    }

    const text = await response.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch (e) {}

    // Check if API disabled
    if (data?.error?.message && data.error.message.includes("Cloud Firestore API has not been used")) {
      return res.json({
        configured: true,
        connected: false,
        status: "action_required",
        code: "API_DISABLED_OR_DATABASE_MISSING",
        httpStatus: status,
        projectId,
        latencyMs,
        message: `Cloud Firestore is disabled or uninitialized in project '${projectId}'. Please enable it in the Firebase Console.`,
        actionLabel: "Enable Firestore in Firebase Console",
        actionUrl: `https://console.firebase.google.com/project/${projectId}/firestore`
      });
    }

    // HTTP 200 or HTTP 403 PERMISSION_DENIED: Database exists and security rules are actively running!
    if (response.ok || (status === 403 && data?.error?.status === "PERMISSION_DENIED")) {
      return res.json({
        configured: true,
        connected: true,
        status: "connected",
        httpStatus: status,
        projectId,
        latencyMs,
        message: `Cloud Firestore is online and enforcing security rules for project '${projectId}'.`
      });
    }

    return res.json({
      configured: true,
      connected: false,
      status: "error",
      httpStatus: status,
      projectId,
      latencyMs,
      message: data?.error?.message || `Firestore returned HTTP status ${status}.`
    });
  } catch (err) {
    return res.json({
      configured: true,
      connected: false,
      status: "disconnected",
      projectId,
      message: `Network error probing Cloud Firestore: ${err.message}`
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
