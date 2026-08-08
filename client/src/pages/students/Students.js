import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup, ListGroup, Badge } from "react-bootstrap";
import { User, Mail, Phone, MapPin, Hash, Plus, CheckCircle2, Save, Sparkles, GraduationCap, ArrowRight, RotateCcw } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { getStudents, addStudent, updateStudent } from "../api/studentApi";
import "../Setings/SettingsTheme.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    StudentId: "",
    className: "",
    section: "",
    age: "",
    gender: "",
    phoneNumber: "",
    address: "",
  });

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();

    if (location.state && location.state.editStudent) {
      const student = location.state.editStudent;
      setFormData({
        fullname: student.fullname || "",
        email: student.email || "",
        StudentId: student.StudentId || "",
        className: student.className || "",
        section: student.section || "",
        age: student.age || "",
        gender: student.gender || "",
        phoneNumber: student.phoneNumber || "",
        address: student.address || "",
      });
      setEditId(student._id);
    }
  }, [location]);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const resetForm = () => {
    setFormData({
      fullname: "",
      email: "",
      StudentId: "",
      className: "",
      section: "",
      age: "",
      gender: "",
      phoneNumber: "",
      address: "",
    });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await updateStudent(editId, formData);
        alert("Student Profile Updated Successfully");
      } else {
        await addStudent(formData);
        alert("Student Enrolled Successfully");
      }

      resetForm();
      navigate("/view-students");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error processing request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content-area theme-settings-container">
      <Container fluid className="px-4 py-4">
        {/* HEADER BRANDING BANNER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
          <div>
            <h3 className="fw-bold tracking-tight mb-1" style={{ color: "var(--text-dark)" }}>
              Student Enrollment Portal
            </h3>
            <p className="text-muted small mb-0">
              {editId ? "Modify and update registered student records." : "Register new candidates into the core system directory."}
            </p>
          </div>
          <Button variant="outline-secondary" className="btn-custom d-flex align-items-center gap-2" onClick={() => navigate("/view-students")}>
            View Student Directory <ArrowRight size={16} />
          </Button>
        </div>

        <Row className="g-4">
          {/* MAIN ENROLLMENT / EDIT FORM */}
          <Col lg={8} xs={12}>
            <Card className="theme-card shadow-sm runtime-panel-card overflow-hidden">
              <Card.Header className="theme-header py-3 d-flex align-items-center justify-content-between">
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 text-white">
                  <GraduationCap size={20} />
                  {editId ? "Update Student Dossier" : "New Candidate Registration"}
                </h5>
                <Badge bg="light" className="text-dark fs-8 font-monospace fw-normal">
                  {editId ? `ID: ${editId.slice(-6)}` : "DRAFT"}
                </Badge>
              </Card.Header>

              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Label className="fs-7 fw-semibold text-secondary">Full Name</Form.Label>
                      <InputGroup className="input-group-custom">
                        <InputGroup.Text><User size={16} className="text-muted" /></InputGroup.Text>
                        <Form.Control type="text" name="fullname" value={formData.fullname} onChange={handleChange} placeholder="e.g. John Doe" required />
                      </InputGroup>
                    </Col>

                    <Col md={6}>
                      <Form.Label className="fs-7 fw-semibold text-secondary">Email Address</Form.Label>
                      <InputGroup className="input-group-custom">
                        <InputGroup.Text><Mail size={16} className="text-muted" /></InputGroup.Text>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="johndoe@example.com" required />
                      </InputGroup>
                    </Col>

                    <Col md={6}>
                      <Form.Label className="fs-7 fw-semibold text-secondary">Student ID / Enrollment No.</Form.Label>
                      <InputGroup className="input-group-custom">
                        <InputGroup.Text><Hash size={16} className="text-muted" /></InputGroup.Text>
                        <Form.Control type="text" name="StudentId" value={formData.StudentId} onChange={handleChange} placeholder="STU-2026-001" required />
                      </InputGroup>
                    </Col>

                    <Col md={3}>
                      <Form.Label className="fs-7 fw-semibold text-secondary">Class / Grade</Form.Label>
                      <Form.Control type="text" name="className" value={formData.className} onChange={handleChange} placeholder="10th Grade" required className="custom-input-single" />
                    </Col>

                    <Col md={3}>
                      <Form.Label className="fs-7 fw-semibold text-secondary">Section</Form.Label>
                      <Form.Control type="text" name="section" value={formData.section} onChange={handleChange} placeholder="A" className="custom-input-single" />
                    </Col>

                    <Col md={4}>
                      <Form.Label className="fs-7 fw-semibold text-secondary">Age</Form.Label>
                      <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} placeholder="16" className="custom-input-single" />
                    </Col>

                    <Col md={4}>
                      <Form.Label className="fs-7 fw-semibold text-secondary">Gender</Form.Label>
                      <Form.Select name="gender" value={formData.gender} onChange={handleChange} required className="custom-input-single">
                        <option value="">Choose Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </Form.Select>
                    </Col>

                    <Col md={4}>
                      <Form.Label className="fs-7 fw-semibold text-secondary">Phone Number</Form.Label>
                      <InputGroup className="input-group-custom">
                        <InputGroup.Text><Phone size={16} className="text-muted" /></InputGroup.Text>
                        <Form.Control type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+1 234 567 890" required />
                      </InputGroup>
                    </Col>

                    <Col md={12}>
                      <Form.Label className="fs-7 fw-semibold text-secondary">Residential Address</Form.Label>
                      <InputGroup className="input-group-custom">
                        <InputGroup.Text><MapPin size={16} className="text-muted" /></InputGroup.Text>
                        <Form.Control as="textarea" rows={3} name="address" value={formData.address} onChange={handleChange} placeholder="Enter full permanent residential address..." required />
                      </InputGroup>
                    </Col>

                    <Col md={12} className="pt-2">
                      <div className="d-flex gap-2">
                        <Button type="submit" disabled={loading} className="theme-btn-primary flex-fill py-2.5 fw-medium d-flex align-items-center justify-content-center gap-2">
                          {editId ? <Save size={18} /> : <Plus size={18} />}
                          {editId ? "Save Modifications" : "Confirm Student Registration"}
                        </Button>
                        {editId && (
                          <Button variant="light" onClick={resetForm} className="btn-action text-secondary border px-3">
                            <RotateCcw size={16} className="me-1" /> Cancel Edit
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* SIDEBAR: RECENT ENROLLMENTS FEED */}
          <Col lg={4} xs={12}>
            <Card className="theme-card shadow-sm runtime-panel-card sticky-lg-top" style={{ top: "100px" }}>
              <Card.Header className="bg-transparent py-3 border-bottom d-flex align-items-center justify-content-between">
                <h6 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ color: "var(--text-dark)" }}>
                  <Sparkles size={16} className="text-warning" /> Recent Registrations
                </h6>
                <span className="fs-8 text-muted">{students.length} Total</span>
              </Card.Header>
              <Card.Body className="p-3">
                {students.length > 0 ? (
                  <ListGroup variant="flush" className="gap-2">
                    {students.slice(0, 5).map((student) => (
                      <ListGroup.Item key={student._id} className="recent-student-item p-3 rounded-3 border d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                          <div className="recent-avatar-circle">
                            <CheckCircle2 size={18} className="text-success" />
                          </div>
                          <div>
                            <span className="fw-semibold d-block fs-7" style={{ color: "var(--text-dark)" }}>{student.fullname}</span>
                            <small className="text-muted fs-8">
                              {student.StudentId} • <span className="fw-medium text-secondary">{student.className}</span>
                            </small>
                          </div>
                        </div>
                        <Badge className="badge-code-pill ms-2">{student.gender}</Badge>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <div className="text-center py-4 text-muted fs-7">No registered students found in directory.</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* COMPACT STYLING RUNTIME OVERRIDES */}
      <style>{`
        .dashboard-content-area { color: var(--text-dark); }
        .fs-7 { font-size: 0.875rem !important; }
        .fs-8 { font-size: 0.75rem !important; }
        .tracking-tight { letter-spacing: -0.02em; }
        .runtime-panel-card { border-radius: 12px; }

        /* INPUT FIELD FORMATTING */
        .input-group-custom .form-control, .input-group-custom .form-select { border-left: none; padding-top: 9px; padding-bottom: 9px; font-size: 0.875rem; border-color: var(--primary-border); border-top-right-radius: 8px !important; border-bottom-right-radius: 8px !important; }
        .input-group-custom .input-group-text { background-color: var(--card-bg); border-right: none; border-color: var(--primary-border); border-top-left-radius: 8px !important; border-bottom-left-radius: 8px !important; }
        .custom-input-single { border-color: var(--primary-border); padding-top: 9px; padding-bottom: 9px; font-size: 0.875rem; border-radius: 8px !important; }
        .form-control:focus, .form-select:focus { border-color: var(--primary-color) !important; box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.15) !important; }

        /* SIDEBAR LIST STYLING */
        .recent-student-item { background-color: var(--card-bg); transition: all 0.2s ease; }
        .recent-student-item:hover { background-color: var(--primary-light); border-color: var(--primary-border) !important; transform: translateX(2px); }
        .recent-avatar-circle { width: 32px; height: 32px; border-radius: 50%; background-color: #f0fdf4; display: flex; align-items: center; justify-content: center; }
        .badge-code-pill { background: var(--primary-light); color: var(--primary-color); padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 600; text-transform: capitalize; }
      `}</style>
    </div>
  );
};

export default Students;