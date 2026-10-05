import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Calendar, 
  Award,
  RefreshCw
} from "lucide-react";
import { useStudent } from "../context/StudentContext";
import MetricCard from "../components/common/MetricCard";
import { CircularGauge, ProgressBar } from "../components/common/ProgressBar";
import api from "../services/api";

const AcademicAnalyzer = () => {
  const { profile } = useStudent();
  const { academicInfo } = profile;

  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const fetchInsights = async () => {
    setLoadingAi(true);
    try {
      const res = await api.getAcademicInsights(academicInfo);
      if (res.data && res.data.data) {
        setAiInsights(res.data.data);
      }
    } catch (e) {
      console.error("AI Insights fetch failed", e);
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [academicInfo]);

  const trends = academicInfo.semesterTrends || [
    { semester: "Sem 1", gpa: 7.20 },
    { semester: "Sem 2", gpa: 7.60 },
    { semester: "Sem 3", gpa: 7.90 },
    { semester: "Sem 4", gpa: 8.24 }
  ];

  const subjects = academicInfo.subjectMarks || [
    { name: "Data Structures", score: 87 },
    { name: "Database Management", score: 82 },
    { name: "Web Technology", score: 91 },
    { name: "Operating Systems", score: 78 },
    { name: "Mathematics", score: 71 },
    { name: "Computer Networks", score: 76 }
  ];

  // SVG Line Chart Points calculation
  const maxGpa = 10;
  const minGpa = 6;
  const chartWidth = 400;
  const chartHeight = 160;
  const padding = 30;

  const points = trends.map((t, idx) => {
    const x = padding + (idx * (chartWidth - 2 * padding)) / (trends.length - 1);
    const y = chartHeight - padding - ((t.gpa - minGpa) / (maxGpa - minGpa)) * (chartHeight - 2 * padding);
    return { x, y, gpa: t.gpa, sem: t.semester };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Academic Analyzer</h3>
          <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
            Comprehensive analysis of your academic performance.
          </p>
        </div>
        <button 
          onClick={fetchInsights} 
          disabled={loadingAi}
          className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5"
        >
          <RefreshCw size={14} className={loadingAi ? "spin-animation" : ""} />
          <span>Refresh AI Insights</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <MetricCard
            label="CGPA"
            value={academicInfo.cgpa}
            subtext="/ 10"
            badgeText="Good"
            badgeType="success"
            icon={BookOpen}
          />
        </div>
        <div className="col-6 col-md-3">
          <MetricCard
            label="Attendance"
            value={`${academicInfo.attendance}%`}
            badgeText="Good"
            badgeType="success"
            icon={Calendar}
          />
        </div>
        <div className="col-6 col-md-3">
          <MetricCard
            label="Academic Score"
            value={aiInsights?.academicScore || 82}
            subtext="/ 100"
            badgeText="Good"
            badgeType="success"
            icon={Award}
          />
        </div>
        <div className="col-6 col-md-3">
          <MetricCard
            label="Backlogs"
            value={academicInfo.backlogs}
            badgeText="Excellent"
            badgeType="success"
            icon={TrendingUp}
          />
        </div>
      </div>

      {/* Charts Row: Performance Trend & Subject Analysis */}
      <div className="row g-4 mb-4">
        {/* Performance Trend Chart */}
        <div className="col-lg-6">
          <div className="custom-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title-main mb-0">Performance Trend</h6>
              <span className="badge bg-success-subtle text-success px-2.5 py-1 rounded-pill fw-semibold" style={{ fontSize: "0.75rem" }}>
                📈 Improving Trend
              </span>
            </div>

            <div className="py-2 text-center">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-100" style={{ maxHeight: "210px" }}>
                {/* Horizontal Grid lines */}
                {[6, 7, 8, 9, 10].map((val) => {
                  const y = chartHeight - padding - ((val - minGpa) / (maxGpa - minGpa)) * (chartHeight - 2 * padding);
                  return (
                    <g key={val}>
                      <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
                      <text x={padding - 8} y={y + 4} fontSize="9" fill="#94a3b8" textAnchor="end">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Line Path */}
                <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                {/* Gradient area under line */}
                <path 
                  d={`${pathD} L ${points[points.length - 1].x},${chartHeight - padding} L ${points[0].x},${chartHeight - padding} Z`} 
                  fill="url(#trendGradient)" 
                  opacity="0.15" 
                />

                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Points & Labels */}
                {points.map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
                    <text x={pt.x} y={pt.y - 10} fontSize="10" fontWeight="bold" fill="#0f172a" textAnchor="middle">
                      {pt.gpa.toFixed(2)}
                    </text>
                    <text x={pt.x} y={chartHeight - 10} fontSize="10" fill="#64748b" textAnchor="middle">
                      {pt.sem}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Subject Analysis Bar List */}
        <div className="col-lg-6">
          <div className="custom-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title-main mb-0">Subject Analysis</h6>
              <span className="text-primary small fw-semibold">View All Subjects →</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {subjects.map((subj) => (
                <div key={subj.name}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold text-dark small">{subj.name}</span>
                    <span className="fw-bold text-dark small">{subj.score}%</span>
                  </div>
                  <ProgressBar percentage={subj.score} color="#2563eb" showLabel={false} height={7} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Attendance Donut & AI Academic Insights */}
      <div className="row g-4 mb-4">
        {/* Attendance Analysis Donut */}
        <div className="col-lg-5">
          <div className="custom-card h-100 text-center">
            <h6 className="card-title-main text-start mb-3">Attendance Analysis</h6>

            <div className="py-2 d-flex flex-column align-items-center">
              <CircularGauge 
                value={academicInfo.attendance} 
                size={130} 
                strokeWidth={12} 
                color="#059669" 
              />
              
              <div className="d-flex justify-content-center gap-4 mt-3">
                <div className="d-flex align-items-center gap-1.5">
                  <span className="rounded-circle" style={{ width: "10px", height: "10px", backgroundColor: "#059669" }}></span>
                  <span className="small text-secondary">Present: <strong>{academicInfo.attendance}%</strong></span>
                </div>
                <div className="d-flex align-items-center gap-1.5">
                  <span className="rounded-circle" style={{ width: "10px", height: "10px", backgroundColor: "#cbd5e1" }}></span>
                  <span className="small text-secondary">Absent: <strong>{100 - academicInfo.attendance}%</strong></span>
                </div>
              </div>

              <div className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1.5 rounded-pill mt-3 fw-semibold">
                You are in safe zone. Keep it up!
              </div>
            </div>
          </div>
        </div>

        {/* AI Academic Insights Card */}
        <div className="col-lg-7">
          <div className="custom-card h-100 ai-insight-box">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Sparkles className="text-primary" size={20} />
              <h6 className="fw-bold text-dark mb-0">AI Academic Insights</h6>
            </div>

            <p className="text-dark mb-3" style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
              {aiInsights?.summary || "Your academic performance shows consistent improvement. You have strong conceptual understanding in programming subjects."}
            </p>

            <div className="fw-bold text-dark small mb-2">Focus Areas:</div>
            <ol className="mb-0 ps-3 small text-dark d-flex flex-column gap-1.5">
              {aiInsights?.focusAreas?.map((item, idx) => (
                <li key={idx} className="fw-medium">{item}</li>
              )) || (
                <>
                  <li>Improve Mathematics performance</li>
                  <li>Strengthen Computer Networks</li>
                  <li>Maintain your current momentum</li>
                </>
              )}
            </ol>
          </div>
        </div>
      </div>

      {/* Row 3: Strengths & Areas to Improve */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="custom-card h-100">
            <h6 className="card-title-main text-success mb-3">Strengths</h6>
            <div className="d-flex flex-column gap-2.5">
              {(aiInsights?.strengths || [
                "Programming Skills",
                "Consistent Performance",
                "Good Attendance",
                "Quick Learner"
              ]).map((str, idx) => (
                <div key={idx} className="d-flex align-items-center gap-2 small text-dark fw-medium">
                  <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="custom-card h-100">
            <h6 className="card-title-main text-warning mb-3">Areas to Improve</h6>
            <div className="d-flex flex-column gap-2.5">
              {(aiInsights?.areasToImprove || [
                "Mathematics",
                "Computer Networks",
                "Problem Solving Speed"
              ]).map((area, idx) => (
                <div key={idx} className="d-flex align-items-center gap-2 small text-dark fw-medium">
                  <AlertTriangle size={16} className="text-warning flex-shrink-0" />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicAnalyzer;
