import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Button,
  Form,
  InputGroup,
  Modal,
  Spinner,
  ProgressBar,
  Alert,
  Pagination,
} from "react-bootstrap";
import {
  BookOpen,
  Search,
  RefreshCw,
  Edit3,
  Trash2,
  Eye,
  Plus,
  BarChart2,
  Save,
  X,
  Hash,
  GraduationCap,
  Layers,
  Award,
} from "lucide-react";
import "../Setings/SettingsTheme.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ViewSubjects = ({ onNavigateToAdd }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("ALL");

  // Notification state
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // View Details Modal State
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Edit Subject Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: "",
    subjectName: "",
    subjectCode: "",
    className: "",
    semester: "",
    credits: "",
    marksModules: [],
  });

  const token = localStorage.getItem("token");

  const getAuthHeaders = useCallback(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  // Helper for notifications
  const notify = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 5000);
  };

  // 1. Fetch Subjects
  const fetchSubjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/subjects`, getAuthHeaders());
      setSubjects(res.data);
    } catch (error) {
      console.error("Error loading subjects:", error);
      notify("danger", error.response?.data?.message || "Failed to load subject records.");
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSemester]);

  // 2. Open View Modal
  const handleOpenViewModal = (subject) => {
    setSelectedSubject(subject);
    setShowViewModal(true);
  };

  // 3. Open Edit Modal
  const handleOpenEditModal = (subject) => {
    const defaultModules = subject.marksModules?.length
      ? subject.marksModules
      : [
          { name: "Internal / Quiz", maxMarks: 20 },
          { name: "Mid-Term Exam", maxMarks: 30 },
          { name: "End-Term Exam", maxMarks: 50 },
        ];

    setEditFormData({
      _id: subject._id,
      subjectName: subject.subjectName || "",
      subjectCode: subject.subjectCode || "",
      className: subject.className || "",
      semester: subject.semester || "",
      credits: subject.credits || "",
      marksModules: defaultModules.map((m) => ({ ...m })),
    });
    setShowEditModal(true);
  };

  // 4. Handle Edit Form Inputs
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 5. Immutable Handler for Marks Modules
  const handleModuleChange = (index, field, value) => {
    setEditFormData((prev) => {
      const updatedModules = prev.marksModules.map((mod, i) => {
        if (i === index) {
          return { ...mod, [field]: field === "maxMarks" ? Number(value) || 0 : value };
        }
        return mod;
      });
      return { ...prev, marksModules: updatedModules };
    });
  };

  const addModuleField = () => {
    setEditFormData((prev) => ({
      ...prev,
      marksModules: [...prev.marksModules, { name: "", maxMarks: 0 }],
    }));
  };

  const removeModuleField = (index) => {
    setEditFormData((prev) => ({
      ...prev,
      marksModules: prev.marksModules.filter((_, i) => i !== index),
    }));
  };

  // 6. Submit Update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await axios.put(
        `${API_BASE_URL}/api/subjects/${editFormData._id}`,
        editFormData,
        getAuthHeaders()
      );

      setShowEditModal(false);
      fetchSubjects();
      notify("success", "Subject details updated successfully!");
    } catch (error) {
      console.error("Error updating subject:", error);
      notify("danger", error.response?.data?.message || "Failed to update subject.");
    } finally {
      setUpdating(false);
    }
  };

  // 7. Delete Subject
  const deleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/subjects/${id}`, getAuthHeaders());
      fetchSubjects();
      notify("success", "Subject deleted successfully!");
    } catch (error) {
      console.error("Error deleting subject:", error);
      notify("danger", error.response?.data?.message || "Failed to delete subject.");
    }
  };

  // Filtered Subjects Computation
  const filteredSubjects = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return subjects.filter((subj) => {
      const matchesSearch =
        subj.subjectName?.toLowerCase().includes(query) ||
        subj.subjectCode?.toLowerCase().includes(query) ||
        subj.className?.toLowerCase().includes(query);

      const matchesSemester =
        selectedSemester === "ALL" || String(subj.semester) === selectedSemester;

      return matchesSearch && matchesSemester;
    });
  }, [subjects, searchTerm, selectedSemester]);

  // Paginated View Slice
  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const currentPaginatedSubjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSubjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSubjects, currentPage, itemsPerPage]);

  return (
    <div className="dashboard-content-area theme-settings-container">
      <Container fluid className="px-4 py-4">
        {/* ALERT NOTIFICATION BAR */}
        {feedback.message && (
          <Alert
            variant={feedback.type}
            onClose={() => setFeedback({ type: "", message: "" })}
            dismissible
            className="mb-4 shadow-sm fs-7"
          >
            {feedback.message}
          </Alert>
        )}

        {/* HEADER TOOLBAR */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
          <div>
            <h3 className="fw-bold tracking-tight mb-1" style={{ color: "var(--text-dark)" }}>
              Subject & Assessment Directory
            </h3>
            <p className="text-muted small mb-0">
              Manage academic subjects, edit details, and configure examination marks modules.
            </p>
          </div>

          <div className="d-flex gap-2">
            <Button
              className="theme-btn-primary fw-medium d-flex align-items-center gap-2 px-3 py-2"
              onClick={onNavigateToAdd}
            >
              <Plus size={18} /> Add New Subject
            </Button>
          </div>
        </div>

        {/* SEARCH AND FILTER BAR */}
        <Card className="theme-card shadow-sm runtime-panel-card mb-4">
          <Card.Body className="p-3">
            <Row className="g-3 align-items-center">
              <Col md={6} lg={7}>
                <InputGroup className="input-group-custom">
                  <InputGroup.Text>
                    <Search size={16} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by subject name, code, or class..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="fs-7"
                  />
                </InputGroup>
              </Col>

              <Col md={4} lg={3}>
                <Form.Select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="fs-7 form-select-custom"
                >
                  <option value="ALL">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={String(sem)}>
                      Semester {sem}
                    </option>
                  ))}
                </Form.Select>
              </Col>

              <Col md={2} lg={2} className="text-end">
                <Button
                  variant="outline-secondary"
                  className="w-100 fs-7 d-flex align-items-center justify-content-center gap-2 py-2"
                  onClick={fetchSubjects}
                  disabled={loading}
                >
                  <RefreshCw size={15} className={loading ? "spin-icon" : ""} /> Refresh
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* SUBJECTS DATA TABLE */}
        <Card className="theme-card shadow-sm runtime-panel-card overflow-hidden">
          <Card.Header className="theme-header py-3 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <BookOpen size={18} className="text-white" />
              <h5 className="mb-0 fw-bold fs-6 text-white">All Registered Subjects</h5>
            </div>
            <Badge bg="light" className="text-primary fs-8 fw-semibold">
              {filteredSubjects.length} Records Found
            </Badge>
          </Card.Header>

          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle mb-0 custom-datagrid">
                <thead>
                  <tr>
                    <th style={{ width: "50px" }}>#</th>
                    <th>Subject Name</th>
                    <th>Code</th>
                    <th>Class</th>
                    <th>Semester</th>
                    <th>Credits</th>
                    <th>Marks Scheme</th>
                    <th style={{ width: "140px" }} className="text-end pe-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-5">
                        <Spinner animation="border" variant="primary" size="sm" />
                        <span className="ms-2 text-muted fs-7">Loading subject records...</span>
                      </td>
                    </tr>
                  ) : currentPaginatedSubjects.length > 0 ? (
                    currentPaginatedSubjects.map((subject, index) => {
                      const modules = subject.marksModules?.length
                        ? subject.marksModules
                        : [
                            { name: "Internal", maxMarks: 20 },
                            { name: "Mid-Term", maxMarks: 30 },
                            { name: "End-Term", maxMarks: 50 },
                          ];
                      const totalMarks = modules.reduce(
                        (sum, m) => sum + (Number(m.maxMarks) || 0),
                        0
                      );
                      const displayIndex = (currentPage - 1) * itemsPerPage + index + 1;

                      return (
                        <tr key={subject._id || index} className="datagrid-row-transition">
                          <td className="text-muted fs-7 ps-3">{displayIndex}</td>
                          <td className="fw-semibold fs-7" style={{ color: "var(--text-dark)" }}>
                            {subject.subjectName}
                          </td>
                          <td>
                            <Badge bg="secondary-subtle" className="text-dark border fs-8">
                              {subject.subjectCode}
                            </Badge>
                          </td>
                          <td className="text-secondary fs-7">{subject.className}</td>
                          <td>
                            <Badge className="badge-modern badge-modern-info">
                              Sem {subject.semester}
                            </Badge>
                          </td>
                          <td>
                            <Badge className="badge-modern badge-modern-success">
                              {subject.credits} Credit(s)
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="light"
                              size="sm"
                              className="border fs-8 fw-medium text-primary d-inline-flex align-items-center gap-1 py-1 px-2"
                              onClick={() =>
                                handleOpenViewModal({ ...subject, marksModules: modules })
                              }
                            >
                              <BarChart2 size={13} /> {modules.length} Modules ({totalMarks} Marks)
                            </Button>
                          </td>
                          <td className="text-end pe-4">
                            <div className="d-flex justify-content-end gap-1">
                              <Button
                                variant="outline-info"
                                size="sm"
                                className="btn-icon p-1"
                                title="View Details"
                                onClick={() =>
                                  handleOpenViewModal({ ...subject, marksModules: modules })
                                }
                              >
                                <Eye size={14} />
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="btn-icon p-1"
                                title="Edit Subject"
                                onClick={() => handleOpenEditModal(subject)}
                              >
                                <Edit3 size={14} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="btn-icon p-1"
                                title="Delete Subject"
                                onClick={() => deleteSubject(subject._id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-muted py-5 fs-7">
                        No subject records found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>

          {/* TABLE PAGINATION FOOTER */}
          {totalPages > 1 && (
            <Card.Footer className="bg-white d-flex justify-content-between align-items-center py-3">
              <span className="text-muted fs-8">
                Page {currentPage} of {totalPages}
              </span>
              <Pagination size="sm" className="mb-0">
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                />
                {[...Array(totalPages)].map((_, idx) => (
                  <Pagination.Item
                    key={idx + 1}
                    active={idx + 1 === currentPage}
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                />
              </Pagination>
            </Card.Footer>
          )}
        </Card>
      </Container>

      {/* VIEW SUBJECT DETAILS MODAL */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Header closeButton className="theme-header text-white">
          <Modal.Title className="fs-6 fw-bold d-flex align-items-center gap-2">
            <BookOpen size={18} /> Subject Evaluation Scheme
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedSubject && (
            <>
              <div className="p-3 mb-4 rounded border bg-light">
                <Row className="g-3">
                  <Col md={6}>
                    <div className="text-muted fs-8">SUBJECT NAME</div>
                    <div className="fw-bold fs-6">{selectedSubject.subjectName}</div>
                  </Col>
                  <Col md={3}>
                    <div className="text-muted fs-8">SUBJECT CODE</div>
                    <div className="fw-semibold fs-7">{selectedSubject.subjectCode}</div>
                  </Col>
                  <Col md={3}>
                    <div className="text-muted fs-8">CREDITS / SEMESTER</div>
                    <div className="fw-semibold fs-7">
                      {selectedSubject.credits} Credits (Sem {selectedSubject.semester})
                    </div>
                  </Col>
                </Row>
              </div>

              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <BarChart2 size={16} className="text-primary" /> Examination Marks Breakdown
              </h6>

              <Table bordered hover responsive className="fs-7 align-middle mb-3">
                <thead className="table-light">
                  <tr>
                    <th>Module / Assessment Type</th>
                    <th className="text-center">Max Marks</th>
                    <th>Weightage Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSubject.marksModules?.map((mod, i) => {
                    const total = selectedSubject.marksModules.reduce(
                      (s, m) => s + Number(m.maxMarks || 0),
                      0
                    );
                    const weightage =
                      total > 0 ? Math.round((Number(mod.maxMarks) / total) * 100) : 0;

                    return (
                      <tr key={i}>
                        <td className="fw-medium">{mod.name}</td>
                        <td className="text-center fw-bold">{mod.maxMarks}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <ProgressBar now={weightage} style={{ height: "6px", width: "80px" }} />
                            <span className="fs-8 text-muted">{weightage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* EDIT SUBJECT MODAL */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton className="theme-header text-white">
          <Modal.Title className="fs-6 fw-bold d-flex align-items-center gap-2">
            <Edit3 size={18} /> Update Subject Details
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="fs-7 fw-semibold text-secondary">Subject Name</Form.Label>
                <InputGroup className="input-group-custom">
                  <InputGroup.Text>
                    <BookOpen size={16} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="subjectName"
                    value={editFormData.subjectName}
                    onChange={handleEditChange}
                    required
                    className="fs-7"
                  />
                </InputGroup>
              </Col>

              <Col md={6}>
                <Form.Label className="fs-7 fw-semibold text-secondary">Subject Code</Form.Label>
                <InputGroup className="input-group-custom">
                  <InputGroup.Text>
                    <Hash size={16} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="subjectCode"
                    value={editFormData.subjectCode}
                    onChange={handleEditChange}
                    required
                    className="fs-7"
                  />
                </InputGroup>
              </Col>

              <Col md={6}>
                <Form.Label className="fs-7 fw-semibold text-secondary">Class Name</Form.Label>
                <InputGroup className="input-group-custom">
                  <InputGroup.Text>
                    <GraduationCap size={16} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    name="className"
                    value={editFormData.className}
                    onChange={handleEditChange}
                    required
                    className="fs-7"
                  />
                </InputGroup>
              </Col>

              <Col md={3}>
                <Form.Label className="fs-7 fw-semibold text-secondary">Semester</Form.Label>
                <InputGroup className="input-group-custom">
                  <InputGroup.Text>
                    <Layers size={16} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="semester"
                    value={editFormData.semester}
                    onChange={handleEditChange}
                    required
                    min="1"
                    className="fs-7"
                  />
                </InputGroup>
              </Col>

              <Col md={3}>
                <Form.Label className="fs-7 fw-semibold text-secondary">Credits</Form.Label>
                <InputGroup className="input-group-custom">
                  <InputGroup.Text>
                    <Award size={16} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="number"
                    name="credits"
                    value={editFormData.credits}
                    onChange={handleEditChange}
                    required
                    min="0"
                    className="fs-7"
                  />
                </InputGroup>
              </Col>
            </Row>

            {/* MARKS MODULES EDITOR */}
            <hr className="my-4" />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0 fs-7 text-dark">Configure Marks Modules</h6>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={addModuleField}
                className="fs-8 py-1 d-flex align-items-center gap-1"
              >
                <Plus size={14} /> Add Module
              </Button>
            </div>

            {editFormData.marksModules.map((mod, index) => (
              <Row key={index} className="g-2 mb-2 align-items-center">
                <Col md={6}>
                  <Form.Control
                    type="text"
                    placeholder="Module Name (e.g. Mid Sem)"
                    value={mod.name}
                    onChange={(e) => handleModuleChange(index, "name", e.target.value)}
                    required
                    className="fs-7"
                  />
                </Col>
                <Col md={5}>
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
                  {editFormData.marksModules.length > 1 && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => removeModuleField(index)}
                      className="p-1 btn-icon"
                    >
                      <X size={14} />
                    </Button>
                  )}
                </Col>
              </Row>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" size="sm" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updating}
              className="theme-btn-primary size-sm d-flex align-items-center gap-2"
            >
              {updating ? <Spinner animation="border" size="sm" /> : <Save size={16} />} Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* STYLING OVERRIDES */}
      <style>{`
        .dashboard-content-area { color: var(--text-dark); }
        .fs-7 { font-size: 0.875rem !important; }
        .fs-8 { font-size: 0.75rem !important; }
        .tracking-tight { letter-spacing: -0.02em; }
        .runtime-panel-card { border-radius: 12px; }

        .input-group-custom .form-control { border-left: none; padding-top: 8px; padding-bottom: 8px; border-color: var(--primary-border); border-top-right-radius: 8px !important; border-bottom-right-radius: 8px !important; }
        .input-group-custom .input-group-text { background-color: var(--card-bg); border-right: none; border-color: var(--primary-border); border-top-left-radius: 8px !important; border-bottom-left-radius: 8px !important; }

        .custom-datagrid th { background-color: var(--primary-light); color: var(--text-dark); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 12px 14px; border-top: none; border-bottom: 2px solid var(--primary-border); }
        .custom-datagrid td { padding: 12px 14px; border-bottom: 1px solid var(--primary-border); }
        .datagrid-row-transition:hover { background-color: var(--primary-light) !important; }

        .badge-modern { padding: 5px 9px; font-weight: 500; font-size: 0.725rem; border-radius: 6px; }
        .badge-modern-info { background-color: #e0f2fe !important; color: #0369a1 !important; }
        .badge-modern-success { background-color: #dcfce7 !important; color: #15803d !important; }

        .btn-icon { width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-icon { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default ViewSubjects;