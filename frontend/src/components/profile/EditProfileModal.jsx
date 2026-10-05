import React, { useState } from "react";
import { useStudent } from "../../context/StudentContext";

const EditProfileModal = ({ isOpen, onClose }) => {
  const { profile, updatePersonalInfo, updateAcademicInfo } = useStudent();
  const [formData, setFormData] = useState({
    name: profile.personalInfo.name || "",
    email: profile.personalInfo.email || "",
    phone: profile.personalInfo.phone || "",
    college: profile.personalInfo.college || "",
    degree: profile.personalInfo.degree || "",
    department: profile.personalInfo.department || "",
    year: profile.personalInfo.year || "",
    semester: profile.personalInfo.semester || "",
    cgpa: profile.academicInfo.cgpa || 8.24,
    attendance: profile.academicInfo.attendance || 91,
    backlogs: profile.academicInfo.backlogs || 0
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updatePersonalInfo({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      degree: formData.degree,
      department: formData.department,
      year: formData.year,
      semester: formData.semester
    });
    updateAcademicInfo({
      cgpa: parseFloat(formData.cgpa) || 8.0,
      attendance: parseInt(formData.attendance) || 90,
      backlogs: parseInt(formData.backlogs) || 0
    });
    onClose();
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(15, 23, 42, 0.6)" }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <div className="modal-header border-0 bg-light px-4 py-3">
            <h5 className="modal-title fw-bold text-dark">Edit Student Profile</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <form onSubmit={handleSave}>
            <div className="modal-body p-4">
              <h6 className="fw-bold text-primary mb-3">Personal Information</h6>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control rounded-3"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control rounded-3"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control rounded-3"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold text-muted">College / Institution</label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="form-control rounded-3"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="form-control rounded-3"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="form-control rounded-3"
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-semibold text-muted">Year</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="form-control rounded-3"
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label small fw-semibold text-muted">Semester</label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="form-control rounded-3"
                  />
                </div>
              </div>

              <h6 className="fw-bold text-primary mb-3">Academic Metrics</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Current CGPA (out of 10)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleChange}
                    className="form-control rounded-3"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Attendance (%)</label>
                  <input
                    type="number"
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleChange}
                    className="form-control rounded-3"
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold text-muted">Active Backlogs</label>
                  <input
                    type="number"
                    name="backlogs"
                    value={formData.backlogs}
                    onChange={handleChange}
                    className="form-control rounded-3"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 px-4 pb-4">
              <button type="button" className="btn btn-outline-secondary px-4 py-2 rounded-3" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4 py-2 rounded-3">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
