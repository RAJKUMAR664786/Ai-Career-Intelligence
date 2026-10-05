import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StudentProvider } from "./context/StudentContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/auth/LoginPage";
import Layout from "./components/layout/Layout";
import DashboardOverview from "./pages/DashboardOverview";
import StudentProfile from "./pages/StudentProfile";
import AcademicAnalyzer from "./pages/AcademicAnalyzer";
import SkillAssessment from "./pages/SkillAssessment";
import CareerRecommendation from "./pages/CareerRecommendation";
import CareerReadiness from "./pages/CareerReadiness";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <AuthProvider>
      <StudentProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Navigate to="/login" replace />} />

          {/* Protected Application Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="academic" element={<AcademicAnalyzer />} />
            <Route path="skills" element={<SkillAssessment />} />
            <Route path="career" element={<CareerRecommendation />} />
            <Route path="readiness" element={<CareerReadiness />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;
