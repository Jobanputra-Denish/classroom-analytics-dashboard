import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Button, Row, Col, InputGroup, Spinner } from "react-bootstrap";
import {
  BookOpen,
  Hash,
  GraduationCap,
  Layers,
  Award,
  FileText,
  Plus,
  Trash2,
  ArrowLeft,
  Save,
} from "lucide-react";
import "../Setings/SettingsTheme.css";

const AddSubjectForm = ({ onBack, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);

  // Form state including all necessary subject fields
  const [formData, setFormData] = useState({
    subjectName: "",
    subjectCode: "",
    className: "",
    semester: "",
    credits: "",
    description: "",
  });

  // Dynamic Marks Modules State
  const [marksModules, setMarksModules] = useState([
    { name: "Internal Assessment", maxMarks: 20 },
    { name: "Mid-Term Exam", maxMarks: 30 },
    { name: "End-Term Exam", maxMarks: 50 },
  ]);

  const token = localStorage.getItem("token");

  // Handle Standard Text Inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Dynamic Marks Modules
  const handleModuleChange = (index, field, value) => {
    const updated = [...marksModules];
    updated[index][field] = value;
    setMarksModules(updated);
  };

  const addModuleField = () => {
    setMarksModules([...marksModules, { name: "", maxMarks: 0 }]);
  };

  const removeModuleField = (index) => {
    setMarksModules(marksModules.filter((_, i) => i !== index));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      marksModules,
    };

    try {
      await axios.post("http://localhost:5000/api/subjects", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Subject added successfully!");
      if (onSuccess) onSuccess();
      if (onBack) onBack();
    } catch (error) {
      console.error("Error creating subject:", error);
      alert(error.response?.data?.message || "Failed to add subject. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="theme-card shadow-sm runtime-panel-card border-0 my-3">
      <Card.Header className="theme-header text-white d-flex align-items-center justify-content-between py-3 px-4">
        <div className="d-flex align-items-center gap-2">
          {onBack && (
            <Button variant="link" className="text-white p-0 me-2" onClick={onBack}>
              <ArrowLeft size={20} />
            </Button>
          )}
          <BookOpen size={20} />
          <h5 className="mb-0 fw-bold fs-6">Add New Subject & Curriculum Details</h5>
        </div>
      </Card.Header>

      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          {/* BASIC SUBJECT DETAILS */}
          <h6 className="fw-bold mb-3 tracking-tight" style={{ color: "var(--text-dark)" }}>
            1. Basic Subject Information
          </h6>

          <Row className="g-3 mb-4">
            {/* Subject Name */}
            <Col md={6}>
              <Form.Label className="fs-7 fw-semibold text-secondary">Subject Name</Form.Label>
              <InputGroup className="input-group-custom">
                <InputGroup.Text><BookOpen size={16} className="text-muted" /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="e.g. Operating Systems"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleChange}
                  required
                  className="fs-7"
                />
              </InputGroup>
            </Col>

            {/* Subject Code */}
            <Col md={6}>
              <Form.Label className="fs-7 fw-semibold text-secondary">Subject Code</Form.Label>
              <InputGroup className="input-group-custom">
                <InputGroup.Text><Hash size={16} className="text-muted" /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="e.g. CS-302"
                  name="subjectCode"
                  value={formData.subjectCode}
                  onChange={handleChange}
                  required
                  className="fs-7"
                />
              </InputGroup>
            </Col>

            {/* Class Name */}
            <Col md={4}>
              <Form.Label className="fs-7 fw-semibold text-secondary">Class / Stream</Form.Label>
              <InputGroup className="input-group-custom">
                <InputGroup.Text><GraduationCap size={16} className="text-muted" /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="e.g. B.Tech CS"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  required
                  className="fs-7"
                />
              </InputGroup>
            </Col>

            {/* Semester */}
            <Col md={4}>
              <Form.Label className="fs-7 fw-semibold text-secondary">Semester</Form.Label>
              <InputGroup className="input-group-custom">
                <InputGroup.Text><Layers size={16} className="text-muted" /></InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="e.g. 5"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  min="1"
                  className="fs-7"
                />
              </InputGroup>
            </Col>

            {/* Credits */}
            <Col md={4}>
              <Form.Label className="fs-7 fw-semibold text-secondary">Credits</Form.Label>
              <InputGroup className="input-group-custom">
                <InputGroup.Text><Award size={16} className="text-muted" /></InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="e.g. 4"
                  name="credits"
                  value={formData.credits}
                  onChange={handleChange}
                  required
                  min="0"
                  className="fs-7"
                />
              </InputGroup>
            </Col>

            {/* Description */}
            <Col md={12}>
              <Form.Label className="fs-7 fw-semibold text-secondary">Subject Description / Overview</Form.Label>
              <InputGroup className="input-group-custom">
                <InputGroup.Text><FileText size={16} className="text-muted" /></InputGroup.Text>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter detailed summary, learning objectives, or syllabus syllabus breakdown..."
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="fs-7"
                />
              </InputGroup>
            </Col>
          </Row>

          <hr className="my-4" />

          {/* MARKS MODULE EVALUATION SCHEME */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h6 className="fw-bold mb-1 tracking-tight" style={{ color: "var(--text-dark)" }}>
                2. Examination & Marks Evaluation Scheme
              </h6>
              <p className="text-muted fs-8 mb-0">Configure mid-terms, practicals, assignments, or final exam modules.</p>
            </div>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={addModuleField}
              className="fs-8 py-1 d-flex align-items-center gap-1"
            >
              <Plus size={14} /> Add Module
            </Button>
          </div>

          {marksModules.map((mod, index) => (
            <Row key={index} className="g-2 mb-2 align-items-center">
              <Col md={7}>
                <Form.Control
                  type="text"
                  placeholder="Module Title (e.g. Practical Exam / Mid Sem)"
                  value={mod.name}
                  onChange={(e) => handleModuleChange(index, "name", e.target.value)}
                  required
                  className="fs-7"
                />
              </Col>
              <Col md={4}>
                <InputGroup className="input-group-custom">
                  <Form.Control
                    type="number"
                    placeholder="Max Marks"
                    value={mod.maxMarks}
                    onChange={(e) => handleModuleChange(index, "maxMarks", e.target.value)}
                    required
                    min="1"
                    className="fs-7"
                  />
                  <InputGroup.Text className="fs-8">Marks</InputGroup.Text>
                </InputGroup>
              </Col>
              <Col md={1} className="text-center">
                {marksModules.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeModuleField(index)}
                    className="p-1 btn-icon"
                    title="Remove Module"
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </Col>
            </Row>
          ))}

          {/* ACTION BUTTONS */}
          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            {onBack && (
              <Button variant="outline-secondary" onClick={onBack} className="px-4 fs-7">
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={submitting}
              className="theme-btn-primary px-4 fs-7 d-flex align-items-center gap-2"
            >
              {submitting ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <Save size={16} /> Save Subject Details
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>

      {/* COMPACT STYLING RUNTIME OVERRIDES */}
      <style>{`
        .fs-7 { font-size: 0.875rem !important; }
        .fs-8 { font-size: 0.75rem !important; }
        .tracking-tight { letter-spacing: -0.02em; }
        .runtime-panel-card { border-radius: 12px; }

        .input-group-custom .form-control { border-left: none; padding-top: 8px; padding-bottom: 8px; border-color: var(--primary-border); border-top-right-radius: 8px !important; border-bottom-right-radius: 8px !important; }
        .input-group-custom .input-group-text { background-color: var(--card-bg); border-right: none; border-color: var(--primary-border); border-top-left-radius: 8px !important; border-bottom-left-radius: 8px !important; }
        .form-control:focus { border-color: var(--primary-color) !important; box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.15) !important; }

        .btn-icon { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; }
      `}</style>
    </Card>
  );
};

export default AddSubjectForm;