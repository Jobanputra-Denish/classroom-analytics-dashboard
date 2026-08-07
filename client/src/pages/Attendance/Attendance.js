import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Table, Badge, InputGroup, OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";
import { User, BookOpen, CalendarDays, CheckCircle2, XCircle, Search, Pencil, Trash2, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, FileDown, Layers, Percent } from "lucide-react";
import "../Setings/SettingsTheme.css"; // Uses your global theme tokens

const Attendance = () => {
  // STATE MANAGEMENT
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  // SEARCH, FILTER, AND PAGINATION STATE
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",   // Stores custom StudentId (e.g., "STU101")
    subjectCode: "", // Stores subjectCode (e.g., "MTH101")
    date: new Date().toISOString().split("T")[0],
    status: "",
  });

  const token = localStorage.getItem("token");

  // VALUE CACHING LAYER (USECALLBACK & USEMEMO)
  const handleChange = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const getStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Failed fetching students:", error);
    }
  };

  const getSubjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
    } catch (error) {
      console.error("Failed fetching subjects:", error);
    }
  };

  const getAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(res.data);
    } catch (error) {
      console.error("Failed fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudents();
    getSubjects();
    getAttendance();
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      studentId: "",
      subjectCode: "",
      date: new Date().toISOString().split("T")[0],
      status: "",
    });
    setEditId(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/attendance/${editId}`,
          { status: formData.status, date: formData.date },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/attendance", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      resetForm();
      getAttendance();
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred updating records.");
    }
  };

  const handleEdit = useCallback((record) => {
    setEditId(record._id);
    setFormData({
      studentId: record.studentId?.StudentId || "",
      subjectCode: record.subjectId?.subjectCode || "",
      date: record.date ? record.date.split("T")[0] : "",
      status: record.status || "",
    });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/attendance/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getAttendance();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to delete record.");
    }
  };

  // HIGH PERFORMANCE DATA FILTERING & MEMOIZATION ENGINE
  const dashboardStats = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter((item) => item.status === "present").length;
    const absent = total - present;
    const rate = total === 0 ? "0.00" : ((present / total) * 100).toFixed(2);
    return { total, present, absent, rate };
  }, [attendance]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const processedAttendance = useMemo(() => {
    let result = [...attendance];

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.studentId?.fullname?.toLowerCase().includes(query) ||
          item.studentId?.StudentId?.toLowerCase().includes(query) ||
          item.subjectId?.subjectName?.toLowerCase().includes(query) ||
          item.subjectId?.subjectCode?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    result.sort((a, b) => {
      let valA = "", valB = "";
      if (sortField === "student") {
        valA = a.studentId?.fullname || "";
        valB = b.studentId?.fullname || "";
      } else if (sortField === "subject") {
        valA = a.subjectId?.subjectName || "";
        valB = b.subjectId?.subjectName || "";
      } else if (sortField === "date") {
        valA = a.date || "";
        valB = b.date || "";
      } else if (sortField === "status") {
        valA = a.status || "";
        valB = b.status || "";
      }
      return sortDirection === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    return result;
  }, [attendance, searchTerm, statusFilter, sortField, sortDirection]);

  // PAGINATION COMPUTE SLICES
  const totalPages = Math.ceil(processedAttendance.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedAttendance.slice(start, start + itemsPerPage);
  }, [processedAttendance, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="dashboard-content-area theme-settings-container">
      <Container fluid className="px-4 py-4">
        {/* HEADER BRANDING BANNER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
          <div>
            <h3 className="fw-bold tracking-tight mb-1" style={{ color: "var(--text-dark)" }}>
              Attendance Analytics
            </h3>
            <p className="text-muted small mb-0">Track real-time student presence, trends, and logging parameters.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" className="btn-custom d-flex align-items-center gap-2">
              <FileDown size={16} /> Export CSV
            </Button>
          </div>
        </div>

        {/* METRICS ANALYTICS PANEL */}
        <Row className="mb-4 g-3">
          <Col xs={12} sm={6} xl={3}>
            <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Total Logs</span>
                  <h3 className="fw-bold mb-0" style={{ color: "var(--text-dark)" }}>{dashboardStats.total}</h3>
                </div>
                <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary-color)" }}>
                  <Layers size={22} />
                </div>
              </Card.Body>
              <div className="card-decoration-line" style={{ backgroundColor: "var(--primary-color)" }}></div>
            </Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Present Claims</span>
                  <h3 className="fw-bold mb-0 text-success">{dashboardStats.present}</h3>
                </div>
                <div className="metric-icon-wrapper bg-success-subtle text-success">
                  <CheckCircle2 size={22} />
                </div>
              </Card.Body>
              <div className="card-decoration-line bg-success"></div>
            </Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Absences Logged</span>
                  <h3 className="fw-bold mb-0 text-danger">{dashboardStats.absent}</h3>
                </div>
                <div className="metric-icon-wrapper bg-danger-subtle text-danger">
                  <XCircle size={22} />
                </div>
              </Card.Body>
              <div className="card-decoration-line bg-danger"></div>
            </Card>
          </Col>
          <Col xs={12} sm={6} xl={3}>
            <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Net Rate</span>
                  <h3 className="fw-bold mb-0" style={{ color: "var(--primary-color)" }}>{dashboardStats.rate}%</h3>
                </div>
                <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary-color)" }}>
                  <Percent size={22} />
                </div>
              </Card.Body>
              <div className="card-decoration-line" style={{ backgroundColor: "var(--primary-color)" }}></div>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          {/* INTERACTIVE COMPOSER PANEL */}
          <Col xl={4} lg={5} xs={12}>
            <Card className="theme-card shadow-sm runtime-panel-card sticky-xl-top" style={{ top: "100px", zIndex: 10 }}>
              <Card.Header className="theme-header py-3">
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                  <span className={`status-indicator-dot ${editId ? "bg-warning animate-pulse" : "bg-white"}`}></span>
                  {editId ? "Modify Attendance Record" : "Log Daily Attendance"}
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fs-7 fw-semibold text-secondary">Target Student Identity</Form.Label>
                    <InputGroup className="input-group-custom">
                      <InputGroup.Text><User size={16} className="text-muted" /></InputGroup.Text>
                      <Form.Select 
                        name="studentId" 
                        value={formData.studentId} 
                        onChange={handleChange} 
                        required 
                        disabled={!!editId}
                      >
                        <option value="">Choose matching student profile</option>
                        {students.map((student) => (
                          <option key={student._id} value={student.StudentId}>
                            {student.fullname} ({student.StudentId})
                          </option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fs-7 fw-semibold text-secondary">Subject Reference</Form.Label>
                    <InputGroup className="input-group-custom">
                      <InputGroup.Text><BookOpen size={16} className="text-muted" /></InputGroup.Text>
                      <Form.Select 
                        name="subjectCode" 
                        value={formData.subjectCode} 
                        onChange={handleChange} 
                        required 
                        disabled={!!editId}
                      >
                        <option value="">Select current core syllabus</option>
                        {subjects.map((subject) => (
                          <option key={subject._id} value={subject.subjectCode}>
                            {subject.subjectName} ({subject.subjectCode})
                          </option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fs-7 fw-semibold text-secondary">Calendar Logging Date</Form.Label>
                    <InputGroup className="input-group-custom">
                      <InputGroup.Text><CalendarDays size={16} className="text-muted" /></InputGroup.Text>
                      <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} max={new Date().toISOString().split("T")[0]} required />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fs-7 fw-semibold text-secondary">Attendance Metric State</Form.Label>
                    <div className="d-flex gap-3 status-radio-group">
                      <label className={`status-radio-tile flex-fill text-center ${formData.status === "present" ? "active-present" : ""}`}>
                        <input type="radio" name="status" value="present" checked={formData.status === "present"} onChange={handleChange} required className="d-none" />
                        <CheckCircle2 size={18} className="mb-1 d-block mx-auto text-success" />
                        <span className="fs-7 fw-medium" style={{ color: "var(--text-dark)" }}>Present</span>
                      </label>
                      <label className={`status-radio-tile flex-fill text-center ${formData.status === "absent" ? "active-absent" : ""}`}>
                        <input type="radio" name="status" value="absent" checked={formData.status === "absent"} onChange={handleChange} required className="d-none" />
                        <XCircle size={18} className="mb-1 d-block mx-auto text-danger" />
                        <span className="fs-7 fw-medium" style={{ color: "var(--text-dark)" }}>Absent</span>
                      </label>
                    </div>
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button type="submit" className="flex-fill theme-btn-primary shadow-sm fw-medium">
                      {editId ? "Apply Modifications" : "Commit Record"}
                    </Button>
                    <Button variant="light" type="button" onClick={resetForm} className="btn-action text-secondary border">
                      Reset
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* DATAGRID RECORDS TABLE LAYERING */}
          <Col xl={8} lg={7} xs={12}>
            <Card className="theme-card shadow-sm runtime-panel-card overflow-hidden">
              <Card.Header className="bg-transparent py-3 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-3">
                <h5 className="mb-0 fw-bold" style={{ color: "var(--text-dark)" }}>Operational Log Streams</h5>
                <div className="d-flex gap-2 align-items-center">
                  <Dropdown>
                    <Dropdown.Toggle variant="light" className="btn-sm border d-flex align-items-center gap-2 text-secondary">
                      <SlidersHorizontal size={14} /> View Filter: {statusFilter.toUpperCase()}
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                      <Dropdown.Item onClick={() => setStatusFilter("all")}>All Records</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatusFilter("present")}>Present States Only</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatusFilter("absent")}>Absent States Only</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                {/* TOOLBAR CONTROL FILTERS */}
                <div className="p-3 bg-light-subtle border-bottom">
                  <InputGroup className="search-input-group shadow-none border rounded-3 overflow-hidden">
                    <InputGroup.Text className="bg-transparent border-0 pe-1">
                      <Search size={16} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control type="text" placeholder="Filter runtime stack by Student Name, ID, Course Code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-0 shadow-none ps-2 fs-7" />
                  </InputGroup>
                </div>

                {/* RESPONSIVE TABLE LAYER */}
                <div className="table-responsive dynamic-table-container">
                  <Table hover className="align-middle mb-0 custom-datagrid">
                    <thead>
                      <tr>
                        <th style={{ width: "60px" }}>Idx</th>
                        <th className="sortable-th" onClick={() => handleSort("student")}>
                          Student Structure <ArrowUpDown size={12} className="ms-1 text-muted" />
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("subject")}>
                          Subject Assignment <ArrowUpDown size={12} className="ms-1 text-muted" />
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("date")}>
                          Log Date <ArrowUpDown size={12} className="ms-1 text-muted" />
                        </th>
                        <th className="sortable-th" onClick={() => handleSort("status")}>
                          Status <ArrowUpDown size={12} className="ms-1 text-muted" />
                        </th>
                        <th className="text-end pe-4" style={{ width: "110px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <div className="spinner-border spinner-border-sm me-2" style={{ color: "var(--primary-color)" }} role="status"></div>
                            <span className="text-muted small">Synchronizing datagrid buffers...</span>
                          </td>
                        </tr>
                      ) : paginatedData.length > 0 ? (
                        paginatedData.map((item, index) => (
                          <tr key={item._id} className="datagrid-row-transition">
                            <td className="text-muted fs-7 ps-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>
                              <div className="fw-semibold fs-7" style={{ color: "var(--text-dark)" }}>{item.studentId?.fullname || "Unknown Native"}</div>
                              <div className="text-muted fs-8 tracking-wider">{item.studentId?.StudentId || "N/A"}</div>
                            </td>
                            <td>
                              <div className="fs-7" style={{ color: "var(--text-dark)" }}>{item.subjectId?.subjectName || "Unassigned"}</div>
                              <span className="badge-code-pill">{item.subjectId?.subjectCode || "ERR"}</span>
                            </td>
                            <td className="text-secondary fs-7">
                              {item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                            </td>
                            <td>
                              {item.status === "present" ? (
                                <Badge className="badge-modern badge-modern-success">Present</Badge>
                              ) : (
                                <Badge className="badge-modern badge-modern-danger">Absent</Badge>
                              )}
                            </td>
                            <td className="text-end pe-3">
                              <div className="d-flex justify-content-end gap-1">
                                <OverlayTrigger placement="top" overlay={<Tooltip>Edit Metadata</Tooltip>}>
                                  <Button size="sm" variant="action-edit" onClick={() => handleEdit(item)} className="p-1.5 rounded-2"><Pencil size={14} /></Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={<Tooltip>Purge Log</Tooltip>}>
                                  <Button size="sm" variant="action-delete" onClick={() => handleDelete(item._id)} className="p-1.5 rounded-2"><Trash2 size={14} /></Button>
                                </OverlayTrigger>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center text-muted py-5 fs-7">
                            No operational logs match current search parameters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* ADVANCED PAGINATION COMPONENT FOOTER */}
                <div className="p-3 border-top bg-light-subtle d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <span className="text-muted fs-7">
                    Showing <strong>{Math.min(processedAttendance.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(processedAttendance.length, currentPage * itemsPerPage)}</strong> of <strong>{processedAttendance.length}</strong> parameters
                  </span>
                  <div className="d-flex gap-1 align-items-center">
                    <Button variant="light" size="sm" className="btn-nav-arrow border" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
                      <ChevronLeft size={16} />
                    </Button>
                    {[...Array(totalPages)].map((_, idx) => (
                      <Button 
                        key={idx} 
                        size="sm" 
                        className={`btn-page-number ${currentPage === idx + 1 ? "theme-btn-primary shadow-none" : "border text-secondary bg-white"}`} 
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </Button>
                    ))}
                    <Button variant="light" size="sm" className="btn-nav-arrow border" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
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
        .tracking-wider { letter-spacing: 0.05em; }
        
        /* CARD OVERRIDES */
        .metric-card { border-radius: 12px; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .metric-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important; }
        .metric-icon-wrapper { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .card-decoration-line { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }
        .runtime-panel-card { border-radius: 12px; }
        
        /* FORM CONTROLS UI */
        .input-group-custom .form-control, .input-group-custom .form-select { border-left: none; padding-top: 9px; padding-bottom: 9px; font-size: 0.875rem; border-color: var(--primary-border); border-top-right-radius: 8px !important; border-bottom-right-radius: 8px !important; }
        .input-group-custom .input-group-text { background-color: var(--card-bg); border-right: none; border-color: var(--primary-border); border-top-left-radius: 8px !important; border-bottom-left-radius: 8px !important; }
        .form-control:focus, .form-select:focus { border-color: var(--primary-color) !important; box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.15) !important; }
        
        /* CUSTOM ACTIVE RADIO TILES */
        .status-radio-tile { border: 1px solid var(--primary-border); padding: 12px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; background: var(--card-bg); }
        .status-radio-tile:hover { background: var(--primary-light); border-color: var(--primary-color); }
        .active-present { border-color: #10b981 !important; background-color: #f0fdf4 !important; }
        .active-absent { border-color: #ef4444 !important; background-color: #fef2f2 !important; }
        .status-indicator-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        
        /* MODERN INTERACTIVE DATAGRID TABLE */
        .custom-datagrid th { background-color: var(--primary-light); color: var(--text-dark); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 14px 16px; border-top: none; border-bottom: 2px solid var(--primary-border); }
        .custom-datagrid td { padding: 14px 16px; border-bottom: 1px solid var(--primary-border); }
        .datagrid-row-transition { transition: background-color 0.15s ease; }
        .datagrid-row-transition:hover { background-color: var(--primary-light) !important; }
        .sortable-th { cursor: pointer; user-select: none; }
        .sortable-th:hover { background-color: var(--primary-light); }
        
        /* MINIMALIST BADGE MODS */
        .badge-modern { padding: 6px 10px; font-weight: 500; font-size: 0.75rem; border-radius: 6px; }
        .badge-modern-success { background-color: #d1fae5 !important; color: #065f46 !important; }
        .badge-modern-danger { background-color: #fee2e2 !important; color: #991b1b !important; }
        .badge-code-pill { background: var(--primary-light); color: var(--primary-color); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-family: monospace; font-weight: 600; display: inline-block; margin-top: 3px; }
        
        /* HOVER CONTROL BUTTONS */
        .btn-action-edit { background: none; border: none; color: #d97706; transition: background 0.2s; }
        .btn-action-edit:hover { background: #fef3c7; color: #b45309; }
        .btn-action-delete { background: none; border: none; color: #dc2626; transition: background 0.2s; }
        .btn-action-delete:hover { background: #fee2e2; color: #b91c1c; }
        
        /* PAGINATION ELEMENTS UI */
        .btn-page-number, .btn-nav-arrow { width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; font-size: 0.875rem; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
      `}</style>
    </div>
  );
};

export default Attendance;