import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  doc, 
  getDoc, 
  setDoc,
  isFirebaseConfigured,
  getFirebaseErrorMessage 
} from "../services/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileMissing, setProfileMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const isConfigured = isFirebaseConfigured();

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (isConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setCurrentUser(user);
        if (user) {
          try {
            if (db) {
              const userDocRef = doc(db, "users", user.uid);
              const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("PROFILE_FETCH_TIMEOUT")), 3500)
              );
              const snap = await Promise.race([getDoc(userDocRef), timeoutPromise]);
              if (snap.exists()) {
                setUserProfile(snap.data());
                setProfileMissing(false);
              } else {
                console.warn(`[Student Profile] Firestore record users/${user.uid} not found.`);
                setUserProfile(null);
                setProfileMissing(true);
              }
            }
          } catch (err) {
            console.warn("Could not load user profile from Firestore on boot:", err.message || err);
            setUserProfile(null);
            setProfileMissing(true);
          }
        } else {
          setUserProfile(null);
          setProfileMissing(false);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      setLoading(false);
    }
  }, [isConfigured]);

  // Login handler - Authenticate only against authorized Firebase Authentication accounts
  const login = async (email, password) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!isConfigured || !auth) {
      const msg = "Firebase Authentication is not configured. Please ensure environment variables are configured in .env.";
      setAuthError(msg);
      return { success: false, error: msg };
    }

    try {
      const res = await signInWithEmailAndPassword(auth, cleanEmail, password);
      return { success: true, user: res.user };
    } catch (err) {
      if (import.meta.env.DEV) {
        console.info("[Firebase Diagnostic] Login failed with error code:", err?.code || "unknown");
      }
      const friendlyMessage = getFirebaseErrorMessage(err);
      setAuthError(friendlyMessage);
      return { success: false, error: friendlyMessage };
    }
  };

  // Logout handler - signs out of Firebase session, clears local state
  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      setCurrentUser(null);
      setUserProfile(null);
      setProfileMissing(false);
      return { success: true };
    } catch (err) {
      console.error("Logout error:", err);
      return { success: false, error: err.message };
    }
  };

  // Password reset email handler for authorized students
  const resetPassword = async (email) => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!isConfigured || !auth) {
      return { success: false, error: "Firebase Authentication is not configured." };
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return { success: true, message: "Password reset link sent to your registered student email." };
    } catch (err) {
      if (import.meta.env.DEV) {
        console.info("[Firebase Diagnostic] Password reset failed with error code:", err?.code || "unknown");
      }
      const friendlyMessage = getFirebaseErrorMessage(err);
      return { success: false, error: friendlyMessage };
    }
  };

  // Reload user profile directly from Firestore
  const reloadUserProfile = async (targetUser = currentUser) => {
    if (!targetUser || !db) return null;
    try {
      const userDocRef = doc(db, "users", targetUser.uid);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("PROFILE_RELOAD_TIMEOUT")), 3500)
      );
      const snap = await Promise.race([getDoc(userDocRef), timeoutPromise]);
      if (snap.exists()) {
        const data = snap.data();
        setUserProfile(data);
        setProfileMissing(false);
        return data;
      } else {
        setUserProfile(null);
        setProfileMissing(true);
        return null;
      }
    } catch (err) {
      console.warn("Failed to reload user profile:", err.message || err);
      return null;
    }
  };

  // Update profile in Firestore (merge) and update state functionally
  const updateUserProfileData = async (partialData, options = {}) => {
    if (!currentUser) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const payload = {
      ...partialData,
      updatedAt: new Date().toISOString()
    };

    // Update state functionally to avoid stale closure overwrites
    setUserProfile((prev) => ({
      ...(prev || {}),
      ...payload
    }));
    setProfileMissing(false);

    // If caller already performed the remote write, skip duplicate network call
    if (options.skipRemoteWrite) {
      return { success: true };
    }

    if (isConfigured && db && currentUser.uid) {
      try {
        const ref = doc(db, "users", currentUser.uid);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Unable to connect to the database. Your changes were not saved.")), 8000)
        );
        await Promise.race([setDoc(ref, payload, { merge: true }), timeoutPromise]);
        return { success: true };
      } catch (err) {
        console.error("Firestore update error:", err);
        throw err;
      }
    }

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        profileMissing,
        loading,
        authError,
        isConfigured,
        login,
        logout,
        resetPassword,
        updateUserProfileData,
        reloadUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

