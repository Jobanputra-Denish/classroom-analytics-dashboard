import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SettingsTheme.css"; // Imports the matched login page styles

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  // State Management
  const [profileData, setProfileData] = useState({
    name: "Administrator",
    email: "admin@school.com",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [schoolData, setSchoolData] = useState({
    schoolName: "Apex International Academy",
    academicYear: "2025-2026",
    contactEmail: "info@apexacademy.com",
    phone: "+1 234 567 890",
  });

  const [academicRules, setAcademicRules] = useState({
    passPercentage: 40,
    attendanceThreshold: 75,
    defaultTotalMarks: 100,
    enableEmailAlerts: true,
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSchoolChange = (e) => {
    setSchoolData({ ...schoolData, [e.target.name]: e.target.value });
  };

  const handleRulesChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setAcademicRules({ ...academicRules, [e.target.name]: value });
  };

  const handleSave = (e, section) => {
    e.preventDefault();
    alert(`${section} updated successfully!`);
  };

  return (
    <div className="container py-4 theme-settings-container">
      {/* Title Section */}
      <div className="mb-4">
        <h2 className="fw-bold" style={{ color: "var(--text-dark)" }}>
          <i className="bi bi-gear-fill me-2" style={{ color: "var(--primary-color)" }}></i>
          System Settings
        </h2>
        <p className="text-muted">
          Configure security, school identity, and grading rules.
        </p>
      </div>

      <div className="row">
        {/* Navigation Tabs */}
        <div className="col-md-3 mb-4">
          <div className="list-group shadow-sm theme-nav-group">
            <button
              className={`list-group-item list-group-item-action py-3 fw-bold ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="bi bi-person-badge me-2"></i> Admin Security
            </button>
            <button
              className={`list-group-item list-group-item-action py-3 fw-bold ${
                activeTab === "institution" ? "active" : ""
              }`}
              onClick={() => setActiveTab("institution")}
            >
              <i className="bi bi-building me-2"></i> School Profile
            </button>
            <button
              className={`list-group-item list-group-item-action py-3 fw-bold ${
                activeTab === "academic" ? "active" : ""
              }`}
              onClick={() => setActiveTab("academic")}
            >
              <i className="bi bi-sliders me-2"></i> Academic Rules
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="col-md-9">
          {/* TAB 1: ADMIN SECURITY */}
          {activeTab === "profile" && (
            <div className="card shadow-sm theme-card">
              <div className="card-header theme-header py-3">
                <h5 className="mb-0 fw-bold">Admin Account & Security</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={(e) => handleSave(e, "Admin Profile")}>
                  <h6 className="fw-bold mb-3" style={{ color: "var(--primary-color)" }}>
                    Account Profile
                  </h6>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Admin Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                  </div>

                  <hr className="my-4" />

                  <h6 className="fw-bold mb-3" style={{ color: "var(--primary-color)" }}>
                    Change Password
                  </h6>
                  <div className="row mb-3">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="currentPassword"
                        value={profileData.currentPassword}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="newPassword"
                        value={profileData.newPassword}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        value={profileData.confirmPassword}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn theme-btn-primary px-4 fw-semibold">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: SCHOOL PROFILE */}
          {activeTab === "institution" && (
            <div className="card shadow-sm theme-card">
              <div className="card-header theme-header py-3">
                <h5 className="mb-0 fw-bold">School Profile Settings</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={(e) => handleSave(e, "School Profile")}>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Institute Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="schoolName"
                        value={schoolData.schoolName}
                        onChange={handleSchoolChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Academic Year</label>
                      <input
                        type="text"
                        className="form-control"
                        name="academicYear"
                        value={schoolData.academicYear}
                        onChange={handleSchoolChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Contact Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="contactEmail"
                        value={schoolData.contactEmail}
                        onChange={handleSchoolChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={schoolData.phone}
                        onChange={handleSchoolChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn theme-btn-primary px-4 fw-semibold">
                      Update School Info
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: ACADEMIC RULES */}
          {activeTab === "academic" && (
            <div className="card shadow-sm theme-card">
              <div className="card-header theme-header py-3">
                <h5 className="mb-0 fw-bold">Academic Thresholds & Rules</h5>
              </div>
              <div className="card-body p-4">
                <form onSubmit={(e) => handleSave(e, "Academic Rules")}>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Passing Threshold (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="passPercentage"
                        value={academicRules.passPercentage}
                        onChange={handleRulesChange}
                        min="0"
                        max="100"
                      />
                      <small className="text-muted">Minimum percentage required to pass.</small>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Attendance Warning Level (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="attendanceThreshold"
                        value={academicRules.attendanceThreshold}
                        onChange={handleRulesChange}
                        min="0"
                        max="100"
                      />
                      <small className="text-muted">Threshold for low attendance flags.</small>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Default Total Marks</label>
                      <input
                        type="number"
                        className="form-control"
                        name="defaultTotalMarks"
                        value={academicRules.defaultTotalMarks}
                        onChange={handleRulesChange}
                      />
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="emailAlerts"
                      name="enableEmailAlerts"
                      checked={academicRules.enableEmailAlerts}
                      onChange={handleRulesChange}
                    />
                    <label className="form-check-label fw-semibold" htmlFor="emailAlerts">
                      Enable Email Notifications for Low Attendance
                    </label>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn theme-btn-primary px-4 fw-semibold">
                      Save Rules
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;