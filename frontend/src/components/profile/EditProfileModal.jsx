import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useStudent } from "../../context/StudentContext";
import { useAuth } from "../../context/AuthContext";

const EditProfileModal = ({ isOpen, onClose }) => {
  const { profile, saveStudentProfile, reloadFromFirestore } = useStudent();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    degree: "",
    department: "",
    year: "",
    semester: "",
    cgpa: "",
    attendance: "",
    backlogs: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // "idle" | "saving" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Sync form data with current student's actual saved profile whenever modal opens or profile changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: profile.personalInfo?.name || "",
        email: profile.personalInfo?.email || currentUser?.email || "",
        phone: profile.personalInfo?.phone || "",
        college: profile.personalInfo?.college || "",
        degree: profile.personalInfo?.degree || "",
        department: profile.personalInfo?.department || "",
        year: profile.personalInfo?.year || "",
        semester: profile.personalInfo?.semester || "",
        cgpa: profile.academicInfo?.cgpa !== undefined && profile.academicInfo?.cgpa !== null ? String(profile.academicInfo.cgpa) : "",
        attendance: profile.academicInfo?.attendance !== undefined && profile.academicInfo?.attendance !== null ? String(profile.academicInfo.attendance) : "",
        backlogs: profile.academicInfo?.backlogs !== undefined && profile.academicInfo?.backlogs !== null ? String(profile.academicInfo.backlogs) : "0"
      });
      setErrorMessage(null);
      setSuccessMessage(null);
      setSaveStatus("idle");
      setIsSaving(false);
    }
  }, [isOpen, profile, currentUser]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) {
      setErrorMessage(null);
      setSaveStatus("idle");
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Full name is required.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailPattern.test(formData.email.trim())) {
      return "Please provide a valid student email address.";
    }

    if (formData.cgpa !== "") {
      const cgpa = parseFloat(formData.cgpa);
      if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
        return "CGPA must be a valid number between 0.0 and 10.0.";
      }
    }

    if (formData.attendance !== "") {
      const att = parseInt(formData.attendance, 10);
      if (isNaN(att) || att < 0 || att > 100) {
        return "Attendance must be an integer between 0% and 100%.";
      }
    }

    if (formData.backlogs !== "") {
      const back = parseInt(formData.backlogs, 10);
      if (isNaN(back) || back < 0 || back > 50) {
        return "Active backlogs must be a valid number (0 or higher).";
      }
    }

    return null;
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isSaving || saveStatus === "saving") return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const validationErr = validateForm();
    if (validationErr) {
      setErrorMessage(validationErr);
      setSaveStatus("error");
      return;
    }

    setIsSaving(true);
    setSaveStatus("saving");
    try {
      await saveStudentProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        degree: formData.degree,
        department: formData.department,
        year: formData.year,
        semester: formData.semester,
        cgpa: formData.cgpa,
        attendance: formData.attendance,
        backlogs: formData.backlogs
      });

      setSaveStatus("success");
      setSuccessMessage("Profile updated successfully!");

      // Refresh from Firestore if available
      if (reloadFromFirestore) {
        try {
          await reloadFromFirestore();
        } catch (e) {
          console.warn("Reload after save notice:", e);
        }
      }

      // Close modal smoothly after brief success confirmation
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      console.error("Save profile error:", err);
      setSaveStatus("error");
      setErrorMessage(err.message || "Unable to connect to the database. Your changes were not saved.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(15, 23, 42, 0.65)", zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div className="modal-header border-0 bg-light px-4 py-3">
            <h5 className="modal-title fw-bold text-dark">Edit Student Profile</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose} 
              disabled={isSaving} 
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSave}>
            <div className="modal-body p-4" style={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}>
              {errorMessage && (
                <div className="alert alert-danger border-0 rounded-3 p-3 mb-3 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 small">
                  <div className="d-flex align-items-center gap-2">
                    <AlertCircle size={18} className="text-danger flex-shrink-0" />
                    <div><strong>Error:</strong> {errorMessage}</div>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="btn btn-sm btn-outline-danger px-3 py-1 rounded-2 align-self-end align-self-sm-auto fw-semibold"
                  >
                    Retry
                  </button>
                </div>
              )}

              {successMessage && (
                <div className="alert alert-success border-0 rounded-3 p-3 mb-3 d-flex align-items-center gap-2 small">
                  <CheckCircle size={18} className="text-success flex-shrink-0" />
                  <div>{successMessage}</div>
                </div>
              )}

              <h6 className="fw-bold text-primary mb-3">Personal & Academic Details</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Full Name <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="form-control rounded-3"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Email Address <span className="text-danger">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="form-control rounded-3"
                    placeholder="student@institution.edu"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="form-control rounded-3"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">College / Institution</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="form-control rounded-3"
                    placeholder="e.g. University College of Engineering"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Degree / Course</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="form-control rounded-3"
                    placeholder="e.g. B.Tech Computer Science"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="form-control rounded-3"
                    placeholder="e.g. Information Technology"
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-semibold text-muted">Year</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="form-control rounded-3"
                    placeholder="e.g. 3rd Year"
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-semibold text-muted">Semester</label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="form-control rounded-3"
                    placeholder="e.g. Semester 6"
                  />
                </div>
              </div>

              <h6 className="fw-bold text-primary mb-3">Academic Performance Metrics</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Current CGPA (0.0 - 10.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="form-control rounded-3"
                    placeholder="e.g. 8.5"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Attendance (0 - 100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="form-control rounded-3"
                    placeholder="e.g. 92"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Active Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    name="backlogs"
                    value={formData.backlogs}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="form-control rounded-3"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer border-0 bg-light px-4 py-3">
              <button 
                type="button" 
                className="btn btn-outline-secondary px-4 py-2 rounded-3" 
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary px-4 py-2 rounded-3 d-flex align-items-center gap-2 fw-semibold"
                disabled={isSaving || saveStatus === "saving"}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="spinner-border spinner-border-sm" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
