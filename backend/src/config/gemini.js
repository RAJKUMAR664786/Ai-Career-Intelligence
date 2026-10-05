import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

let aiClient = null;

export const getCleanApiKey = () => {
  const raw = process.env.GEMINI_API_KEY || "";
  return raw.trim().replace(/^["']|["']$/g, "").trim();
};

export const isGeminiConfigured = () => {
  const key = getCleanApiKey();
  return Boolean(key && key.length > 10);
};

export const getGeminiClient = () => {
  if (!isGeminiConfigured()) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: getCleanApiKey()
    });
  }
  return aiClient;
};

export const GEMINI_MODEL = "gemini-3.8-flash";

export const testGeminiConnection = async () => {
  if (!isGeminiConfigured()) {
    return {
      configured: false,
      connected: false,
      model: GEMINI_MODEL,
      error: "GEMINI_API_KEY is not configured in backend/.env"
    };
  }

  const client = getGeminiClient();
  const startTime = Date.now();
  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: "Respond with Pong"
    });
    const latencyMs = Date.now() - startTime;
    return {
      configured: true,
      connected: true,
      model: GEMINI_MODEL,
      latencyMs,
      responseSample: response.text ? response.text.trim() : "Pong",
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      configured: true,
      connected: false,
      model: GEMINI_MODEL,
      error: err.message || "Failed to reach Google Gemini API",
      timestamp: new Date().toISOString()
    };
  }
};
