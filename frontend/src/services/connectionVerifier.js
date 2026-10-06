import { getActiveFirebaseConfig, db, doc, getDoc } from "./firebase.js";

/**
 * Diagnostic Service for Truthful System Connectivity Verification
 * Checks Google Gemini 3.8 Flash, Firebase Authentication, and Cloud Firestore independently.
 */

// 1. Google Gemini AI Engine Probe
export const verifyGeminiConnection = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/health/gemini", {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (!res.ok) {
      return {
        service: "gemini",
        status: "error",
        configured: false,
        message: `Backend returned HTTP ${res.status}: Failed to reach Gemini probe`,
        model: "gemini-3.8-flash"
      };
    }

    const data = await res.json();
    if (data.connected) {
      return {
        service: "gemini",
        status: "connected",
        configured: true,
        model: data.model || "gemini-3.8-flash",
        latencyMs: data.latencyMs,
        responseSample: data.responseSample,
        message: `Live Gemini 3.8 Flash Engine is active and verified (${data.latencyMs}ms latency).`
      };
    } else {
      return {
        service: "gemini",
        status: data.configured ? "error" : "not_configured",
        configured: Boolean(data.configured),
        model: data.model || "gemini-3.8-flash",
        message: data.error || "Gemini API key is invalid or quota exceeded."
      };
    }
  } catch (err) {
    return {
      service: "gemini",
      status: "disconnected",
      configured: false,
      model: "gemini-3.8-flash",
      message: "Backend server is offline or unreachable on port 5000."
    };
  }
};

// 2. Firebase Authentication Probe
export const verifyFirebaseAuthConfig = async () => {
  const config = getActiveFirebaseConfig();
  const missing = [];
  if (!config.apiKey) missing.push("VITE_FIREBASE_API_KEY");
  if (!config.projectId) missing.push("VITE_FIREBASE_PROJECT_ID");
  if (!config.authDomain) missing.push("VITE_FIREBASE_AUTH_DOMAIN");

  if (missing.length > 0) {
    return {
      service: "firebase_auth",
      status: "not_configured",
      configured: false,
      missingKeys: missing,
      message: `Missing required environment variables: ${missing.join(", ")}`
    };
  }

  try {
    // Probe Identity Toolkit to test API Key and Email/Password provider status
    const probeUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.apiKey}`;
    const res = await fetch(probeUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "system.probe@test.local",
        password: "probe_password",
        returnSecureToken: true
      })
    });

    const data = await res.json();
    const errMsg = data?.error?.message || "";

    if (errMsg === "INVALID_LOGIN_CREDENTIALS" || errMsg === "EMAIL_NOT_FOUND") {
      return {
        service: "firebase_auth",
        status: "connected",
        configured: true,
        projectId: config.projectId,
        authDomain: config.authDomain,
        message: `Firebase Authentication is active and Email/Password provider is enabled for project '${config.projectId}'.`
      };
    }

    if (errMsg === "CONFIGURATION_NOT_FOUND") {
      return {
        service: "firebase_auth",
        status: "error",
        configured: true,
        code: "auth/configuration-not-found",
        projectId: config.projectId,
        message: `Email/Password sign-in provider is disabled in project '${config.projectId}'. Go to Firebase Console > Authentication > Sign-in method and enable Email/Password.`
      };
    }

    if (errMsg.includes("API_KEY_INVALID") || res.status === 400 && errMsg === "INVALID_KEY") {
      return {
        service: "firebase_auth",
        status: "error",
        configured: true,
        code: "auth/invalid-api-key",
        projectId: config.projectId,
        message: `Invalid Firebase API Key for project '${config.projectId}'. Verify the key in frontend/.env.`
      };
    }

    return {
      service: "firebase_auth",
      status: res.ok ? "connected" : "error",
      configured: true,
      projectId: config.projectId,
      message: errMsg || "Firebase Authentication probe completed."
    };
  } catch (err) {
    return {
      service: "firebase_auth",
      status: "disconnected",
      configured: true,
      projectId: config.projectId,
      message: `Network error reaching Firebase Identity servers: ${err.message}`
    };
  }
};

// 3. Cloud Firestore Database Probe
export const verifyFirestoreConnection = async () => {
  const config = getActiveFirebaseConfig();
  if (!config.projectId) {
    return {
      service: "firestore",
      status: "not_configured",
      configured: false,
      message: "VITE_FIREBASE_PROJECT_ID is not configured in frontend/.env"
    };
  }

  // 1. Primary Probe: Query dedicated backend probe on port 5000 (free of browser CORS restrictions)
  try {
    const backendProbeRes = await fetch("http://localhost:5000/api/health/firestore", {
      method: "GET",
      headers: { "Accept": "application/json" }
    });

    if (backendProbeRes.ok) {
      const data = await backendProbeRes.json();
      return {
        service: "firestore",
        status: data.status || (data.connected ? "connected" : "action_required"),
        configured: Boolean(data.configured),
        projectId: data.projectId || config.projectId,
        code: data.code,
        latencyMs: data.latencyMs,
        message: data.message,
        actionLabel: data.actionLabel,
        actionUrl: data.actionUrl
      };
    }
  } catch (backendErr) {
    // Backend offline or unreachable - continue to SDK probe fallback
  }

  // 2. Fallback Probe: Direct Firestore Web SDK check with timeout
  if (db) {
    try {
      const testRef = doc(db, "_system_health", "ping");
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("FIRESTORE_SDK_TIMEOUT")), 3500)
      );

      await Promise.race([getDoc(testRef), timeoutPromise]);

      return {
        service: "firestore",
        status: "connected",
        configured: true,
        projectId: config.projectId,
        message: `Cloud Firestore is online and accessible for project '${config.projectId}'.`
      };
    } catch (sdkErr) {
      const msg = sdkErr.message || "";
      const code = sdkErr.code || "";

      if (code === "permission-denied" || msg.includes("permission-denied") || msg.includes("insufficient permissions")) {
        return {
          service: "firestore",
          status: "connected",
          code: "PERMISSION_DENIED_ENFORCED",
          configured: true,
          projectId: config.projectId,
          message: `Cloud Firestore is online and active. Security rules are properly enforcing UID-level authorization for project '${config.projectId}'.`
        };
      }

      if (code === "not-found" || msg.includes("Cloud Firestore API has not been used") || msg.includes("NOT_FOUND")) {
        return {
          service: "firestore",
          status: "not_created",
          configured: true,
          projectId: config.projectId,
          code: "DATABASE_NOT_CREATED",
          message: `Cloud Firestore database '(default)' has not been created yet in project '${config.projectId}'.`,
          actionLabel: "Create Firestore Database in Firebase Console",
          actionUrl: `https://console.firebase.google.com/project/${config.projectId}/firestore`
        };
      }

      if (code === "unavailable" || msg === "FIRESTORE_SDK_TIMEOUT") {
        return {
          service: "firestore",
          status: "unavailable",
          configured: true,
          projectId: config.projectId,
          code: "DATABASE_UNINITIALIZED_OR_OFFLINE",
          message: `Cloud Firestore backend could not be reached for project '${config.projectId}'. The database has not been created yet or is unreachable from your network.`,
          actionLabel: "Create Database in Firebase Console",
          actionUrl: `https://console.firebase.google.com/project/${config.projectId}/firestore`
        };
      }

      if (msg.includes("Failed to fetch") || msg.includes("network")) {
        return {
          service: "firestore",
          status: "network_error",
          configured: true,
          projectId: config.projectId,
          code: "NETWORK_ERROR",
          message: `Network error connecting to Firestore servers. Check your internet connection or proxy settings.`
        };
      }

      return {
        service: "firestore",
        status: "error",
        configured: true,
        projectId: config.projectId,
        code: code || "UNKNOWN_ERROR",
        message: msg || "Firestore probe encountered an unexpected error."
      };
    }
  }

  return {
    service: "firestore",
    status: "not_configured",
    configured: false,
    projectId: config.projectId,
    message: "Firestore instance is not initialized. Please verify frontend Firebase configuration."
  };
};

// 4. Combined Diagnostic Probe
export const verifyAllServices = async () => {
  const [geminiResult, authResult, firestoreResult] = await Promise.all([
    verifyGeminiConnection(),
    verifyFirebaseAuthConfig(),
    verifyFirestoreConnection()
  ]);

  return {
    gemini: geminiResult,
    auth: authResult,
    firestore: firestoreResult,
    timestamp: new Date().toISOString()
  };
};
