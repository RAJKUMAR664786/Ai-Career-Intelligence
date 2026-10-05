import React, { useEffect, useState } from "react";
import { Menu, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import api from "../../services/api";

const Navbar = ({ onToggleSidebar }) => {
  const [backendStatus, setBackendStatus] = useState({ online: false, geminiLive: false });

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await api.checkHealth();
        if (res.data && res.data.status === "online") {
          setBackendStatus({ online: true, geminiLive: res.data.geminiLive });
        }
      } catch (e) {
        setBackendStatus({ online: false, geminiLive: false });
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="d-flex align-items-center justify-content-between pb-4 mb-2">
      <div className="d-flex align-items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="btn btn-outline-secondary d-lg-none p-2 border-0 rounded-3"
          aria-label="Toggle Sidebar"
        >
          <Menu size={22} />
        </button>
        <div>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill" style={{ fontSize: "0.75rem" }}>
            v1.0 AI Placement & Career Platform
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-white border shadow-sm" style={{ fontSize: "0.8rem" }}>
          {backendStatus.online ? (
            backendStatus.geminiLive ? (
              <>
                <Sparkles size={14} className="text-primary" />
                <span className="fw-semibold text-primary">Gemini 3.8 Flash Active</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} className="text-success" />
                <span className="fw-medium text-dark">Smart AI Mode</span>
              </>
            )
          ) : (
            <>
              <AlertTriangle size={14} className="text-warning" />
              <span className="text-secondary">Backend Starting...</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
