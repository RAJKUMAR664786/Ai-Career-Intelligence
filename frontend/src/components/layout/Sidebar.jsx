import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserCircle, 
  GraduationCap, 
  Cpu, 
  Target, 
  Briefcase, 
  Settings, 
  LogOut,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useStudent } from "../../context/StudentContext";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { profile } = useStudent();
  const { currentUser, userProfile, profileMissing, logout } = useAuth();
  const navigate = useNavigate();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Student name and degree priority: check active student profile and auth profile synchronously
  const studentName = profile?.personalInfo?.name || userProfile?.fullName || userProfile?.personalInfo?.name || currentUser?.displayName || currentUser?.email?.split("@")[0] || "Student";
  const studentCourse = profile?.personalInfo?.degree || userProfile?.course || userProfile?.personalInfo?.degree || (profileMissing ? "Setup Pending" : "Engineering Student");
  const studentAvatarChar = studentName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setShowLogoutConfirm(false);
      navigate("/login", { replace: true });
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/profile", label: "Student Profile", icon: UserCircle },
    { path: "/academic", label: "Academic Analyzer", icon: GraduationCap },
    { path: "/skills", label: "Skill Assessment", icon: Cpu },
    { path: "/career", label: "Career Recommendation", icon: Target },
    { path: "/readiness", label: "Career Readiness", icon: Briefcase },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <div className="fw-bold" style={{ fontSize: "1.05rem", letterSpacing: "-0.3px" }}>
            AI Career
          </div>
          <div style={{ fontSize: "0.75rem", color: "#60a5fa", fontWeight: 600, letterSpacing: "0.5px" }}>
            INTELLIGENCE
          </div>
        </div>
      </div>

      <ul className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path} className="sidebar-item">
              <NavLink
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <div className="user-badge mb-2">
          <div className="user-avatar">
            {studentAvatarChar}
          </div>
          <div className="flex-grow-1 overflow-hidden">
            <div className="text-white fw-bold text-truncate" style={{ fontSize: "0.85rem" }}>
              {studentName}
            </div>
            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }} className="text-truncate">
              {studentCourse}
            </div>
          </div>
        </div>

        <button 
          onClick={() => setShowLogoutConfirm(true)} 
          className="btn btn-sm w-100 text-start text-danger-subtle border-0 px-2 py-1.5 d-flex align-items-center gap-2 rounded-2"
          style={{ fontSize: "0.82rem", backgroundColor: "rgba(239, 68, 68, 0.1)" }}
          title="Sign out of your student account"
        >
          <LogOut size={15} className="text-danger" />
          <span className="text-white fw-semibold">Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", zIndex: 99999 }}
        >
          <div className="card border-0 shadow-2xl rounded-4 p-4" style={{ maxWidth: "380px", width: "100%", backgroundColor: "#ffffff" }}>
            <div className="d-flex align-items-center gap-2 mb-2 text-danger">
              <AlertCircle size={20} />
              <h6 className="fw-bold mb-0 text-dark">Confirm Logout</h6>
            </div>
            <p className="text-secondary small mb-4">
              Are you sure you want to sign out of <strong>AI Career Intelligence</strong>? Your progress remains safely stored in your student account.
            </p>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="btn btn-light btn-sm px-3 rounded-2 fw-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="btn btn-danger btn-sm px-3 rounded-2 fw-semibold"
              >
                {loggingOut ? "Signing out..." : "Yes, Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

