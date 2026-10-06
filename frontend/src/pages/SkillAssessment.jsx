import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Target, 
  BookOpen, 
  Award,
  RefreshCw,
  Play,
  Clock,
  HelpCircle,
  Zap
} from "lucide-react";
import { useStudent } from "../context/StudentContext";
import { ProgressBar } from "../components/common/ProgressBar";
import SkillQuizModal from "../components/profile/SkillQuizModal";
import api from "../services/api";

const SkillAssessment = () => {
  const { profile, setTargetCareer, updateSkillLevel } = useStudent();
  const { skills, targetCareer } = profile;

  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedQuizSkill, setSelectedQuizSkill] = useState(null);

  const careerOptions = [
    "AI/ML Engineer",
    "Data Scientist",
    "Full Stack Developer",
    "Cloud Engineer",
    "Data Analyst"
  ];

  const fetchGapAnalysis = async (selectedRole) => {
    setLoading(true);
    try {
      const res = await api.analyzeSkillGap(skills, selectedRole || targetCareer);
      if (res.data && res.data.data) {
        setGapData(res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch gap analysis", e);
    } finally {
      setLoading(false);
    }
  };

  const skillsKey = (skills || []).map((s) => `${s.name}:${s.level}`).join("|");

  useEffect(() => {
    fetchGapAnalysis(targetCareer);
  }, [targetCareer, skillsKey]);

  const handleCareerChange = (newCareer) => {
    setTargetCareer(newCareer);
  };

  const getPriorityBadge = (priority) => {
    if (priority === "High") {
      return <span className="badge badge-soft-danger rounded-pill px-2.5 py-1">High</span>;
    }
    if (priority === "Medium") {
      return <span className="badge badge-soft-warning rounded-pill px-2.5 py-1">Medium</span>;
    }
    return <span className="badge badge-soft-success rounded-pill px-2.5 py-1">Low</span>;
  };

  const gapAnalysisList = gapData?.gapAnalysis || [
    { skill: "Python", current: 80, required: 90, gap: -10, priority: "Medium" },
    { skill: "Machine Learning", current: 30, required: 85, gap: -55, priority: "High" },
    { skill: "Statistics", current: 40, required: 80, gap: -40, priority: "High" },
    { skill: "TensorFlow", current: 20, required: 70, gap: -50, priority: "High" },
    { skill: "SQL", current: 75, required: 75, gap: 0, priority: "Low" },
    { skill: "Data Analysis", current: 50, required: 65, gap: -15, priority: "Medium" }
  ];

  const requiredSkillsList = gapData?.requiredSkills || [
    { name: "Python", required: 90 },
    { name: "Machine Learning", required: 85 },
    { name: "Statistics", required: 80 },
    { name: "TensorFlow", required: 70 },
    { name: "SQL", required: 75 },
    { name: "Data Analysis", required: 65 }
  ];

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">Skill Assessment & Skill Gap</h3>
          <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
            Analyze your current skills and identify gaps for your dream career.
          </p>
        </div>

        {/* Target Career Dropdown */}
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold text-secondary small text-nowrap">Target Career:</label>
          <select 
            value={targetCareer} 
            onChange={(e) => handleCareerChange(e.target.value)}
            className="form-select rounded-3 border fw-bold text-primary shadow-sm"
            style={{ minWidth: "200px" }}
          >
            {careerOptions.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 1: Current vs Required Skills */}
      <div className="row g-4 mb-4">
        {/* Current Skill Overview */}
        <div className="col-lg-6">
          <div className="custom-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title-main mb-0">Current Skill Overview</h6>
              <span className="text-primary small fw-semibold">View All Skills →</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {gapAnalysisList.map((item) => (
                <div key={item.skill}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold text-dark small d-flex align-items-center gap-2">
                      {item.skill}
                      <button
                        onClick={() => setSelectedQuizSkill(item.skill)}
                        className="btn btn-xs btn-outline-primary py-0 px-2 rounded-pill"
                        style={{ fontSize: "0.65rem" }}
                      >
                        Test Skill
                      </button>
                    </span>
                    <span className="fw-bold text-dark small">{item.current}%</span>
                  </div>
                  <ProgressBar percentage={item.current} color="#2563eb" showLabel={false} height={7} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Required Skills for Target Career */}
        <div className="col-lg-6">
          <div className="custom-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title-main mb-0">Required Skills for {targetCareer}</h6>
              <span className="text-success small fw-semibold">View All Required Skills →</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {requiredSkillsList.map((item) => (
                <div key={item.name}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold text-dark small">{item.name}</span>
                    <span className="fw-bold text-dark small">{item.required}%</span>
                  </div>
                  <ProgressBar percentage={item.required} color="#10b981" showLabel={false} height={7} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Skill Gap Analysis Table & AI Improvement Suggestions */}
      <div className="row g-4 mb-4">
        {/* Table */}
        <div className="col-lg-8">
          <div className="custom-card h-100">
            <h6 className="card-title-main mb-3">Skill Gap Analysis</h6>

            <div className="table-responsive">
              <table className="table align-middle table-hover mb-0">
                <thead className="table-light">
                  <tr style={{ fontSize: "0.8rem", color: "#64748b" }}>
                    <th scope="col" className="border-0">Skill</th>
                    <th scope="col" className="border-0 text-center">Current</th>
                    <th scope="col" className="border-0 text-center">Required</th>
                    <th scope="col" className="border-0 text-center">Gap</th>
                    <th scope="col" className="border-0 text-center">Priority</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "0.85rem" }}>
                  {gapAnalysisList.map((row) => (
                    <tr key={row.skill}>
                      <td className="fw-bold text-dark">{row.skill}</td>
                      <td className="text-center text-muted">{row.current}%</td>
                      <td className="text-center text-muted">{row.required}%</td>
                      <td className="text-center">
                        <span className={`fw-bold ${row.gap < 0 ? "text-danger" : "text-success"}`}>
                          {row.gap > 0 ? `+${row.gap}%` : `${row.gap}%`}
                        </span>
                      </td>
                      <td className="text-center">{getPriorityBadge(row.priority)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Improvement Suggestions */}
        <div className="col-lg-4">
          <div className="custom-card h-100 ai-insight-box">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Sparkles className="text-primary" size={20} />
              <h6 className="fw-bold text-dark mb-0">AI Improvement Suggestions</h6>
            </div>
            
            <p className="text-secondary small mb-3">
              Based on your profile, here's what you should focus on:
            </p>

            <ol className="ps-3 mb-3 d-flex flex-column gap-2 small text-dark">
              {(gapData?.suggestions || [
                "Strengthen Machine Learning Fundamentals",
                "Improve Statistics and Probability",
                "Learn TensorFlow for deep learning",
                "Work on real-world ML projects",
                "Practice with Kaggle datasets"
              ]).map((sug, idx) => (
                <li key={idx} className="fw-medium">{sug}</li>
              ))}
            </ol>

            <div className="p-2.5 rounded-3 bg-white border small fw-semibold text-danger d-flex align-items-center gap-2">
              <AlertCircle size={15} />
              Focus on High Priority gaps first!
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Separated Skill Tests Center (Individual Tests for Every Skill) */}
      <div className="custom-card mb-4 border-0 shadow-sm" style={{ background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)" }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 pb-3 border-bottom gap-2">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge bg-primary text-white rounded-pill px-2.5 py-1 small">
                <Zap size={13} className="me-1 inline" /> Real-Time Testing Engine
              </span>
              <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2.5 py-1 small">
                12 Technical Tests Available
              </span>
            </div>
            <h5 className="fw-bold text-dark mb-1">Separated Skill Tests Center</h5>
            <p className="text-secondary small mb-0">
              Every skill has a dedicated, multi-question certification test with a 5-minute timer. Scores sync to your profile and recompute career fit in real time.
            </p>
          </div>
        </div>

        {/* Skill Test Cards Grid */}
        <div className="row g-3">
          {skills.map((s) => (
            <div key={s.name} className="col-md-6 col-xl-4">
              <div className="p-3 bg-white rounded-3 border h-100 d-flex flex-column justify-content-between shadow-2xs hover-shadow transition">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="fw-bold text-dark fs-6">{s.name}</span>
                    {s.verified ? (
                      <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1 small d-flex align-items-center gap-1">
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    ) : (
                      <span className="badge bg-light text-secondary border rounded-pill px-2 py-1 small">
                        Unverified
                      </span>
                    )}
                  </div>

                  <div className="d-flex justify-content-between text-muted small mb-1">
                    <span>Proficiency</span>
                    <span className="fw-bold text-dark">{s.level}%</span>
                  </div>
                  <ProgressBar percentage={s.level} color={s.verified ? "#10b981" : "#3b82f6"} showLabel={false} height={6} />

                  <div className="d-flex align-items-center gap-3 mt-3 text-secondary small" style={{ fontSize: "0.75rem" }}>
                    <span className="d-flex align-items-center gap-1">
                      <HelpCircle size={13} /> 5-8 Questions
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <Clock size={13} /> 5 Mins
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedQuizSkill(s.name)}
                  className={`btn btn-sm w-100 mt-3 rounded-3 fw-semibold d-flex align-items-center justify-content-center gap-2 ${
                    s.verified 
                      ? "btn-outline-primary" 
                      : "btn-primary shadow-sm"
                  }`}
                >
                  <Play size={14} />
                  {s.verified ? "Retake Skill Test" : "Start Skill Test"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Priority Learning Path */}
      <div className="custom-card">
        <h6 className="card-title-main mb-4">Priority Learning Path</h6>

        <div className="roadmap-timeline d-none d-md-flex">
          {[
            { step: 1, title: "Statistics Fundamentals" },
            { step: 2, title: "Machine Learning Basics" },
            { step: 3, title: "Deep Learning with TensorFlow" },
            { step: 4, title: "Projects & Practice" },
            { step: 5, title: "Advanced Topics" }
          ].map((item, idx) => (
            <div key={item.step} className="roadmap-step">
              <div className="step-circle completed">
                <CheckCircle2 size={18} />
              </div>
              <div className="step-title">{item.title}</div>
            </div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="d-flex flex-column gap-2 d-md-none">
          {[
            "1. Statistics Fundamentals",
            "2. Machine Learning Basics",
            "3. Deep Learning with TensorFlow",
            "4. Projects & Practice",
            "5. Advanced Topics"
          ].map((item, idx) => (
            <div key={idx} className="p-2.5 bg-light rounded-3 border small fw-semibold text-dark">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Skill Quiz Modal */}
      <SkillQuizModal
        isOpen={Boolean(selectedQuizSkill)}
        onClose={() => setSelectedQuizSkill(null)}
        skillName={selectedQuizSkill}
        onSkillUpdated={(name, score) => updateSkillLevel(name, score, true)}
      />
    </div>
  );
};

export default SkillAssessment;
