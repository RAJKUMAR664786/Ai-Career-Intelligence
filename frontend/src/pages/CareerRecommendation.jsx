import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  BookOpen, 
  Clock, 
  ExternalLink,
  Award,
  RefreshCw
} from "lucide-react";
import { useStudent } from "../context/StudentContext";
import { CircularGauge, ProgressBar } from "../components/common/ProgressBar";
import api from "../services/api";

const CareerRecommendation = () => {
  const { profile } = useStudent();
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await api.getCareerRecommendations(profile);
      if (res.data && res.data.data) {
        setCareerData(res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch career recommendations", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const topMatches = careerData?.topMatches || [
    { role: "AI/ML Engineer", fitPercentage: 94, isTopMatch: true },
    { role: "Data Scientist", fitPercentage: 91, isTopMatch: false },
    { role: "Full Stack Developer", fitPercentage: 88, isTopMatch: false },
    { role: "Data Analyst", fitPercentage: 84, isTopMatch: false },
    { role: "Cloud Engineer", fitPercentage: 82, isTopMatch: false }
  ];

  const whyPoints = careerData?.whyThisCareer?.points || [
    "Strong Python programming skills",
    "Good problem solving ability",
    "Interest in AI/ML field",
    "Relevant projects completed",
    "Good academic performance",
    "High learning aptitude"
  ];

  const roadmapPhases = careerData?.roadmap || [
    { phase: 1, title: "Python & Math", duration: "4-6 weeks", status: "Completed" },
    { phase: 2, title: "Statistics", duration: "4-6 weeks", status: "Completed" },
    { phase: 3, title: "Machine Learning", duration: "6-8 weeks", status: "In Progress" },
    { phase: 4, title: "Deep Learning", duration: "6-8 weeks", status: "Upcoming" },
    { phase: 5, title: "Projects", duration: "4-6 weeks", status: "Upcoming" },
    { phase: 6, title: "Deployment", duration: "2-4 weeks", status: "Upcoming" }
  ];

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Career Recommendation</h3>
          <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
            AI-powered career recommendations based on your profile.
          </p>
        </div>

        <button 
          onClick={fetchRecommendations} 
          disabled={loading}
          className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5"
        >
          <RefreshCw size={14} className={loading ? "spin-animation" : ""} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Row 1: Top Matches, Why Career & Fit Score */}
      <div className="row g-4 mb-4">
        {/* Top Career Matches */}
        <div className="col-lg-4">
          <div className="custom-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title-main mb-0">Top Career Matches</h6>
            </div>

            <div className="d-flex flex-column gap-3">
              {topMatches.map((item) => (
                <div key={item.role}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-dark small">{item.role}</span>
                    <span className="fw-bold text-dark small">{item.fitPercentage}%</span>
                  </div>
                  <ProgressBar 
                    percentage={item.fitPercentage} 
                    color={item.fitPercentage >= 90 ? "#10b981" : "#2563eb"} 
                    showLabel={false} 
                    height={7} 
                  />
                </div>
              ))}
            </div>

            <div className="mt-3 text-center">
              <span className="text-primary small fw-semibold" style={{ cursor: "pointer" }}>
                View All Careers →
              </span>
            </div>
          </div>
        </div>

        {/* Why AI/ML Engineer? Card with AI Mascot */}
        <div className="col-lg-4">
          <div className="custom-card h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h6 className="card-title-main mb-0">Why AI/ML Engineer?</h6>
                <div className="ai-mascot-badge">
                  🤖
                </div>
              </div>

              <div className="d-flex flex-column gap-2 mb-3">
                {whyPoints.map((pt, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-2 small text-dark fw-medium">
                    <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-primary small fw-semibold" style={{ cursor: "pointer" }}>
                View Detailed Analysis →
              </span>
            </div>
          </div>
        </div>

        {/* Career Fit Score Donut */}
        <div className="col-lg-4">
          <div className="custom-card h-100 text-center">
            <h6 className="card-title-main text-start mb-3">Career Fit Score</h6>

            <div className="py-2 d-flex flex-column align-items-center">
              <CircularGauge 
                value={94} 
                size={130} 
                strokeWidth={12} 
                color="#10b981" 
                sublabel="Excellent Fit"
              />

              <div className="row g-2 w-100 text-start mt-3 px-2">
                <div className="col-6">
                  <div className="d-flex align-items-center gap-1.5 small">
                    <span className="rounded-circle" style={{ width: "8px", height: "8px", backgroundColor: "#2563eb" }}></span>
                    <span className="text-muted">Skills: <strong>40%</strong></span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-1.5 small">
                    <span className="rounded-circle" style={{ width: "8px", height: "8px", backgroundColor: "#06b6d4" }}></span>
                    <span className="text-muted">Academic: <strong>25%</strong></span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-1.5 small">
                    <span className="rounded-circle" style={{ width: "8px", height: "8px", backgroundColor: "#10b981" }}></span>
                    <span className="text-muted">Interests: <strong>20%</strong></span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center gap-1.5 small">
                    <span className="rounded-circle" style={{ width: "8px", height: "8px", backgroundColor: "#f59e0b" }}></span>
                    <span className="text-muted">Projects: <strong>15%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Personalized Learning Roadmap */}
      <div className="custom-card mb-4">
        <h6 className="card-title-main mb-2">
          Your Personalized Learning Roadmap - <span className="text-primary">AI/ML Engineer</span>
        </h6>

        {/* Stepper Timeline */}
        <div className="roadmap-timeline d-none d-md-flex">
          {roadmapPhases.map((phase) => {
            const isCompleted = phase.status === "Completed";
            const isInProgress = phase.status === "In Progress";
            return (
              <div key={phase.phase} className="roadmap-step">
                <div className={`step-circle ${isCompleted ? "completed" : isInProgress ? "in-progress" : ""}`}>
                  {isCompleted ? <CheckCircle2 size={18} /> : phase.phase}
                </div>
                <div className="step-title">Phase {phase.phase}</div>
                <div className="fw-semibold text-dark small">{phase.title}</div>
                <div className="step-duration">{phase.duration}</div>
                <span className={`badge step-badge ${
                  isCompleted ? "bg-success-subtle text-success" : isInProgress ? "bg-primary-subtle text-primary" : "bg-light text-muted"
                }`}>
                  {phase.status}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile View */}
        <div className="d-flex flex-column gap-2 d-md-none mb-3">
          {roadmapPhases.map((phase) => (
            <div key={phase.phase} className="p-3 bg-light rounded-3 border d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-bold text-dark small">Phase {phase.phase}: {phase.title}</div>
                <div className="text-muted small">{phase.duration}</div>
              </div>
              <span className="badge bg-primary-subtle text-primary">{phase.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Current Focus, Resources, Estimated Completion */}
      <div className="row g-4">
        {/* Current Focus */}
        <div className="col-lg-4">
          <div className="custom-card h-100">
            <h6 className="card-title-main mb-3">Current Focus</h6>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="fw-bold text-dark">Machine Learning</span>
              <span className="fw-bold text-primary">65%</span>
            </div>
            <ProgressBar percentage={65} color="#2563eb" showLabel={false} height={8} />
            <div className="mt-3 text-secondary small">
              Next: <strong className="text-dark">Linear Regression & Regularization</strong>
            </div>
          </div>
        </div>

        {/* Recommended Resources */}
        <div className="col-lg-5">
          <div className="custom-card h-100">
            <h6 className="card-title-main mb-3">Recommended Resources</h6>
            <div className="row g-2 text-center">
              <div className="col-3">
                <a href="https://coursera.org" target="_blank" rel="noreferrer" className="text-decoration-none">
                  <div className="p-2.5 bg-light rounded-3 border h-100 d-flex flex-column align-items-center">
                    <span className="fs-4">C</span>
                    <span className="text-dark fw-bold" style={{ fontSize: "0.75rem" }}>Coursera</span>
                    <span className="text-muted" style={{ fontSize: "0.65rem" }}>ML Course</span>
                  </div>
                </a>
              </div>
              <div className="col-3">
                <a href="https://kaggle.com" target="_blank" rel="noreferrer" className="text-decoration-none">
                  <div className="p-2.5 bg-light rounded-3 border h-100 d-flex flex-column align-items-center">
                    <span className="fs-4">k</span>
                    <span className="text-dark fw-bold" style={{ fontSize: "0.75rem" }}>Kaggle</span>
                    <span className="text-muted" style={{ fontSize: "0.65rem" }}>Practice</span>
                  </div>
                </a>
              </div>
              <div className="col-3">
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-decoration-none">
                  <div className="p-2.5 bg-light rounded-3 border h-100 d-flex flex-column align-items-center">
                    <span className="fs-4">▶</span>
                    <span className="text-dark fw-bold" style={{ fontSize: "0.75rem" }}>YouTube</span>
                    <span className="text-muted" style={{ fontSize: "0.65rem" }}>Tutorials</span>
                  </div>
                </a>
              </div>
              <div className="col-3">
                <div className="p-2.5 bg-light rounded-3 border h-100 d-flex flex-column align-items-center">
                  <span className="fs-4">📚</span>
                  <span className="text-dark fw-bold" style={{ fontSize: "0.75rem" }}>Books</span>
                  <span className="text-muted" style={{ fontSize: "0.65rem" }}>& Articles</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Completion */}
        <div className="col-lg-3">
          <div className="custom-card h-100 text-center d-flex flex-column justify-content-center">
            <h6 className="card-title-main text-center mb-1">Estimated Completion</h6>
            <div className="fs-2 fw-extrabold text-primary my-2">~ 6 Months</div>
            <p className="text-muted small mb-0">To become industry ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerRecommendation;
