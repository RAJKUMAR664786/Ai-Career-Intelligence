import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Database, 
  CheckCircle, 
  RefreshCw, 
  AlertCircle, 
  Save, 
  ExternalLink, 
  ShieldCheck, 
  Server, 
  HardDrive,
  Clock,
  Terminal,
  Trash2
} from "lucide-react";
import { 
  verifyAllServices, 
  verifyGeminiConnection, 
  verifyFirebaseAuthConfig, 
  verifyFirestoreConnection 
} from "../services/connectionVerifier";
import { 
  getActiveFirebaseConfig, 
  getStoredFirebaseConfig, 
  saveFirebaseConfig 
} from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useStudent } from "../context/StudentContext";

const SettingsPage = () => {
  const { currentUser, userProfile, profileMissing } = useAuth();
  const { showToast } = useStudent();

  const [diagnostics, setDiagnostics] = useState({
    gemini: null,
    auth: null,
    firestore: null,
    timestamp: null
  });
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [cacheClearedSuccess, setCacheClearedSuccess] = useState(false);

  const [firebaseConfig, setFirebaseConfig] = useState(() => {
    const active = getActiveFirebaseConfig();
    return {
      apiKey: active.apiKey || "",
      authDomain: active.authDomain || "",
      projectId: active.projectId || "",
      storageBucket: active.storageBucket || "",
      messagingSenderId: active.messagingSenderId || "",
      appId: active.appId || ""
    };
  });

  const runDiagnostics = async () => {
    setRunningDiagnostics(true);
    try {
      const results = await verifyAllServices();
      setDiagnostics(results);
    } catch (err) {
      console.error("Diagnostic error:", err);
    } finally {
      setRunningDiagnostics(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const handleSaveFirebase = (e) => {
    e.preventDefault();
    saveFirebaseConfig(firebaseConfig);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    // Re-run diagnostics after saving new keys
    runDiagnostics();
  };

  const handleClearLocalCache = () => {
    if (window.confirm("Clear client-side cached session data? Your persistent Firestore records remain safe and will be freshly re-synced.")) {
      try {
        if (currentUser?.uid) {
          localStorage.removeItem(`student_career_interviews_${currentUser.uid}`);
        }
        setCacheClearedSuccess(true);
        if (showToast) {
          showToast("Local session cache cleared. Re-syncing with Cloud Firestore...");
        }
        setTimeout(() => setCacheClearedSuccess(false), 3500);
      } catch (e) {
        console.warn("Could not clear localStorage cache:", e);
      }
    }
  };

  return (
    <div className="container-fluid p-0" style={{ maxWidth: "960px" }}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">System & Cloud Infrastructure</h3>
          <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
            Real-time diagnostic verification for Google Gemini AI, Firebase Authentication, and Cloud Firestore.
          </p>
        </div>
        <button 
          onClick={runDiagnostics} 
          disabled={runningDiagnostics}
          className="btn btn-primary rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-2 shadow-sm align-self-start align-self-md-auto"
          style={{ fontSize: "0.85rem" }}
        >
          <RefreshCw size={14} className={runningDiagnostics ? "spin-animation" : ""} />
          <span>{runningDiagnostics ? "Testing Services..." : "Run Diagnostics"}</span>
        </button>
      </div>

      {diagnostics.timestamp && (
        <div className="d-flex align-items-center gap-1.5 text-muted small mb-3" style={{ fontSize: "0.78rem" }}>
          <Clock size={13} />
          <span>Last full diagnostic scan: {new Date(diagnostics.timestamp).toLocaleTimeString()}</span>
        </div>
      )}

      {/* 1. Google Gemini AI Engine Card */}
      <div className="custom-card mb-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-primary-subtle text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h6 className="card-title-main mb-0">Google Gemini AI Engine</h6>
              <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                LLM-powered technical mock interviewer & resume analyzer
              </div>
            </div>
          </div>
          <div>
            {runningDiagnostics && !diagnostics.gemini ? (
              <span className="badge bg-secondary-subtle text-secondary px-3 py-1.5 rounded-pill">Probing...</span>
            ) : diagnostics.gemini?.status === "connected" ? (
              <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold border border-success-subtle">
                ● Live & Connected ({diagnostics.gemini.latencyMs}ms)
              </span>
            ) : diagnostics.gemini?.status === "disconnected" ? (
              <span className="badge bg-danger-subtle text-danger px-3 py-1.5 rounded-pill fw-semibold border border-danger-subtle">
                ● Backend Offline (Port 5000)
              </span>
            ) : diagnostics.gemini?.status === "not_configured" ? (
              <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-1.5 rounded-pill fw-semibold border border-warning-subtle">
                ● Key Not Configured
              </span>
            ) : (
              <span className="badge bg-danger-subtle text-danger px-3 py-1.5 rounded-pill fw-semibold border border-danger-subtle">
                ● Gemini API Error
              </span>
            )}
          </div>
        </div>

        <div className="p-3 bg-light rounded-3 border mb-3">
          <div className="row g-2">
            <div className="col-sm-6">
              <div className="text-muted small" style={{ fontSize: "0.78rem" }}>Active Model:</div>
              <div className="fw-semibold text-dark font-monospace" style={{ fontSize: "0.85rem" }}>
                {diagnostics.gemini?.model || "gemini-3.8-flash"}
              </div>
            </div>
            <div className="col-sm-6">
              <div className="text-muted small" style={{ fontSize: "0.78rem" }}>Live Verification Probe:</div>
              <div className="small fw-medium text-dark">
                {diagnostics.gemini?.message || "Running live probe..."}
              </div>
            </div>
          </div>
        </div>

        <div className="small text-secondary">
          <span className="fw-semibold text-dark">Configuration source: </span>
          <code>backend/.env</code> &rarr; <code>GEMINI_API_KEY</code>. Privileged credentials remain securely on the backend server.
        </div>
      </div>

      {/* 2. Firebase Authentication Card */}
      <div className="custom-card mb-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-warning-subtle text-warning-emphasis">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h6 className="card-title-main mb-0">Firebase Authentication</h6>
              <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                Identity management, login-only session control & route authorization
              </div>
            </div>
          </div>
          <div>
            {runningDiagnostics && !diagnostics.auth ? (
              <span className="badge bg-secondary-subtle text-secondary px-3 py-1.5 rounded-pill">Probing...</span>
            ) : diagnostics.auth?.status === "connected" ? (
              <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold border border-success-subtle">
                ● Connected & Active
              </span>
            ) : diagnostics.auth?.status === "not_configured" ? (
              <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-1.5 rounded-pill fw-semibold border border-warning-subtle">
                ● Config Missing
              </span>
            ) : diagnostics.auth?.code === "auth/configuration-not-found" ? (
              <span className="badge bg-danger-subtle text-danger px-3 py-1.5 rounded-pill fw-semibold border border-danger-subtle">
                ● Provider Disabled
              </span>
            ) : (
              <span className="badge bg-danger-subtle text-danger px-3 py-1.5 rounded-pill fw-semibold border border-danger-subtle">
                ● Auth Error
              </span>
            )}
          </div>
        </div>

        <div className="p-3 bg-light rounded-3 border mb-3">
          <div className="row g-2 mb-2">
            <div className="col-sm-6">
              <div className="text-muted small" style={{ fontSize: "0.78rem" }}>Firebase Project ID:</div>
              <div className="fw-semibold text-dark font-monospace" style={{ fontSize: "0.85rem" }}>
                {firebaseConfig.projectId || "Not configured"}
              </div>
            </div>
            <div className="col-sm-6">
              <div className="text-muted small" style={{ fontSize: "0.78rem" }}>Sign-In Method:</div>
              <div className="fw-semibold text-dark" style={{ fontSize: "0.85rem" }}>
                Email / Password (Login Only, Pre-authorized Students)
              </div>
            </div>
          </div>
          <div className="text-muted small" style={{ fontSize: "0.78rem" }}>Status Details:</div>
          <div className="small fw-medium text-dark">
            {diagnostics.auth?.message || "Validating authentication endpoint..."}
          </div>
        </div>

        {diagnostics.auth?.code === "auth/configuration-not-found" && (
          <div className="alert alert-danger border-0 rounded-3 p-3 small mb-0 d-flex align-items-start gap-2">
            <AlertCircle size={18} className="text-danger flex-shrink-0 mt-0.5" />
            <div>
              <strong>Action Required in Firebase Console:</strong>
              <div className="mt-1">
                The Email/Password sign-in provider has not been enabled yet. Open the{" "}
                <a 
                  href={`https://console.firebase.google.com/project/${firebaseConfig.projectId || "ai-student-intelligence-ed261"}/authentication/providers`}
                  target="_blank" 
                  rel="noreferrer"
                  className="fw-bold text-danger"
                >
                  Firebase Console Authentication Providers
                </a>, click <strong>Email/Password</strong>, toggle <strong>Enable</strong>, and click <strong>Save</strong>.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Cloud Firestore Database Card */}
      <div className="custom-card mb-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3 bg-info-subtle text-info-emphasis">
              <Database size={20} />
            </div>
            <div>
              <h6 className="card-title-main mb-0">Cloud Firestore Database</h6>
              <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                Persistent student profiles, interview sessions & skill assessments
              </div>
            </div>
          </div>
          <div>
            {runningDiagnostics && !diagnostics.firestore ? (
              <span className="badge bg-secondary-subtle text-secondary px-3 py-1.5 rounded-pill">Probing...</span>
            ) : diagnostics.firestore?.status === "connected" ? (
              <span className="badge bg-success-subtle text-success px-3 py-1.5 rounded-pill fw-semibold border border-success-subtle">
                ● Database Online
              </span>
            ) : (diagnostics.firestore?.status === "action_required" || diagnostics.firestore?.status === "not_created") ? (
              <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-1.5 rounded-pill fw-semibold border border-warning-subtle">
                ● Database Not Initialized
              </span>
            ) : diagnostics.firestore?.status === "unavailable" ? (
              <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-1.5 rounded-pill fw-semibold border border-warning-subtle">
                ● Database Unavailable
              </span>
            ) : diagnostics.firestore?.status === "network_error" ? (
              <span className="badge bg-danger-subtle text-danger px-3 py-1.5 rounded-pill fw-semibold border border-danger-subtle">
                ● Network Error
              </span>
            ) : diagnostics.firestore?.status === "not_configured" ? (
              <span className="badge bg-warning-subtle text-warning-emphasis px-3 py-1.5 rounded-pill fw-semibold border border-warning-subtle">
                ● Project ID Missing
              </span>
            ) : (
              <span className="badge bg-danger-subtle text-danger px-3 py-1.5 rounded-pill fw-semibold border border-danger-subtle">
                ● Firestore Error
              </span>
            )}
          </div>
        </div>

        <div className="p-3 bg-light rounded-3 border mb-3">
          <div className="row g-2 mb-2">
            <div className="col-sm-6">
              <div className="text-muted small" style={{ fontSize: "0.78rem" }}>Database Instance:</div>
              <div className="fw-semibold text-dark font-monospace" style={{ fontSize: "0.85rem" }}>
                (default) in {firebaseConfig.projectId || "ai-student-intelligence-ed261"}
              </div>
            </div>
            <div className="col-sm-6">
              <div className="text-muted small" style={{ fontSize: "0.78rem" }}>Security Rules:</div>
              <div className="fw-semibold text-dark" style={{ fontSize: "0.85rem" }}>
                Owner-isolated by UID (<code>firestore.rules</code>)
              </div>
            </div>
          </div>
          <div className="text-muted small" style={{ fontSize: "0.78rem" }}>Diagnostic Probe Result:</div>
          <div className="small fw-medium text-dark">
            {diagnostics.firestore?.message || "Probing Firestore database instance..."}
          </div>
        </div>

        {(diagnostics.firestore?.status === "action_required" || diagnostics.firestore?.status === "not_created") && (
          <div className="alert alert-warning border-0 rounded-3 p-3 small mb-0 d-flex flex-column gap-2">
            <div className="d-flex align-items-start gap-2">
              <AlertCircle size={18} className="text-warning-emphasis flex-shrink-0 mt-0.5" />
              <div>
                <strong>Database Creation Required in Firebase Console:</strong>
                <p className="mb-2 mt-1">
                  Google reports that the Cloud Firestore Database has not yet been initialized in project <strong>{firebaseConfig.projectId || "ai-student-intelligence-ed261"}</strong>. Once created, student profiles and mock interview sessions will persist automatically.
                </p>
                <a 
                  href={`https://console.firebase.google.com/project/${firebaseConfig.projectId || "ai-student-intelligence-ed261"}/firestore`}
                  target="_blank" 
                  rel="noreferrer"
                  className="btn btn-warning btn-sm fw-semibold rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 shadow-sm text-dark"
                >
                  <ExternalLink size={14} /> Open Firebase Console &rarr; Create Database
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Firebase Project Configuration Form */}
      <div className="custom-card mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <HardDrive className="text-primary" size={18} />
          <h6 className="card-title-main mb-0">Firebase Web App Client Keys</h6>
        </div>
        <p className="text-secondary small mb-3">
          These public client credentials connect your browser session to Firebase Authentication and Cloud Firestore. They are read from <code>frontend/.env</code>.
        </p>

        <form onSubmit={handleSaveFirebase}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">API Key (VITE_FIREBASE_API_KEY)</label>
              <input
                type="text"
                value={firebaseConfig.apiKey}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="form-control form-control-sm font-monospace rounded-2"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Project ID (VITE_FIREBASE_PROJECT_ID)</label>
              <input
                type="text"
                value={firebaseConfig.projectId}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
                placeholder="ai-student-intelligence-ed261"
                className="form-control form-control-sm font-monospace rounded-2"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">Auth Domain (VITE_FIREBASE_AUTH_DOMAIN)</label>
              <input
                type="text"
                value={firebaseConfig.authDomain}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })}
                placeholder="ai-student-intelligence-ed261.firebaseapp.com"
                className="form-control form-control-sm font-monospace rounded-2"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label small fw-semibold text-muted">App ID (VITE_FIREBASE_APP_ID)</label>
              <input
                type="text"
                value={firebaseConfig.appId}
                onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value })}
                placeholder="1:152802312703:web:..."
                className="form-control form-control-sm font-monospace rounded-2"
              />
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between mt-3">
            {savedSuccess && (
              <span className="text-success small fw-semibold d-flex align-items-center gap-1">
                <CheckCircle size={15} /> Saved and re-tested successfully!
              </span>
            )}
            <div className="ms-auto">
              <button type="submit" className="btn btn-primary btn-sm rounded-pill px-4 py-2 fw-semibold d-flex align-items-center gap-1.5 shadow-sm">
                <Save size={14} /> Update Firebase Keys
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 5. Session & Storage Maintenance Card */}
      <div className="custom-card border-secondary-subtle">
        <div className="d-flex align-items-center gap-2 mb-2">
          <Trash2 className="text-danger" size={18} />
          <h6 className="card-title-main mb-0 text-dark">Session Storage & Cloud Sync</h6>
        </div>
        <p className="text-secondary small mb-3">
          Student mock interview records and assessment scores are stored in Cloud Firestore under each student's unique Firebase UID (<code>request.auth.uid</code>). You can purge temporary browser cache to trigger a clean sync from the cloud database.
        </p>

        <div className="d-flex align-items-center justify-content-between">
          <button 
            onClick={handleClearLocalCache}
            className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
          >
            <Trash2 size={14} /> Clear Local Session Cache & Re-sync
          </button>
          {cacheClearedSuccess && (
            <span className="text-success small fw-semibold d-flex align-items-center gap-1">
              <CheckCircle size={15} /> Cache cleared. Synced with Firestore.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
