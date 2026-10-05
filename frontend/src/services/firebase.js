import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";

const FIREBASE_CONFIG_KEY = "student_career_firebase_config";

const cleanStr = (val) => {
  if (!val) return "";
  if (typeof val !== "string") return String(val);
  return val.trim().replace(/^["']|["']$/g, "").trim();
};

// Read from Vite environment variables or localStorage
export const getActiveFirebaseConfig = () => {
  const getEnv = (key) => {
    try {
      if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
        return import.meta.env[key];
      }
    } catch (e) {}
    try {
      if (typeof process !== "undefined" && process.env && process.env[key]) {
        return process.env[key];
      }
    } catch (e) {}
    return "";
  };

  // 1. Try Vite / system env vars
  const envConfig = {
    apiKey: cleanStr(getEnv("VITE_FIREBASE_API_KEY")),
    authDomain: cleanStr(getEnv("VITE_FIREBASE_AUTH_DOMAIN")),
    projectId: cleanStr(getEnv("VITE_FIREBASE_PROJECT_ID")),
    storageBucket: cleanStr(getEnv("VITE_FIREBASE_STORAGE_BUCKET")),
    messagingSenderId: cleanStr(getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID")),
    appId: cleanStr(getEnv("VITE_FIREBASE_APP_ID"))
  };

  if (envConfig.apiKey && envConfig.projectId) {
    return envConfig;
  }

  // 2. Fallback to localStorage (from Settings page)
  try {
    const saved = localStorage.getItem(FIREBASE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        return {
          apiKey: cleanStr(parsed.apiKey),
          authDomain: cleanStr(parsed.authDomain),
          projectId: cleanStr(parsed.projectId),
          storageBucket: cleanStr(parsed.storageBucket),
          messagingSenderId: cleanStr(parsed.messagingSenderId),
          appId: cleanStr(parsed.appId)
        };
      }
    }
  } catch (e) {
    console.warn("Could not read stored Firebase config", e);
  }

  return envConfig;
};

export const getStoredFirebaseConfig = () => {
  try {
    const data = localStorage.getItem(FIREBASE_CONFIG_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const saveFirebaseConfig = (config) => {
  try {
    localStorage.setItem(FIREBASE_CONFIG_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    return false;
  }
};

export const isFirebaseConfigured = () => {
  const cfg = getActiveFirebaseConfig();
  return Boolean(cfg && cfg.apiKey && cfg.apiKey.trim().length > 10 && cfg.projectId);
};

// Initialize Firebase App instance
let appInstance = null;
let authInstance = null;
let dbInstance = null;

export const initFirebase = () => {
  const config = getActiveFirebaseConfig();
  if (config.apiKey && config.projectId) {
    try {
      appInstance = !getApps().length ? initializeApp(config) : getApp();
      authInstance = getAuth(appInstance);
      dbInstance = getFirestore(appInstance);
      if (typeof import.meta !== "undefined" && import.meta.env?.DEV) {
        console.info("[Firebase Diagnostic] Connected to Firebase Project ID:", config.projectId);
      }
      return { app: appInstance, auth: authInstance, db: dbInstance };
    } catch (err) {
      console.error("Firebase initialization error:", err);
    }
  }
  return { app: null, auth: null, db: null };
};

// Auto-initialize if configured
const { app, auth, db } = initFirebase();

export { 
  app, 
  auth, 
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp
};

// Friendly error messages for common Firebase Authentication errors
export const getFirebaseErrorMessage = (error) => {
  if (!error) return "An unexpected error occurred.";
  const code = error.code || "";
  
  switch (code) {
    case "auth/configuration-not-found":
      return "Firebase Authentication configuration not found. Please ensure the Email/Password sign-in provider is enabled in Firebase Console (Authentication > Sign-in method) for project 'ai-student-intelligence-ed261'.";
    case "auth/invalid-email":
      return "The email address is improperly formatted.";
    case "auth/user-disabled":
      return "This student account has been disabled. Please contact your institution administrator.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password. Only pre-authorized student accounts can sign in.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please sign in.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters with mixed letters and numbers.";
    case "auth/network-request-failed":
      return "Network connection failed. Please check your internet or proxy connection.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again after a few minutes or reset your password.";
    case "auth/requires-recent-login":
      return "Please log in again to complete this sensitive action.";
    default:
      return error.message || "Authentication failed. Please verify your credentials.";
  }
};

