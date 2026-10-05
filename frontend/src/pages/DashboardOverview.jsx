import React from "react";
import { Link } from "react-router-dom";
import { 
  UserCircle, 
  GraduationCap, 
  Cpu, 
  Target, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  Award
} from "lucide-react";
import { useStudent } from "../context/StudentContext";
import { useAuth } from "../context/AuthContext";
import MetricCard from "../components/common/MetricCard";
import { CircularGauge } from "../components/common/ProgressBar";

const DashboardOverview = () => {
  const { profile } = useStudent();
  const { currentUser, userProfile } = useAuth();
  const { personalInfo, academicInfo, targetCareer } = profile;

  const greetingName = userProfile?.fullName || personalInfo.name || currentUser?.displayName || currentUser?.email?.split("@")[0] || "Student";

  return (
    <div className="container-fluid p-0">
      {/* Welcome Banner */}
      <div 
        className="p-4 p-md-5 rounded-4 mb-4 text-white position-relative overflow-hidden shadow-sm"
        style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
      >
        <div className="row align-items-center">
          <div className="col-lg-8">
            <span className="badge bg-primary px-3 py-1.5 rounded-pill mb-3 fw-semibold">
              <Sparkles size={14} className="me-1" /> Student Career Intelligence Platform
            </span>
            <h2 className="fw-extrabold mb-2" style={{ letterSpacing: "-0.5px" }}>
              Welcome back, {greetingName}! 🚀
            </h2>
            <p className="text-light opacity-75 mb-4" style={{ maxWidth: "600px" }}>
              “Transforming Student Data into Personalized Career Success.” Your current target career is set to{" "}
              <strong className="text-info">{targetCareer}</strong> with a <strong className="text-success">94% Fit Score</strong>.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/career" className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm">
                View Career Match & Roadmap
              </Link>
              <Link to="/readiness" className="btn btn-outline-light px-4 py-2 rounded-pill fw-semibold">
                Practice AI Mock Interview
              </Link>
            </div>
          </div>
          <div className="col-lg-4 text-center mt-4 mt-lg-0">
            <div className="d-inline-block p-3 rounded-4 bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-10">
              <div className="text-light opacity-75 small mb-2">Overall Career Readiness</div>
              <CircularGauge value={84} size={110} strokeWidth={10} color="#10b981" textColor="#ffffff" />
              <div className="mt-2 text-success fw-bold small">Campus Placement Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <MetricCard
            label="Cumulative CGPA"
            value={academicInfo.cgpa}
            subtext="/ 10"
            badgeText="Consistent Growth"
            badgeType="success"
            icon={GraduationCap}
          />
        </div>
        <div className="col-6 col-md-3">
          <MetricCard
            label="Current Attendance"
            value={`${academicInfo.attendance}%`}
            badgeText="Safe Zone (>85%)"
            badgeType="success"
            icon={CheckCircle2}
          />
        </div>
        <div className="col-6 col-md-3">
          <MetricCard
            label="Verified Skills"
            value={profile.skills.filter(s => s.level >= 70).length}
            subtext={`of ${profile.skills.length}`}
            badgeText="Industry Benchmarked"
            badgeType="primary"
            icon={Cpu}
          />
        </div>
        <div className="col-6 col-md-3">
          <MetricCard
            label="ATS Resume Score"
            value="84"
            subtext="/ 100"
            badgeText="Good Score"
            badgeType="success"
            icon={Briefcase}
          />
        </div>
      </div>

      {/* 5 Modules Navigation Cards Grid */}
      <h5 className="fw-bold text-dark mb-3">5 Core Intelligence Modules</h5>
      <div className="row g-4 mb-4">
        {/* Card 1 */}
        <div className="col-md-6 col-lg-4">
          <div className="custom-card h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-3 p-2.5 bg-primary-subtle text-primary">
                  <UserCircle size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">1. Student Profile</h6>
                  <span className="text-muted small">Comprehensive profile foundation</span>
                </div>
              </div>
              <p className="text-secondary small mb-3">
                Manage personal details, academic metrics, verify technical skills with tests, projects, certifications, and self-assessments.
              </p>
            </div>
            <Link to="/profile" className="text-primary fw-semibold small text-decoration-none d-flex align-items-center gap-1">
              Open Profile <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-md-6 col-lg-4">
          <div className="custom-card h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-3 p-2.5 bg-success-subtle text-success">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">2. Academic Analyzer</h6>
                  <span className="text-muted small">Semester trends & AI diagnostics</span>
                </div>
              </div>
              <p className="text-secondary small mb-3">
                Track GPA progression across semesters, analyze subject strengths, attendance safety zones, and view Gemini academic recommendations.
              </p>
            </div>
            <Link to="/academic" className="text-primary fw-semibold small text-decoration-none d-flex align-items-center gap-1">
              Open Analyzer <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-md-6 col-lg-4">
          <div className="custom-card h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-3 p-2.5 bg-info-subtle text-info">
                  <Cpu size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">3. Skill Gap Analysis</h6>
                  <span className="text-muted small">Current vs required role skills</span>
                </div>
              </div>
              <p className="text-secondary small mb-3">
                Select target role (e.g. AI/ML Engineer), discover exact skill gaps, priority tags (High/Medium/Low), and priority learning paths.
              </p>
            </div>
            <Link to="/skills" className="text-primary fw-semibold small text-decoration-none d-flex align-items-center gap-1">
              Open Skill Gap <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Card 4 */}
        <div className="col-md-6 col-lg-4">
          <div className="custom-card h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-3 p-2.5 bg-warning-subtle text-warning">
                  <Target size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">4. Career AI & Roadmap</h6>
                  <span className="text-muted small">Explainable matches & timeline</span>
                </div>
              </div>
              <p className="text-secondary small mb-3">
                Get suitability scores, understand "Why this career?" with AI explainability, and follow an interactive 6-phase curriculum.
              </p>
            </div>
            <Link to="/career" className="text-primary fw-semibold small text-decoration-none d-flex align-items-center gap-1">
              Open Career AI <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Card 5 */}
        <div className="col-md-6 col-lg-4">
          <div className="custom-card h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-3 p-2.5 bg-danger-subtle text-danger">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h6 className="fw-bold text-dark mb-0">5. Career Readiness</h6>
                  <span className="text-muted small">Resume ATS & AI Mock Interview</span>
                </div>
              </div>
              <p className="text-secondary small mb-3">
                Upload resumes for instant ATS feedback and practice realistic multi-turn technical + HR interviews with Gemini AI.
              </p>
            </div>
            <Link to="/readiness" className="text-primary fw-semibold small text-decoration-none d-flex align-items-center gap-1">
              Open Readiness <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
