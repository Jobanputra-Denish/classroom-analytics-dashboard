import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Card, Form, Button, InputGroup, Table, Badge, ProgressBar } from "react-bootstrap";
import { BarChart3, User, CalendarCheck, Award, BookOpen, Search, Sparkles, RefreshCw } from "lucide-react";
import { getStudents, getStudentAnalytics } from "./analyticsApi"; // Import API functions
import "../Setings/SettingsTheme.css"; // Uses global theme CSS variables

const Analytics = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Load Students list on mount
  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await getStudents();
        setStudents(res.data);
      } catch (err) {
        console.error("Error loading students:", err);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  // Load Student Specific Analytics
  const fetchAnalytics = useCallback(async () => {
    if (!selectedStudent) {
      alert("Please select a student first");
      return;
    }

    setLoadingAnalytics(true);
    try {
      const res = await getStudentAnalytics(selectedStudent);
      setAnalytics(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      alert(err.response?.data?.message || "Failed to load student analytics");
    } finally {
      setLoadingAnalytics(false);
    }
  }, [selectedStudent]);

  return (
    <div className="dashboard-content-area theme-settings-container">
      <Container fluid className="px-4 py-4">
        {/* HEADER BRANDING BANNER */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
          <div>
            <h3 className="fw-bold tracking-tight mb-1" style={{ color: "var(--text-dark)" }}>
              Student Performance Analytics
            </h3>
            <p className="text-muted small mb-0">Evaluate student progress, examination metrics, and subject attendance logs.</p>
          </div>
        </div>

        {/* STUDENT SELECTOR CONTROL PANEL */}
        <Card className="theme-card shadow-sm runtime-panel-card mb-4">
          <Card.Body className="p-4">
            <Form onSubmit={(e) => { e.preventDefault(); fetchAnalytics(); }}>
              <Row className="g-3 align-items-end">
                <Col md={9}>
                  <Form.Label className="fs-7 fw-semibold text-secondary">Select Target Student</Form.Label>
                  <InputGroup className="input-group-custom">
                    <InputGroup.Text><User size={16} className="text-muted" /></InputGroup.Text>
                    <Form.Select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      disabled={loadingStudents}
                      className="fs-7"
                    >
                      <option value="">Choose Student Candidate...</option>
                      {students.map((student) => (
                        <option key={student._id} value={student._id}>
                          {student.StudentId} — {student.fullname}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Col>

                <Col md={3}>
                  <Button
                    type="submit"
                    disabled={loadingAnalytics || !selectedStudent}
                    className="theme-btn-primary w-100 fw-medium d-flex align-items-center justify-content-center gap-2 py-2"
                  >
                    {loadingAnalytics ? (
                      <>
                        <div className="spinner-border spinner-border-sm" role="status"></div> Loading...
                      </>
                    ) : (
                      <>
                        <BarChart3 size={18} /> View Analytics
                      </>
                    )}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* ANALYTICS DISPLAY SECTION */}
        {analytics ? (
          <>
            {/* OVERVIEW METRIC SUMMARY CARDS */}
            <Row className="mb-4 g-3">
              <Col xs={12} md={4}>
                <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
                  <Card.Body className="d-flex align-items-center justify-content-between p-4">
                    <div>
                      <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Student Name</span>
                      <h4 className="fw-bold mb-0" style={{ color: "var(--text-dark)" }}>{analytics.studentName}</h4>
                    </div>
                    <div className="metric-icon-wrapper" style={{ backgroundColor: "var(--primary-light)", color: "var(--primary-color)" }}>
                      <User size={22} />
                    </div>
                  </Card.Body>
                  <div className="card-decoration-line" style={{ backgroundColor: "var(--primary-color)" }}></div>
                </Card>
              </Col>

              <Col xs={12} md={4}>
                <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
                  <Card.Body className="d-flex align-items-center justify-content-between p-4">
                    <div>
                      <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Average Marks</span>
                      <h3 className="fw-bold mb-0 text-primary">{analytics.averageMarks}%</h3>
                    </div>
                    <div className="metric-icon-wrapper bg-primary-subtle text-primary">
                      <Award size={22} />
                    </div>
                  </Card.Body>
                  <div className="card-decoration-line bg-primary"></div>
                </Card>
              </Col>

              <Col xs={12} md={4}>
                <Card className="metric-card theme-card shadow-sm h-100 position-relative overflow-hidden">
                  <Card.Body className="d-flex align-items-center justify-content-between p-4">
                    <div>
                      <span className="text-muted fs-7 fw-medium text-uppercase tracking-wider d-block mb-1">Total Attendance</span>
                      <h3 className="fw-bold mb-0 text-success">{analytics.attendancePercentage}%</h3>
                    </div>
                    <div className="metric-icon-wrapper bg-success-subtle text-success">
                      <CalendarCheck size={22} />
                    </div>
                  </Card.Body>
                  <div className="card-decoration-line bg-success"></div>
                </Card>
              </Col>
            </Row>

            {/* SUBJECT BREAKDOWN TABLE */}
            <Card className="theme-card shadow-sm runtime-panel-card overflow-hidden">
              <Card.Header className="theme-header py-3 d-flex align-items-center justify-content-between">
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 text-white">
                  <BookOpen size={18} /> Subject-Wise Breakdown
                </h5>
                <Badge bg="light" className="text-primary fs-8 fw-semibold">
                  {analytics.subjectAnalytics?.length || 0} Subject(s) Evaluated
                </Badge>
              </Card.Header>

              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0 custom-datagrid">
                    <thead>
                      <tr>
                        <th style={{ width: "60px" }}>Idx</th>
                        <th>Subject Title</th>
                        <th>Obtained Marks</th>
                        <th>Max Total</th>
                        <th>Score Percentage</th>
                        <th style={{ minWidth: "160px" }}>Subject Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.subjectAnalytics && analytics.subjectAnalytics.length > 0 ? (
                        analytics.subjectAnalytics.map((item, index) => {
                          const pct = parseFloat(item.percentage);
                          const attPct = parseFloat(item.attendance);
                          return (
                            <tr key={index} className="datagrid-row-transition">
                              <td className="text-muted fs-7 ps-3">{index + 1}</td>
                              <td className="fw-semibold fs-7" style={{ color: "var(--text-dark)" }}>
                                {item.subject}
                              </td>
                              <td className="fw-bold fs-7" style={{ color: "var(--text-dark)" }}>
                                {item.marks}
                              </td>
                              <td className="text-secondary fs-7">{item.totalMarks}</td>
                              <td>
                                <Badge className={pct >= 40 ? "badge-modern badge-modern-success" : "badge-modern badge-modern-danger"}>
                                  {item.percentage}%
                                </Badge>
                              </td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <div className="flex-grow-1">
                                    <ProgressBar
                                      now={attPct}
                                      variant={attPct >= 75 ? "success" : attPct >= 50 ? "warning" : "danger"}
                                      style={{ height: "6px", borderRadius: "3px" }}
                                    />
                                  </div>
                                  <span className="fs-8 fw-semibold text-secondary" style={{ width: "40px" }}>
                                    {item.attendance}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center text-muted py-5 fs-7">
                            No subject analytics records found for this student.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </>
        ) : (
          <Card className="theme-card shadow-sm text-center py-5">
            <Card.Body>
              <Sparkles size={48} className="text-muted mb-3" />
              <h5 className="fw-bold mb-1" style={{ color: "var(--text-dark)" }}>No Analytics Loaded</h5>
              <p className="text-muted fs-7 mb-0">Select a student from the dropdown above and click "View Analytics" to generate report.</p>
            </Card.Body>
          </Card>
        )}
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
        .form-control:focus, .form-select:focus { border-color: var(--primary-color) !important; box-shadow: 0 0 0 2px rgba(109, 40, 217, 0.15) !important; }

        /* METRIC CARDS */
        .metric-card { border-radius: 12px; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .metric-card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important; }
        .metric-icon-wrapper { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .card-decoration-line { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }

        /* DATAGRID TABLE */
        .custom-datagrid th { background-color: var(--primary-light); color: var(--text-dark); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; padding: 14px 16px; border-top: none; border-bottom: 2px solid var(--primary-border); }
        .custom-datagrid td { padding: 14px 16px; border-bottom: 1px solid var(--primary-border); }
        .datagrid-row-transition { transition: background-color 0.15s ease; }
        .datagrid-row-transition:hover { background-color: var(--primary-light) !important; }

        /* BADGES */
        .badge-modern { padding: 6px 10px; font-weight: 500; font-size: 0.75rem; border-radius: 6px; }
        .badge-modern-success { background-color: #dcfce7 !important; color: #15803d !important; }
        .badge-modern-danger { background-color: #fee2e2 !important; color: #991b1b !important; }
      `}</style>
    </div>
  );
};

export default Analytics;