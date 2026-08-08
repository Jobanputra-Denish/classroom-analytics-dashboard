import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Container, Row, Col, Card, Table, Badge, InputGroup, Form, Button, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Search, Pencil, Trash2, Users, UserCheck, ArrowUpDown, ChevronLeft, ChevronRight, UserPlus, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Import centralized API calls
import { getStudents, deleteStudent } from "../../api/studentApi";
import "../Setings/SettingsTheme.css"; // Uses your global theme tokens

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [sortField, setSortField] = useState("fullname");
  const [sortDirection, setSortDirection] = useState("asc");

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // Unified fetch function using API service
  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Use centralized API service
      const res = await getStudents();
      setStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      // Optional: Add global error handling here (e.g., redirect to login on 401)
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student record?")) return;
    try {
      // Use centralized API service
      await deleteStudent(id);
      fetchStudents(); // Refresh list after deletion
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const handleEdit = useCallback((student) => {
    navigate("/students", { state: { editStudent: student } });
  }, [navigate]);

  useEffect(() => {
    fetchStudents();
  }, []);

  // ANALYTICAL STATS
  const stats = useMemo(() => {
    const total = students.length;
    const male = students.filter((s) => s.gender === "male").length;
    const female = students.filter((s) => s.gender === "female").length;
    return { total, male, female };
  }, [students]);

  // SORTING & FILTERING ENGINE
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const processedStudents = useMemo(() => {
    let result = [...students];

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (student) =>
          student.fullname?.toLowerCase().includes(query) ||
          student.email?.toLowerCase().includes(query) ||
          student.StudentId?.toLowerCase().includes(query) ||
          student.className?.toLowerCase().includes(query)
      );
    }

    if (genderFilter !== "all") {
      result = result.filter((student) => student.gender === genderFilter);
    }

    result.sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";
      return sortDirection === "asc"
        ? valA.toString().localeCompare(valB.toString())
        : valB.toString().localeCompare(valA.toString());
    });

    return result;
  }, [students, searchTerm, genderFilter, sortField, sortDirection]);

  // PAGINATION SLICE
  const totalPages = Math.ceil(processedStudents.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedStudents.slice(start, start + itemsPerPage);
  }, [processedStudents, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, genderFilter]);

  return (
    <div className="dashboard-content-area theme-settings-container">
      <Container fluid className="px-4 py-4">
        {/* HEADER BRANDING BANNER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
          <div>
            <h3 className="fw-bold tracking-tight mb-1" style={{ color: "var(--text-dark)" }}>
              Student Directory
            </h3>
            <p className="text-muted small mb-0">Overview, search, filter, and manage registered student records.</p>
          </div>
          <Button className="theme-btn-primary d-flex align-items-center gap-2" onClick={() => navigate("/students")}>
            <UserPlus size={16} /> Enroll New Student
          </Button>
        </div>

        {/* METRICS ANALYTICS PANEL */}
        <Row className="mb-4 g-3">
          <Col xs={12} sm={4}>
            <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Total Enrolled</span>
                  <h3 className="fw-bold mb-0" style={{ color: "var(--text-dark)" }}>{stats.total}</h3>
                </div>
                <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary-color)" }}>
                  <Users size={22} />
                </div>
              </Card.Body>
              <div className="card-decoration-line" style={{ backgroundColor: "var(--primary-color)" }}></div>
            </Card>
          </Col>

          <Col xs={12} sm={4}>
            <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Male Students</span>
                  <h3 className="fw-bold mb-0 text-primary">{stats.male}</h3>
                </div>
                <div className="metric-icon-wrapper bg-primary-subtle text-primary">
                  <UserCheck size={22} />
                </div>
              </Card.Body>
              <div className="card-decoration-line bg-primary"></div>
            </Card>
          </Col>

          <Col xs={12} sm={4}>
            <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Female Students</span>
                  <h3 className="fw-bold mb-0 text-danger">{stats.female}</h3>
                </div>
                <div className="metric-icon-wrapper bg-danger-subtle text-danger">
                  <UserCheck size={22} />
                </div>
              </Card.Body>
              <div className="card-decoration-line bg-danger"></div>
            </Card>
          </Col>
        </Row>

        {/* MAIN DATA TABLE CARD */}
        <Card className="theme-card shadow-sm runtime-panel-card overflow-hidden">
          <Card.Header className="bg-transparent py-3 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-3">
            <h5 className="mb-0 fw-bold" style={{ color: "var(--text-dark)" }}>Directory Registry</h5>
            <div className="d-flex gap-2 align-items-center">
              <Dropdown>
                <Dropdown.Toggle variant="light" className="btn-sm border d-flex align-items-center gap-2 text-secondary">
                  <Filter size={14} /> Gender: {genderFilter.toUpperCase()}
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item onClick={() => setGenderFilter("all")}>All Gender Types</Dropdown.Item>
                  <Dropdown.Item onClick={() => setGenderFilter("male")}>Male Only</Dropdown.Item>
                  <Dropdown.Item onClick={() => setGenderFilter("female")}>Female Only</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Card.Header>

          <Card.Body className="p-0">
            {/* SEARCH TOOLBAR */}
            <div className="p-3 bg-light-subtle border-bottom">
              <InputGroup className="search-input-group shadow-none border rounded-3 overflow-hidden">
                <InputGroup.Text className="bg-transparent border-0 pe-1">
                  <Search size={16} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by student name, enrollment ID, email or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 shadow-none ps-2 fs-7"
                />
              </InputGroup>
            </div>

            {/* DYNAMIC DATAGRID */}
            <div className="table-responsive">
              <Table hover className="align-middle mb-0 custom-datagrid">
                <thead>
                  <tr>
                    <th style={{ width: "60px" }}>Idx</th>
                    <th className="sortable-th" onClick={() => handleSort("fullname")}>
                      Student Identity <ArrowUpDown size={12} className="ms-1 text-muted" />
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("email")}>
                      Email Address <ArrowUpDown size={12} className="ms-1 text-muted" />
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("className")}>
                      Class & Sec <ArrowUpDown size={12} className="ms-1 text-muted" />
                    </th>
                    <th className="sortable-th" onClick={() => handleSort("gender")}>
                      Gender <ArrowUpDown size={12} className="ms-1 text-muted" />
                    </th>
                    <th>Contact</th>
                    <th className="text-end pe-4" style={{ width: "110px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <div className="spinner-border spinner-border-sm me-2" style={{ color: "var(--primary-color)" }} role="status"></div>
                        <span className="text-muted small">Loading directory records...</span>
                      </td>
                    </tr>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((student, index) => (
                      <tr key={student._id} className="datagrid-row-transition">
                        <td className="text-muted fs-7 ps-3">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>
                          <div className="fw-semibold fs-7" style={{ color: "var(--text-dark)" }}>{student.fullname}</div>
                          <span className="badge-code-pill">{student.StudentId}</span>
                        </td>
                        <td className="text-secondary fs-7">{student.email}</td>
                        <td>
                          <span className="fs-7 fw-medium" style={{ color: "var(--text-dark)" }}>{student.className}</span>
                          {student.section && <small className="text-muted ms-1">({student.section})</small>}
                        </td>
                        <td>
                          {student.gender === "male" ? (
                            <Badge className="badge-modern badge-modern-primary">Male</Badge>
                          ) : (
                            <Badge className="badge-modern badge-modern-danger">Female</Badge>
                          )}
                        </td>
                        <td className="text-secondary fs-7">{student.phoneNumber || "—"}</td>
                        <td className="text-end pe-3">
                          <div className="d-flex justify-content-end gap-1">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Edit Record</Tooltip>}>
                              <Button size="sm" variant="action-edit" onClick={() => handleEdit(student)} className="p-1.5 rounded-2">
                                <Pencil size={14} />
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete Student</Tooltip>}>
                              <Button size="sm" variant="action-delete" onClick={() => handleDelete(student._id)} className="p-1.5 rounded-2">
                                <Trash2 size={14} />
                              </Button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-5 fs-7">
                        No students match the selected search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {/* PAGINATION FOOTER */}
            <div className="p-3 border-top bg-light-subtle d-flex align-items-center justify-content-between flex-wrap gap-2">
              <span className="text-muted fs-7">
                Showing <strong>{Math.min(processedStudents.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(processedStudents.length, currentPage * itemsPerPage)}</strong> of <strong>{processedStudents.length}</strong> entries
              </span>
              <div className="d-flex gap-1 align-items-center">
                <Button variant="light" size="sm" className="btn-nav-arrow border" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
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
                <Button variant="light" size="sm" className="btn-nav-arrow border" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>

      {/* COMPACT STYLING RUNTIME OVERRIDES */}
      <style>{`
        .dashboard-content-area { color: var(--text-dark); }
        .fs-7 { font-size: 0.875rem !important; }
        .fs-8 { font-size: 0.75rem !important; }

        /* METRIC CARDS */
        .metric-card { border-radius: 12px; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .metric-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important; }
        .metric-icon-wrapper { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .card-decoration-line { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }
        .runtime-panel-card { border-radius: 12px; }

        /* DATAGRID TABLE */
        .custom-datagrid th { background-color: var(--primary-light); color: var(--text-dark); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 14px 16px; border-top: none; border-bottom: 2px solid var(--primary-border); }
        .custom-datagrid td { padding: 14px 16px; border-bottom: 1px solid var(--primary-border); }
        .datagrid-row-transition { transition: background-color 0.15s ease; }
        .datagrid-row-transition:hover { background-color: var(--primary-light) !important; }
        .sortable-th { cursor: pointer; user-select: none; }

        /* BADGES */
        .badge-modern { padding: 6px 10px; font-weight: 500; font-size: 0.75rem; border-radius: 6px; }
        .badge-modern-primary { background-color: #e0e7ff !important; color: #3730a3 !important; }
        .badge-modern-danger { background-color: #fee2e2 !important; color: #991b1b !important; }
        .badge-code-pill { background: var(--primary-light); color: var(--primary-color); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-family: monospace; font-weight: 600; display: inline-block; margin-top: 2px; }

        /* BUTTONS & PAGINATION */
        .btn-action-edit { background: none; border: none; color: #d97706; transition: background 0.2s; }
        .btn-action-edit:hover { background: #fef3c7; color: #b45309; }
        .btn-action-delete { background: none; border: none; color: #dc2626; transition: background 0.2s; }
        .btn-action-delete:hover { background: #fee2e2; color: #b91c1c; }
        .btn-page-number, .btn-nav-arrow { width: 32px; height: 32px; padding: 0; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; font-size: 0.875rem; }
      `}</style>
    </div>
  );
};

export default ViewStudents;