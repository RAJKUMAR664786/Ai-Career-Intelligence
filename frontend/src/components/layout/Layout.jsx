import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useStudent } from "../../context/StudentContext";
import { useAuth } from "../../context/AuthContext";
import { Zap, AlertCircle, Info, CheckCircle2 } from "lucide-react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useStudent();
  const { profileMissing } = useAuth();

  return (
    <div className="d-flex position-relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-lg-none"
          style={{ zIndex: 999 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="app-main flex-grow-1">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {profileMissing && (
          <div className="alert alert-warning border-0 rounded-3 mb-4 p-3 shadow-sm d-flex align-items-start gap-3" style={{ backgroundColor: "#fef3c7", color: "#92400e" }}>
            <AlertCircle size={20} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <div className="fw-bold mb-0.5" style={{ fontSize: "0.9rem" }}>Student Profile Setup Pending</div>
              <div className="small" style={{ lineHeight: 1.45 }}>
                Your authorized student account is active, but your official student profile document has not yet been initialized in Cloud Firestore by your administrator. Please contact your institution's administrator to complete your student profile setup.
              </div>
            </div>
          </div>
        )}
        <Outlet />
      </main>

      {/* Real-time Floating Notification Banner */}
      {toast && (
        <div 
          className="position-fixed bottom-0 end-0 p-3" 
          style={{ zIndex: 9999, maxWidth: "420px" }}
        >
          <div className="card shadow-lg border-0 bg-dark text-white rounded-4 overflow-hidden shadow">
            <div className="card-body p-3 d-flex align-items-center gap-3">
              <div 
                className="rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ 
                  background: toast.type === "danger" ? "rgba(239, 68, 68, 0.25)" : "rgba(37, 99, 235, 0.25)", 
                  color: toast.type === "danger" ? "#f87171" : "#60a5fa" 
                }}
              >
                {toast.type === "danger" ? <AlertCircle size={20} /> : <Zap size={20} />}
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-primary text-white rounded-pill px-2 py-0.5" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                    LIVE SYNC
                  </span>
                  <span className="text-secondary small" style={{ fontSize: "0.7rem" }}>Just now</span>
                </div>
                <p className="small mb-0 text-white fw-medium" style={{ fontSize: "0.85rem", lineHeight: 1.35 }}>
                  {toast.message}
                </p>
              </div>
            </div>
            <div className="progress" style={{ height: "3px", backgroundColor: "rgba(255,255,255,0.1)" }}>
              <div 
                className="progress-bar bg-primary" 
                style={{ 
                  width: "100%", 
                  animation: "shrinkWidth 4.5s linear forwards" 
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;

