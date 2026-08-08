import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup, Table, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Award, Pencil, Trash2, Plus, Save, RotateCcw, User, BookOpen, Calendar, Hash, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../Setings/SettingsTheme.css";

const Marks = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: "",
    subjectId: "",
    obtainedMarks: "",
    totalMarks: 100,
    term: "",
  });

  const fetchStudents = async () => {
    try {
      const res = await api.get("/students");
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchMarks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/marks");
      setMarks(res.data);
    } catch (error) {
      console.error("Error fetching marks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
    fetchMarks();
  }, []);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const resetForm = () => {
    setEditId(null);
    setFormData({
      studentId: "",
      subjectId: "",
      obtainedMarks: "",
      totalMarks: 100,
      term: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      obtainedMarks: Number(formData.obtainedMarks),
      totalMarks: Number(formData.totalMarks),
    };

    try {
      if (editId) {
        await api.put(`/marks/${editId}`, payload);
        alert("Marks Record Updated Successfully");
      } else {
        await api.post("/marks", payload);
        alert("Marks Added Successfully");
      }
      resetForm();
      fetchMarks();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong while saving marks");
    } finally {
      setSubmitting(false);
    }
  };

  const editMarks = (mark) => {
    setEditId(mark._id);
    setFormData({
      studentId: mark.studentId?.StudentId || "",
      subjectId: mark.subjectId?.subjectCode || "",
      obtainedMarks: mark.obtainedMarks,
      totalMarks: mark.totalMarks,
      term: mark.term || "",
    });
  };

  const deleteMarks = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mark record?")) return;
    try {
      await api.delete(`/marks/${id}`);
      fetchMarks();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete record");
    }
  };

  return (
    <div className="dashboard-content-area theme-settings-container">
      <Container fluid className="px-4 py-4">
        {/* HEADER BRANDING BANNER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
          <div>
            <h3 className="fw-bold tracking-tight mb-1" style={{ color: "var(--text-dark)" }}>
              Marks Management Portal
            </h3>
            <p className="text-muted small mb-0">Record, update, and regulate student examination results.</p>
          </div>
          <Button variant="outline-secondary" className="btn-custom d-flex align-items-center gap-2" onClick={() => navigate("/view-marks")}>
            View Subject Analytics <ArrowRight size={16} />
          </Button>
        </div>

        {/* MARKS INPUT FORM CARD */}
        <Card className="theme-card shadow-sm runtime-panel-card mb-4 overflow-hidden">
          <Card.Header className="theme-header py-3 d-flex align-items-center justify-content-between">
            <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 text-white">
              <Award size={20} />
              {editId ? "Update Marks Record" : "Add New Marks Record"}
            </h5>
            <Badge bg="light" className="text-dark fs-8 font-monospace fw-normal">
              {editId ? `RECORD: ${editId.slice(-6)}` : "NEW ENTRY"}
            </Badge>
          </Card.Header>

          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label className="fs-7 fw-semibold text-secondary">Student</Form.Label>
                  <InputGroup className="input-group-custom">
                    <InputGroup.Text><User size={16} className="text-muted" /></InputGroup.Text>
                    <Form.Select name="studentId" value={formData.studentId} onChange={handleChange} required>
                      <option value="">Select Candidate</option>
                      {students.map((student) => (
                        <option key={student._id} value={student.StudentId}>
                          {student.StudentId} — {student.fullname}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Col>

                <Col md={6}>
                  <Form.Label className="fs-7 fw-semibold text-secondary">Subject</Form.Label>
                  <InputGroup className="input-group-custom">
                    <InputGroup.Text><BookOpen size={16} className="text-muted" /></InputGroup.Text>
                    <Form.Select name="subjectId" value={formData.subjectId} onChange={handleChange} required>
                      <option value="">Select Course/Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject.subjectCode}>
                          [{subject.subjectCode}] {subject.subjectName}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Col>

                <Col md={4}>
                  <Form.Label className="fs-7 fw-semibold text-secondary">Obtained Marks</Form.Label>
                  <InputGroup className="input-group-custom">
                    <InputGroup.Text><Award size={16} className="text-muted" /></InputGroup.Text>
                    <Form.Control type="number" name="obtainedMarks" value={formData.obtainedMarks} onChange={handleChange} min="0" placeholder="e.g. 85" required />
                  </InputGroup>
                </Col>

                <Col md={4}>
                  <Form.Label className="fs-7 fw-semibold text-secondary">Total Max Marks</Form.Label>
                  <InputGroup className="input-group-custom">
                    <InputGroup.Text><Hash size={16} className="text-muted" /></InputGroup.Text>
                    <Form.Control type="number" name="totalMarks" value={formData.totalMarks} onChange={handleChange} min="1" placeholder="100" required />
                  </InputGroup>
                </Col>

                <Col md={4}>
                  <Form.Label className="fs-7 fw-semibold text-secondary">Examination Term</Form.Label>
                  <InputGroup className="input-group-custom">
                    <InputGroup.Text><Calendar size={16} className="text-muted" /></InputGroup.Text>
                    <Form.Select name="term" value={formData.term} onChange={handleChange} required>
                      <option value="">Select Examination Term</option>
                      <option value="Mid-Term">Mid-Term Examination</option>
                      <option value="Final-Term">Final-Term Examination</option>
                    </Form.Select>
                  </InputGroup>
                </Col>

                <Col md={12} className="pt-2">
                  <div className="d-flex justify-content-end gap-2">
                    <Button variant="light" onClick={resetForm} className="btn-action text-secondary border px-4">
                      <RotateCcw size={16} className="me-1" /> Reset
                    </Button>
                    <Button type="submit" disabled={submitting} className="theme-btn-primary px-4 fw-medium d-flex align-items-center gap-2">
                      {editId ? <Save size={18} /> : <Plus size={18} />}
                      {editId ? "Update Marks Record" : "Save Marks Entry"}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* EXISTING RECORDS CONTROL DATAGRID */}
        <Card className="theme-card shadow-sm runtime-panel-card overflow-hidden">
          <Card.Header className="bg-transparent py-3 border-bottom d-flex align-items-center justify-content-between">
            <h5 className="mb-0 fw-bold" style={{ color: "var(--text-dark)" }}>Existing Result Log</h5>
            <span className="fs-8 text-muted">{marks.length} Total Records</span>
          </Card.Header>

          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border spinner-border-sm me-2" style={{ color: "var(--primary-color)" }} role="status"></div>
                <span className="text-muted small">Loading examination logs...</span>
              </div>
            ) : (
              <div className="table-responsive">
                <Table hover className="align-middle mb-0 custom-datagrid">
                  <thead>
                    <tr>
                      <th style={{ width: "60px" }}>Idx</th>
                      <th>Student Candidate</th>
                      <th>Subject Name</th>
                      <th>Exam Term</th>
                      <th>Score Ratio</th>
                      <th>Percentage</th>
                      <th className="text-end pe-4" style={{ width: "110px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marks.length > 0 ? (
                      marks.map((mark, index) => {
                        const pct = mark.totalMarks ? ((mark.obtainedMarks / mark.totalMarks) * 100).toFixed(1) : "0.0";
                        return (
                          <tr key={mark._id} className="datagrid-row-transition">
                            <td className="text-muted fs-7 ps-3">{index + 1}</td>
                            <td>
                              <div className="fw-semibold fs-7" style={{ color: "var(--text-dark)" }}>
                                {mark.studentId?.fullname || <span className="text-danger fst-italic">Student Deleted</span>}
                              </div>
                              <small className="text-muted fs-8">{mark.studentId?.StudentId || "N/A"}</small>
                            </td>
                            <td>
                              <span className="fs-7 fw-medium" style={{ color: "var(--text-dark)" }}>
                                {mark.subjectId?.subjectName || <span className="text-danger">Subject Deleted</span>}
                              </span>
                              {mark.subjectId?.subjectCode && <span className="badge-code-pill ms-2">{mark.subjectId.subjectCode}</span>}
                            </td>
                            <td>
                              <Badge className={mark.term === "Mid-Term" ? "badge-modern badge-modern-info" : "badge-modern badge-modern-dark"}>
                                {mark.term}
                              </Badge>
                            </td>
                            <td className="fw-bold fs-7" style={{ color: "var(--text-dark)" }}>
                              {mark.obtainedMarks} <span className="text-muted fw-normal fs-8">/ {mark.totalMarks}</span>
                            </td>
                            <td>
                              <Badge className={parseFloat(pct) >= 40 ? "badge-modern badge-modern-success" : "badge-modern badge-modern-danger"}>
                                {pct}%
                              </Badge>
                            </td>
                            <td className="text-end pe-3">
                              <div className="d-flex justify-content-end gap-1">
                                <OverlayTrigger placement="top" overlay={<Tooltip>Edit Record</Tooltip>}>
                                  <Button size="sm" variant="action-edit" onClick={() => editMarks(mark)} className="p-1 rounded-2">
                                    <Pencil size={14} />
                                  </Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip>Delete Entry</Tooltip>}>
                                  <Button size="sm" variant="action-delete" onClick={() => deleteMarks(mark._id)} className="p-1 rounded-2">
                                    <Trash2 size={14} />
                                  </Button>
                                </OverlayTrigger>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-5 fs-7">
                          No marks records recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>

      <style>{`
        .dashboard-content-area { color: var(--text-dark); }
        .fs-7 { font-size: 0.875rem !important; }
        .fs-8 { font-size: 0.75rem !important; }
        .tracking-tight { letter-spacing: -0.02em; }
        .runtime-panel-card { border-radius: 12px; }

        .input-group-custom .form-control, .input-group-custom .form-select { border-left: none; padding-top: 9px; padding-bottom: 9px; font-size: 0.875rem; border-color: var(--primary-border); border-top-right-radius: 8px !important; border-bottom-right-radius: 8px !important; }
        .input-group-custom .input-group-text { background-color: var(--card-bg); border-right: none; border-color: var(--primary-border); border-top-left-radius: 8px !important; border-bottom-left-radius: 8px !important; }
        .form-control:focus, .form-select:focus { border-color: var(--primary-color) !important; box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.15) !important; }

        .custom-datagrid th { background-color: var(--primary-light); color: var(--text-dark); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 14px 16px; border-top: none; border-bottom: 2px solid var(--primary-border); }
        .custom-datagrid td { padding: 14px 16px; border-bottom: 1px solid var(--primary-border); }
        .datagrid-row-transition { transition: background-color 0.15s ease; }
        .datagrid-row-transition:hover { background-color: var(--primary-light) !important; }

        .badge-modern { padding: 6px 10px; font-weight: 500; font-size: 0.75rem; border-radius: 6px; }
        .badge-modern-info { background-color: #e0f2fe !important; color: #0369a1 !important; }
        .badge-modern-dark { background-color: #f1f5f9 !important; color: #334155 !important; }
        .badge-modern-success { background-color: #dcfce7 !important; color: #15803d !important; }
        .badge-modern-danger { background-color: #fee2e2 !important; color: #991b1b !important; }
        .badge-code-pill { background: var(--primary-light); color: var(--primary-color); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-family: monospace; font-weight: 600; display: inline-block; }

        .btn-action-edit { background: none; border: none; color: #d97706; transition: background 0.2s; }
        .btn-action-edit:hover { background: #fef3c7; color: #b45309; }
        .btn-action-delete { background: none; border: none; color: #dc2626; transition: background 0.2s; }
        .btn-action-delete:hover { background: #fee2e2; color: #b91c1c; }
      `}</style>
    </div>
  );
};

export default Marks;