import React, { useState } from "react";
import { 
  FileText, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Play, 
  Sparkles,
  ExternalLink,
  Award,
  History
} from "lucide-react";
import ResumeUploader from "../components/resume/ResumeUploader";
import InterviewChat from "../components/interview/InterviewChat";
import { CircularGauge, ProgressBar } from "../components/common/ProgressBar";

const CareerReadiness = () => {
  const [activeTab, setActiveTab] = useState("resume"); // "resume" | "interview"
  const [isInterviewActive, setIsInterviewActive] = useState(false);

  // Quick Start Form state
  const [selectedRole, setSelectedRole] = useState("Full Stack Developer");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Intermediate");
  const [selectedType, setSelectedType] = useState("Technical + HR");

  // Resume analysis state
  const [resumeData, setResumeData] = useState({
    resumeScore: 84,
    scoreVerdict: "Good Score",
    scoreMessage: "Your resume is good! Continue improving.",
    skillsDetected: ["Python", "React", "SQL", "JavaScript", "MongoDB", "HTML", "CSS", "Git"],
    missingSkills: ["REST APIs", "System Design", "Docker", "AWS"],
    feedbackBreakdown: [
      { category: "Content Quality", score: 82 },
      { category: "Structure", score: 78 },
      { category: "Projects", score: 85 },
      { category: "Skills", score: 88 },
      { category: "Overall Impact", score: 84 }
    ],
    improvementSuggestions: [
      "Add more quantifiable achievements",
      "Include industry-relevant keywords",
      "Improve project descriptions",
      "Add technical skills section",
      "Include certifications"
    ]
  });

  const recentInterviews = [
    { role: "Full Stack Developer", date: "May 20, 2024", score: 82 },
    { role: "Data Scientist", date: "May 18, 2024", score: 78 },
    { role: "AI/ML Engineer", date: "May 15, 2024", score: 85 }
  ];

  const handleStartInterview = () => {
    setIsInterviewActive(true);
  };

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">Career Readiness</h3>
          <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
            Prepare for your dream career with AI-powered tools.
          </p>
        </div>

        {/* Tab Toggle */}
        {!isInterviewActive && (
          <div className="btn-group p-1 bg-white rounded-pill border shadow-sm" role="group">
            <button
              onClick={() => setActiveTab("resume")}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${
                activeTab === "resume" ? "btn-primary shadow-sm" : "btn-light text-secondary border-0"
              }`}
            >
              <FileText size={15} className="me-1.5" /> Resume Analyzer
            </button>
            <button
              onClick={() => setActiveTab("interview")}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold ${
                activeTab === "interview" ? "btn-primary shadow-sm" : "btn-light text-secondary border-0"
              }`}
            >
              <Bot size={15} className="me-1.5" /> AI Mock Interview
            </button>
          </div>
        )}
      </div>

      {/* When live interview is started */}
      {isInterviewActive ? (
        <InterviewChat 
          role={selectedRole}
          difficulty={selectedDifficulty}
          interviewType={selectedType}
          onBack={() => setIsInterviewActive(false)}
        />
      ) : activeTab === "interview" ? (
        /* Full Mock Interview Launchpad */
        <div className="row g-4 justify-content-center">
          <div className="col-lg-7">
            <div className="custom-card p-4 text-center">
              <div 
                className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                style={{ width: "70px", height: "70px", backgroundColor: "#eff6ff", color: "#2563eb" }}
              >
                <Bot size={36} />
              </div>
              <h4 className="fw-bold text-dark">AI Technical & HR Mock Interview</h4>
              <p className="text-secondary small mb-4">
                Test your skills with Gemini AI. Answer progressive questions via text or voice and receive an instant rubric scorecard.
              </p>

              <div className="row g-3 text-start mb-4">
                <div className="col-12">
                  <label className="form-label small fw-bold text-dark">Target Role</label>
                  <select 
                    value={selectedRole} 
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="form-select rounded-3 py-2"
                  >
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="AI/ML Engineer">AI/ML Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Cloud Engineer">Cloud Engineer</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-dark">Difficulty Level</label>
                  <select 
                    value={selectedDifficulty} 
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="form-select rounded-3 py-2"
                  >
                    <option value="Beginner">Junior / Fresher</option>
                    <option value="Intermediate">Intermediate (Campus / Off-campus)</option>
                    <option value="Advanced">Advanced (Product Tier 1)</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-dark">Interview Type</label>
                  <select 
                    value={selectedType} 
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="form-select rounded-3 py-2"
                  >
                    <option value="Technical + HR">Technical + HR (Comprehensive)</option>
                    <option value="Technical Only">Technical Architecture Only</option>
                    <option value="HR & Behavioral">HR & Behavioral (STAR)</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleStartInterview} 
                className="btn btn-primary btn-lg w-100 rounded-3 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2"
              >
                <Play size={18} /> Launch Mock Interview Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Resume Analyzer Screen (Default View matching Mockup 5) */
        <>
          {/* Row 1: Upload Card, Resume Score & Skills Chips */}
          <div className="row g-4 mb-4">
            {/* Upload Area */}
            <div className="col-lg-4">
              <div className="custom-card h-100">
                <h6 className="card-title-main mb-3">Resume Analysis</h6>
                <ResumeUploader onAnalysisComplete={(data) => setResumeData(data)} />
              </div>
            </div>

            {/* Resume Score Gauge */}
            <div className="col-lg-4">
              <div className="custom-card h-100 text-center d-flex flex-column justify-content-center">
                <h6 className="card-title-main text-start mb-2">Resume Score</h6>

                <div className="py-2 d-flex flex-column align-items-center">
                  <CircularGauge 
                    value={resumeData.resumeScore} 
                    size={140} 
                    strokeWidth={12} 
                    color="#10b981" 
                    sublabel="Good Score"
                  />
                  <div className="text-muted small mt-2">
                    {resumeData.scoreMessage || "Your resume is good! Continue improving."}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Detected & Missing Skills */}
            <div className="col-lg-4">
              <div className="custom-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="card-title-main mb-2">Skills Detected</h6>
                  <div className="d-flex flex-wrap gap-1.5 mb-4">
                    {resumeData.skillsDetected.map((sk) => (
                      <span key={sk} className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1.5 rounded-3 fw-semibold small">
                        {sk}
                      </span>
                    ))}
                  </div>

                  <h6 className="card-title-main mb-2">Missing / Recommended Skills</h6>
                  <div className="d-flex flex-wrap gap-1.5">
                    {resumeData.missingSkills.map((sk) => (
                      <span key={sk} className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1.5 rounded-3 fw-semibold small">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Resume Feedback, Improvement Suggestions, Quick Interview, Recent History */}
          <div className="row g-4">
            {/* Resume Feedback Progress Bars */}
            <div className="col-lg-3">
              <div className="custom-card h-100">
                <h6 className="card-title-main mb-3">Resume Feedback</h6>
                <div className="d-flex flex-column gap-2.5">
                  {resumeData.feedbackBreakdown.map((item) => (
                    <div key={item.category}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-secondary small fw-medium">{item.category}</span>
                        <span className="fw-bold text-dark small">{item.score}/100</span>
                      </div>
                      <ProgressBar percentage={item.score} color="#10b981" showLabel={false} height={6} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="col-lg-3">
              <div className="custom-card h-100">
                <h6 className="card-title-main mb-3">Improvement Suggestions</h6>
                <ul className="mb-0 ps-3 small text-dark d-flex flex-column gap-2">
                  {resumeData.improvementSuggestions.map((sug, idx) => (
                    <li key={idx} className="fw-medium">{sug}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quick AI Mock Interview Widget */}
            <div className="col-lg-3">
              <div className="custom-card h-100">
                <h6 className="card-title-main mb-2">AI Mock Interview</h6>
                <p className="text-muted small mb-3">Start a mock interview to test your skills</p>

                <div className="d-flex flex-column gap-2 mb-3">
                  <div>
                    <label className="text-muted" style={{ fontSize: "0.75rem" }}>Career Role</label>
                    <select 
                      value={selectedRole} 
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="form-select form-select-sm rounded-2"
                    >
                      <option value="Full Stack Developer">Full Stack Developer</option>
                      <option value="AI/ML Engineer">AI/ML Engineer</option>
                      <option value="Data Scientist">Data Scientist</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted" style={{ fontSize: "0.75rem" }}>Difficulty Level</label>
                    <select 
                      value={selectedDifficulty} 
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="form-select form-select-sm rounded-2"
                    >
                      <option value="Intermediate">Intermediate</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-muted" style={{ fontSize: "0.75rem" }}>Interview Type</label>
                    <select 
                      value={selectedType} 
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="form-select form-select-sm rounded-2"
                    >
                      <option value="Technical + HR">Technical + HR</option>
                      <option value="Technical Only">Technical Only</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleStartInterview} 
                  className="btn btn-primary btn-sm w-100 rounded-3 py-2 fw-semibold"
                >
                  Start Interview
                </button>
              </div>
            </div>

            {/* Recent Interviews History */}
            <div className="col-lg-3">
              <div className="custom-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <h6 className="card-title-main mb-3">Recent Interviews</h6>
                  <div className="d-flex flex-column gap-2.5">
                    {recentInterviews.map((item, idx) => (
                      <div key={idx} className="p-2.5 bg-light rounded-3 border d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold text-dark small d-flex align-items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-success" />
                            {item.role}
                          </div>
                          <div className="text-muted" style={{ fontSize: "0.7rem" }}>
                            {item.date} • <strong className="text-dark">Score: {item.score}%</strong>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedRole(item.role);
                            setIsInterviewActive(true);
                          }}
                          className="btn btn-link text-primary p-0 small text-decoration-none" 
                          style={{ fontSize: "0.75rem" }}
                        >
                          View Report
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className="text-primary small fw-semibold" style={{ cursor: "pointer" }}>
                    View All Interviews →
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CareerReadiness;
