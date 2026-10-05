import React, { useState } from "react";
import { UploadCloud, FileText, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import api from "../../services/api";

const ResumeUploader = ({ onAnalysisComplete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [targetCareer, setTargetCareer] = useState("Full Stack Developer");

  const sampleResumeText = `
Rahul Sharma
Email: rahul@example.com | Phone: 9876543210
Degree: B.Tech in Information Technology (CGPA: 8.24)
College: ABC Engineering College

TECHNICAL SKILLS:
- Languages: Python, JavaScript, SQL, HTML5, CSS3
- Frameworks & Libraries: React.js, Express.js, Node.js, Bootstrap
- Databases & Tools: MongoDB, SQLite, Git, GitHub, Firebase

PROJECTS:
1. Smart Attendance System (Python, OpenCV, SQLite, Tkinter)
- Developed an automated face recognition attendance management software for college classrooms.
- Achieved 96% recognition accuracy using Haar Cascades and LBPH face recognizer.
- Generated automated weekly attendance export reports in Excel format.

2. E-Commerce Web Application (MERN Stack)
- Built full-featured web application with product catalogs, shopping cart, and Stripe payment gateway.
- Designed secure authentication using JSON Web Tokens (JWT) and Bcrypt password hashing.
- Reduced database query latency by 30% through indexed MongoDB aggregation pipelines.

CERTIFICATIONS:
- AWS Certified Cloud Practitioner (2025)
- Google Data Analytics Professional Certificate (2025)
  `;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleProcessFile = async (uploadedFile) => {
    setFile(uploadedFile);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resumeFile", uploadedFile);
      formData.append("targetCareer", targetCareer);
      const res = await api.analyzeResume(formData);
      if (res.data && res.data.data) {
        onAnalysisComplete(res.data.data);
      }
    } catch (err) {
      console.error("Resume analysis error", err);
      // fallback to sample analysis
      handleLoadSample();
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("resumeText", sampleResumeText);
      formData.append("targetCareer", targetCareer);
      const res = await api.analyzeResume(formData);
      if (res.data && res.data.data) {
        onAnalysisComplete(res.data.data);
      }
    } catch (err) {
      console.error("Sample resume analysis error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-4 rounded-4 border-2 border-dashed text-center position-relative ${
          dragActive ? "border-primary bg-primary-subtle" : "border-secondary-subtle bg-light"
        }`}
        style={{ cursor: "pointer", transition: "all 0.2s ease" }}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
          style={{ cursor: "pointer" }}
        />

        <div className="py-3">
          <div 
            className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
            style={{ width: "60px", height: "60px", backgroundColor: "#eff6ff", color: "#2563eb" }}
          >
            <UploadCloud size={30} />
          </div>
          <h6 className="fw-bold text-dark mb-1">Upload Your Resume</h6>
          <p className="text-secondary small mb-2">
            Drag & drop your file here or click to browse
          </p>
          <span className="badge bg-white text-muted border px-2.5 py-1 rounded-pill" style={{ fontSize: "0.75rem" }}>
            PDF, DOC, DOCX (Max 5MB)
          </span>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <span className="text-muted small">
          {file ? `Selected: ${file.name}` : "Don't have a file ready?"}
        </span>
        <button
          onClick={handleLoadSample}
          disabled={loading}
          className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5"
          style={{ fontSize: "0.8rem" }}
        >
          {loading ? (
            <>
              <RefreshCw size={13} className="spin-animation" /> Analyzing...
            </>
          ) : (
            <>
              <FileText size={14} /> Analyze Sample Resume Document
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResumeUploader;
