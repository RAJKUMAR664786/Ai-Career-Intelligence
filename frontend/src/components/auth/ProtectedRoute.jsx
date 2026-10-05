import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Sparkles } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div 
        className="d-flex flex-column align-items-center justify-content-center min-vh-100"
        style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
      >
        <div className="d-flex align-items-center gap-2 mb-3">
          <div 
            className="rounded-3 p-2 d-flex align-items-center justify-content-center shadow-lg"
            style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
          >
            <Sparkles size={24} />
          </div>
          <div>
            <div className="fw-bold fs-5" style={{ letterSpacing: "-0.5px" }}>AI Career</div>
            <div style={{ fontSize: "0.7rem", color: "#60a5fa", fontWeight: 700, letterSpacing: "1px" }}>INTELLIGENCE</div>
          </div>
        </div>
        <div className="spinner-border text-primary spinner-border-sm mb-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="text-secondary small">Verifying secure student session...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
