import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building, 
  Calendar, 
  Edit3, 
  ExternalLink, 
  CheckCircle2, 
  Award,
  Sparkles,
  ArrowRight,
  Code,
  Layers
} from "lucide-react";
import { useStudent } from "../context/StudentContext";
import { useAuth } from "../context/AuthContext";
import { CircularGauge, ProgressBar } from "../components/common/ProgressBar";
import EditProfileModal from "../components/profile/EditProfileModal";
import SkillQuizModal from "../components/profile/SkillQuizModal";

const StudentProfile = () => {
  const { profile, updateSkillLevel } = useStudent();
  const { profileMissing } = useAuth();
  const { personalInfo, academicInfo, skills, projects, careerInterests, selfAssessment, profileCompletion } = profile;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedQuizSkill, setSelectedQuizSkill] = useState(null);

  const handleOpenQuiz = (skillName) => {
    setSelectedQuizSkill(skillName);
  };

  return (
    <div className="container-fluid p-0">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">Student Profile</h3>
          <p className="text-secondary mb-0" style={{ fontSize: "0.9rem" }}>
            Manage your information and track your profile completion.
          </p>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-3 bg-white px-3 py-2 rounded-4 border shadow-sm">
            <span className="fw-bold text-secondary small">Profile Completion</span>
            <div style={{ width: "42px", height: "42px" }}>
              <CircularGauge value={profileCompletion} size={42} strokeWidth={5} color="#2563eb" />
            </div>
          </div>
          <button 
            onClick={() => setIsEditOpen(true)}
            className="btn btn-outline-primary rounded-pill px-3 py-2 d-flex align-items-center gap-2 fw-semibold"
            style={{ fontSize: "0.85rem" }}
          >
            <Edit3 size={15} /> Edit
          </button>
        </div>
      </div>

      {profileMissing && (
        <div className="alert alert-warning border-0 rounded-4 p-3.5 mb-4 shadow-sm d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3" style={{ backgroundColor: "#fef3c7" }}>
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle p-2 d-flex align-items-center justify-content-center bg-warning text-dark flex-shrink-0" style={{ width: "36px", height: "36px" }}>
              <Sparkles size={18} />
            </div>
            <div>
              <div className="fw-bold text-dark" style={{ fontSize: "0.92rem" }}>
                Student Profile Document Pending
              </div>
              <div className="text-secondary small">
                No profile document was found in Cloud Firestore for your UID. Click <strong>Initialize Profile</strong> to save your profile details.
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsEditOpen(true)}
            className="btn btn-warning btn-sm px-3 py-1.5 rounded-pill fw-semibold text-dark flex-shrink-0 shadow-sm"
          >
            Initialize Profile
          </button>
        </div>
      )}

      <div className="row g-4">
        {/* Left / Center Major Column */}
        <div className="col-lg-8">
          {/* Personal Information Card */}
          <div className="custom-card mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title-main mb-0">Personal Information</h6>
              <button 
                onClick={() => setIsEditOpen(true)} 
                className="btn btn-sm btn-link text-primary p-0 text-decoration-none"
              >
                Edit
              </button>
            </div>

            <div className="d-flex flex-column flex-md-row gap-4 align-items-start">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: "70px", height: "70px", background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)", color: "#2563eb" }}
              >
                <User size={36} />
              </div>

              <div className="row g-3 flex-grow-1">
                <div className="col-sm-6">
                  <div className="text-secondary small">Name</div>
                  <div className="fw-bold text-dark">{personalInfo?.name || "Not specified"}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-secondary small">Degree</div>
                  <div className="fw-bold text-dark">{personalInfo?.degree || "Not specified"}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-secondary small">Email</div>
                  <div className="fw-bold text-dark">{personalInfo?.email || "Not specified"}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-secondary small">Department</div>
                  <div className="fw-bold text-dark">{personalInfo?.department || "Not specified"}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-secondary small">Phone</div>
                  <div className="fw-bold text-dark">{personalInfo?.phone || "Not specified"}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-secondary small">Year / Semester</div>
                  <div className="fw-bold text-dark">
                    {personalInfo?.year || personalInfo?.semester ? `${personalInfo?.year || ""} • ${personalInfo?.semester || ""}` : "Not specified"}
                  </div>
                </div>
                <div className="col-12">
                  <div className="text-secondary small">College</div>
                  <div className="fw-bold text-dark">{personalInfo?.college || "Not specified"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information Preview Card */}
          <div className="custom-card mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title-main mb-0">Academic Information</h6>
              <Link to="/academic" className="text-primary small text-decoration-none fw-semibold d-flex align-items-center gap-1">
                View Details <ArrowRight size={14} />
              </Link>
            </div>

            <div className="row g-3 text-center">
              <div className="col-4">
                <div className="p-3 bg-light rounded-4 border">
                  <div className="text-secondary small fw-semibold">CGPA</div>
                  <div className="fs-3 fw-extrabold text-dark mt-1">
                    {academicInfo.cgpa} <span className="fs-6 text-muted fw-normal">/ 10</span>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 bg-light rounded-4 border">
                  <div className="text-secondary small fw-semibold">Attendance</div>
                  <div className="fs-3 fw-extrabold text-success mt-1">{academicInfo.attendance}%</div>
                </div>
              </div>
              <div className="col-4">
                <div className="p-3 bg-light rounded-4 border">
                  <div className="text-secondary small fw-semibold">Backlogs</div>
                  <div className="fs-3 fw-extrabold text-primary mt-1">{academicInfo.backlogs}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Card */}
          <div className="custom-card mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title-main mb-0">Projects</h6>
              <span className="text-primary small text-decoration-none fw-semibold">
                View All Projects →
              </span>
            </div>

            <div className="d-flex flex-column gap-3">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-light rounded-4 border d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width: "42px", height: "42px", backgroundColor: "#eff6ff", color: "#2563eb" }}
                    >
                      <Layers size={22} />
                    </div>
                    <div>
                      <div className="fw-bold text-dark">{proj.title}</div>
                      <div className="text-muted small">{proj.tech}</div>
                    </div>
                  </div>
                  <div className="badge bg-white text-secondary border px-3 py-1.5 rounded-pill">
                    {proj.role}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Self Assessment Summary */}
          <div className="custom-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title-main mb-0">Self Assessment Summary</h6>
              <span className="text-primary small text-decoration-none fw-semibold">
                View Full Assessment →
              </span>
            </div>

            <div className="row g-3 text-center">
              <div className="col-4 col-md">
                <div className="p-2.5 bg-light rounded-3 border">
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>Problem Solving</div>
                  <div className="fw-bold text-dark fs-5 mt-1">{selfAssessment.problemSolving}/5</div>
                </div>
              </div>
              <div className="col-4 col-md">
                <div className="p-2.5 bg-light rounded-3 border">
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>Communication</div>
                  <div className="fw-bold text-dark fs-5 mt-1">{selfAssessment.communication}/5</div>
                </div>
              </div>
              <div className="col-4 col-md">
                <div className="p-2.5 bg-light rounded-3 border">
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>Leadership</div>
                  <div className="fw-bold text-dark fs-5 mt-1">{selfAssessment.leadership}/5</div>
                </div>
              </div>
              <div className="col-6 col-md">
                <div className="p-2.5 bg-light rounded-3 border">
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>Teamwork</div>
                  <div className="fw-bold text-dark fs-5 mt-1">{selfAssessment.teamwork}/5</div>
                </div>
              </div>
              <div className="col-6 col-md">
                <div className="p-2.5 bg-light rounded-3 border">
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>Coding Confidence</div>
                  <div className="fw-bold text-dark fs-5 mt-1">{selfAssessment.codingConfidence}/5</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-lg-4">
          {/* Technical Skills Card */}
          <div className="custom-card mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title-main mb-0">Technical Skills</h6>
              <Link to="/skills" className="text-primary small text-decoration-none fw-semibold">
                View All Skills →
              </Link>
            </div>
            
            <p className="text-secondary small mb-3">
              Click <strong>"Verify"</strong> to take a 5-question test and calculate your verified skill grade!
            </p>

            <div className="d-flex flex-column gap-3">
              {skills.slice(0, 5).map((sk) => (
                <div key={sk.name}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold text-dark small d-flex align-items-center gap-1.5">
                      {sk.name}
                      {sk.verified && <CheckCircle2 size={13} className="text-success" />}
                    </span>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted small fw-medium">{sk.level}%</span>
                      <button
                        onClick={() => handleOpenQuiz(sk.name)}
                        className="btn btn-xs btn-outline-primary py-0 px-2 rounded-pill"
                        style={{ fontSize: "0.7rem" }}
                        title={`Take quick test for ${sk.name}`}
                      >
                        {sk.verified ? "Re-test" : "Verify"}
                      </button>
                    </div>
                  </div>
                  <ProgressBar percentage={sk.level} color="#2563eb" showLabel={false} height={7} />
                </div>
              ))}
            </div>
          </div>

          {/* Career Interests Card */}
          <div className="custom-card mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title-main mb-0">Career Interests</h6>
              <Link to="/career" className="text-primary small text-decoration-none fw-semibold">
                View All Interests →
              </Link>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {careerInterests.map((interest) => (
                <span 
                  key={interest} 
                  className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold"
                  style={{ fontSize: "0.8rem" }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications Card */}
          <div className="custom-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="card-title-main mb-0">Certifications</h6>
              <Award size={18} className="text-primary" />
            </div>

            <div className="d-flex flex-column gap-3">
              {profile.certifications?.map((cert) => (
                <div key={cert.id} className="p-3 bg-light rounded-3 border">
                  <div className="fw-bold text-dark small">{cert.name}</div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                    {cert.org} • {cert.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
      <SkillQuizModal 
        isOpen={Boolean(selectedQuizSkill)} 
        onClose={() => setSelectedQuizSkill(null)}
        skillName={selectedQuizSkill}
        onSkillUpdated={(name, score) => updateSkillLevel(name, score, true)}
      />
    </div>
  );
};

export default StudentProfile;
