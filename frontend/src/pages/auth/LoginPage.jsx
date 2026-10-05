import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetSuccessMessage, setResetSuccessMessage] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMessage(result.error || "Failed to sign in. Please verify your credentials.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    const res = await resetPassword(forgotEmail);
    setForgotLoading(false);
    if (res.success) {
      setResetSuccessMessage(res.message);
      setShowForgotModal(false);
    } else {
      setErrorMessage(res.error || "Failed to send reset link.");
    }
  };

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{ backgroundColor: "#0f172a" }}
    >
      <div 
        className="card border-0 shadow-2xl rounded-4 overflow-hidden"
        style={{ maxWidth: "440px", width: "100%", backgroundColor: "#ffffff" }}
      >
        <div className="p-4 p-md-5">
          {/* Brand Logo */}
          <div className="d-flex align-items-center gap-2 mb-4">
            <div 
              className="rounded-3 p-2 d-flex align-items-center justify-content-center shadow-sm"
              style={{ backgroundColor: "#2563eb", color: "#ffffff" }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <div className="fw-bold text-dark fs-5" style={{ letterSpacing: "-0.5px" }}>AI Career</div>
              <div style={{ fontSize: "0.7rem", color: "#2563eb", fontWeight: 700, letterSpacing: "1px" }}>INTELLIGENCE</div>
            </div>
          </div>

          <h4 className="fw-bold text-dark mb-1">Welcome back</h4>
          <p className="text-secondary small mb-4">
            Sign in to access your student dashboard, skill analytics, and AI mock interviews.
          </p>

          {resetSuccessMessage && (
            <div className="alert alert-success border-0 rounded-3 p-2.5 small mb-3 d-flex align-items-center gap-2">
              <CheckCircle2 size={16} className="text-success flex-shrink-0" />
              <span>{resetSuccessMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-danger border-0 rounded-3 p-2.5 small mb-3 d-flex align-items-center gap-2">
              <AlertCircle size={16} className="text-danger flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div>
              <label className="form-label small fw-bold text-dark mb-1">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="form-control bg-light border-start-0 py-2 small"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small fw-bold text-dark mb-0">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="btn btn-link p-0 text-primary small text-decoration-none"
                  style={{ fontSize: "0.75rem" }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control bg-light border-start-0 border-end-0 py-2 small"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-group-text bg-light border-start-0 text-muted"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 mt-2 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", zIndex: 9999 }}
        >
          <div className="card border-0 shadow-2xl rounded-4 p-4" style={{ maxWidth: "400px", width: "100%" }}>
            <h5 className="fw-bold text-dark mb-1">Reset Password</h5>
            <p className="text-muted small mb-3">
              Enter your student email and we'll send a password recovery link.
            </p>
            <form onSubmit={handleForgotPassword} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label small fw-bold text-dark mb-1">Email Address</label>
                <input
                  type="email"
                  className="form-control py-2 small"
                  placeholder="student@example.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="btn btn-light btn-sm px-3 rounded-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="btn btn-primary btn-sm px-3 rounded-2 fw-semibold"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
