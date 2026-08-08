import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card, Table, Badge, InputGroup, Form, Button, Nav } from "react-bootstrap";
import { Search, Filter, BookOpen, Award, BarChart2, Plus, Percent, FolderX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../Setings/SettingsTheme.css"; // Uses your global theme tokens

const ViewMarks = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [termFilter, setTermFilter] = useState("");
  const [activeSubjectTab, setActiveSubjectTab] = useState("ALL");

  const navigate = useNavigate();

  useEffect(() => {
    fetchMarks();
  }, []);

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

  // Filter marks by student name search & examination term
  const filteredMarks = useMemo(() => {
    return marks.filter((mark) => {
      const studentMatch = (mark.studentId?.fullname || "")
        .toLowerCase()
        .includes(search.toLowerCase());
      const termMatch = termFilter === "" || mark.term === termFilter;
      return studentMatch && termMatch;
    });
  }, [marks, search, termFilter]);

  // Group filtered marks by Subject Name
  const groupedBySubject = useMemo(() => {
    return filteredMarks.reduce((acc, mark) => {
      const subjectName = mark.subjectId?.subjectName || "Unassigned Subject";
      if (!acc[subjectName]) acc[subjectName] = [];
      acc[subjectName].push(mark);
      return acc;
    }, {});
  }, [filteredMarks]);

  const subjectList = Object.keys(groupedBySubject);

  // METRIC SUMMARY CALCULATIONS
  const stats = useMemo(() => {
    const totalEntries = filteredMarks.length;
    if (totalEntries === 0) return { totalEntries: 0, avgPercentage: 0, passRate: 0 };

    let totalPctSum = 0;
    let passedCount = 0;

    filteredMarks.forEach((m) => {
      const pct = (m.obtainedMarks / m.totalMarks) * 100;
      totalPctSum += pct;
      if (pct >= 40) passedCount++;
    });

    return {
      totalEntries,
      avgPercentage: (totalPctSum / totalEntries).toFixed(1),
      passRate: ((passedCount / totalEntries) * 100).toFixed(0),
    };
  }, [filteredMarks]);

  return (
    <div className="dashboard-content-area theme-settings-container">
      <Container fluid className="px-4 py-4">
        {/* HEADER BRANDING BANNER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
          <div>
            <h3 className="fw-bold tracking-tight mb-1" style={{ color: "var(--text-dark)" }}>
              Subject-Wise Performance Directory
            </h3>
            <p className="text-muted small mb-0">Overview of student examination performance organized by academic courses.</p>
          </div>
          <Button className="theme-btn-primary d-flex align-items-center gap-2" onClick={() => navigate("/marks")}>
            <Plus size={16} /> New Marks Entry
          </Button>
        </div>

        {/* METRICS SUMMARY CARDS */}
        <Row className="mb-4 g-3">
          <Col xs={12} sm={4}>
            <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Total Marks Logs</span>
                  <h3 className="fw-bold mb-0" style={{ color: "var(--text-dark)" }}>{stats.totalEntries}</h3>
                </div>
                <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary-color)" }}>
                  <Award size={22} />
                </div>
              </Card.Body>
              <div className="card-decoration-line" style={{ backgroundColor: "var(--primary-color)" }}></div>
            </Card>
          </Col>

          <Col xs={12} sm={4}>
            <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Class Aggregate Avg</span>
                  <h3 className="fw-bold mb-0 text-primary">{stats.avgPercentage}%</h3>
                </div>
                <div className="metric-icon-wrapper bg-primary-subtle text-primary">
                  <BarChart2 size={22} />
                </div>
              </Card.Body>
              <div className="card-decoration-line bg-primary"></div>
            </Card>
          </Col>

          <Col xs={12} sm={4}>
            <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Overall Pass Ratio</span>
                  <h3 className="fw-bold mb-0 text-success">{stats.passRate}%</h3>
                </div>
                <div className="metric-icon-wrapper bg-success-subtle text-success">
                  <Percent size={22} />
                </div>
              </Card.Body>
              <div className="card-decoration-line bg-success"></div>
            </Card>
          </Col>
        </Row>

        {/* SEARCH & FILTER TOOLBAR */}
        <Card className="theme-card shadow-sm runtime-panel-card mb-4">
          <Card.Body className="p-3">
            <Row className="g-3">
              <Col md={7}>
                <InputGroup className="search-input-group shadow-none border rounded-3 overflow-hidden">
                  <InputGroup.Text className="bg-transparent border-0 pe-1">
                    <Search size={16} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search candidate by student name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-0 shadow-none ps-2 fs-7"
                  />
                </InputGroup>
              </Col>
              <Col md={5}>
                <InputGroup className="search-input-group shadow-none border rounded-3 overflow-hidden">
                  <InputGroup.Text className="bg-transparent border-0 pe-1">
                    <Filter size={16} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Select value={termFilter} onChange={(e) => setTermFilter(e.target.value)} className="border-0 shadow-none fs-7">
                    <option value="">All Examination Terms</option>
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="Final-Term">Final-Term</option>
                  </Form.Select>
                </InputGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* SUBJECT NAVIGATION TABS */}
        {subjectList.length > 0 && (
          <Nav variant="pills" className="custom-subject-tabs mb-4 gap-2 border-bottom pb-3">
            <Nav.Item>
              <Nav.Link
                active={activeSubjectTab === "ALL"}
                onClick={() => setActiveSubjectTab("ALL")}
                className="rounded-3 fs-7 fw-medium d-flex align-items-center gap-2"
              >
                All Subjects <Badge bg={activeSubjectTab === "ALL" ? "light" : "secondary"} className={activeSubjectTab === "ALL" ? "text-dark" : ""}>{filteredMarks.length}</Badge>
              </Nav.Link>
            </Nav.Item>
            {subjectList.map((subject) => (
              <Nav.Item key={subject}>
                <Nav.Link
                  active={activeSubjectTab === subject}
                  onClick={() => setActiveSubjectTab(subject)}
                  className="rounded-3 fs-7 fw-medium d-flex align-items-center gap-2"
                >
                  {subject} <Badge bg={activeSubjectTab === subject ? "light" : "secondary"} className={activeSubjectTab === subject ? "text-dark" : ""}>{groupedBySubject[subject].length}</Badge>
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        )}

        {/* SUBJECT CONTENT TABLES */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border spinner-border-sm me-2" style={{ color: "var(--primary-color)" }} role="status"></div>
            <span className="text-muted small">Loading subject performance lists...</span>
          </div>
        ) : subjectList.length === 0 ? (
          <Card className="theme-card shadow-sm text-center py-5">
            <Card.Body>
              <FolderX size={48} className="text-muted mb-3" />
              <h5 className="fw-bold mb-1" style={{ color: "var(--text-dark)" }}>No Records Found</h5>
              <p className="text-muted fs-7 mb-0">Try clearing or adjusting search filters to display result logs.</p>
            </Card.Body>
          </Card>
        ) : (
          subjectList
            .filter((subj) => activeSubjectTab === "ALL" || activeSubjectTab === subj)
            .map((subject) => (
              <Card className="theme-card shadow-sm runtime-panel-card mb-4 overflow-hidden" key={subject}>
                <Card.Header className="theme-header py-3 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 text-white">
                    <BookOpen size={18} /> {subject}
                  </h5>
                  <Badge bg="light" className="text-primary fw-semibold fs-7 px-3 py-1.5 rounded-pill">
                    {groupedBySubject[subject].length} Student(s) Enrolled
                  </Badge>
                </Card.Header>

                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="align-middle mb-0 custom-datagrid">
                      <thead>
                        <tr>
                          <th style={{ width: "60px" }}>Idx</th>
                          <th>Student Name</th>
                          <th>Student ID</th>
                          <th>Exam Term</th>
                          <th>Obtained</th>
                          <th>Total</th>
                          <th>Percentage Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedBySubject[subject].map((mark, index) => {
                          const percentage = ((mark.obtainedMarks / mark.totalMarks) * 100).toFixed(2);
                          return (
                            <tr key={mark._id} className="datagrid-row-transition">
                              <td className="text-muted fs-7 ps-3">{index + 1}</td>
                              <td className="fw-semibold fs-7" style={{ color: "var(--text-dark)" }}>
                                {mark.studentId?.fullname || <span className="text-danger italic">Student Deleted</span>}
                              </td>
                              <td className="text-secondary fs-7">{mark.studentId?.StudentId || "—"}</td>
                              <td>
                                <Badge className={mark.term === "Mid-Term" ? "badge-modern badge-modern-info" : "badge-modern badge-modern-dark"}>
                                  {mark.term}
                                </Badge>
                              </td>
                              <td className="fw-bold fs-7" style={{ color: "var(--text-dark)" }}>{mark.obtainedMarks}</td>
                              <td className="text-secondary fs-7">{mark.totalMarks}</td>
                              <td>
                                <Badge className={parseFloat(percentage) >= 40 ? "badge-modern badge-modern-success" : "badge-modern badge-modern-danger"}>
                                  {percentage}%
                                </Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            ))
        )}
      </Container>

      {/* COMPACT STYLING RUNTIME OVERRIDES */}
      <style>{`
        .dashboard-content-area { color: var(--text-dark); }
        .fs-7 { font-size: 0.875rem !important; }
        .fs-8 { font-size: 0.75rem !important; }
        .runtime-panel-card { border-radius: 12px; }

        /* METRIC CARDS */
        .metric-card { border-radius: 12px; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .metric-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important; }
        .metric-icon-wrapper { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .card-decoration-line { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }

        /* SUBJECT TAB PILLS */
        .custom-subject-tabs .nav-link { color: var(--text-dark); background: var(--card-bg); border: 1px solid var(--primary-border); transition: all 0.2s; }
        .custom-subject-tabs .nav-link.active { background-color: var(--primary-color) !important; color: #fff !important; border-color: var(--primary-color) !important; }

        /* DATAGRID TABLE */
        .custom-datagrid th { background-color: var(--primary-light); color: var(--text-dark); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 14px 16px; border-top: none; border-bottom: 2px solid var(--primary-border); }
        .custom-datagrid td { padding: 14px 16px; border-bottom: 1px solid var(--primary-border); }
        .datagrid-row-transition { transition: background-color 0.15s ease; }
        .datagrid-row-transition:hover { background-color: var(--primary-light) !important; }

        /* BADGES */
        .badge-modern { padding: 6px 10px; font-weight: 500; font-size: 0.75rem; border-radius: 6px; }
        .badge-modern-info { background-color: #e0f2fe !important; color: #0369a1 !important; }
        .badge-modern-dark { background-color: #f1f5f9 !important; color: #334155 !important; }
        .badge-modern-success { background-color: #dcfce7 !important; color: #15803d !important; }
        .badge-modern-danger { background-color: #fee2e2 !important; color: #991b1b !important; }
      `}</style>
    </div>
  );
};

export default ViewMarks;