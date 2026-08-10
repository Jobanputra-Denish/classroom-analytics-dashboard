import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Alert,
  Spinner,
  Form,
  InputGroup,
  Badge,
} from "react-bootstrap";

import {
  Search,
  Pencil,
  Trash,
  Eye,
  People,
  ArrowClockwise,
} from "react-bootstrap-icons";

import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const ViewStudents = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // GET STUDENTS
  // ==============================
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/students");

      console.log("Students API Response:", response.data);

      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load students. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD STUDENTS
  // ==============================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchStudents();
  }, [navigate]);

  // ==============================
  // SEARCH STUDENTS
  // ==============================
  useEffect(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter((student) => {
      return (
        student.fullname?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.StudentId?.toLowerCase().includes(query) ||
        student.className?.toLowerCase().includes(query) ||
        student.section?.toLowerCase().includes(query)
      );
    });

    setFilteredStudents(filtered);
  }, [search, students]);

  // ==============================
  // DELETE STUDENT
  // ==============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/students/${id}`);

      // Remove deleted student from UI
      setStudents((prev) =>
        prev.filter((student) => student._id !== id)
      );

      alert("Student deleted successfully.");
    } catch (error) {
      console.error("Delete student error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Failed to delete student."
      );
    }
  };

  // ==============================
  // VIEW STUDENT
  // ==============================
  const handleView = (id) => {
    navigate(`/students/${id}`);
  };

  // ==============================
  // EDIT STUDENT
  // ==============================
  const handleEdit = (id) => {
    navigate(`/students/edit/${id}`);
  };

  return (
    <Container fluid className="py-4">

      {/* ==============================
          HEADER
      ============================== */}
      <Row className="mb-4 align-items-center">

        <Col md={6}>
          <div className="d-flex align-items-center gap-3">

            <div
              className="d-flex align-items-center justify-content-center rounded-4"
              style={{
                width: "55px",
                height: "55px",
                background: "#ede9fe",
                color: "#6d28d9",
              }}
            >
              <People size={28} />
            </div>

            <div>
              <h2 className="fw-bold mb-1">
                Students
              </h2>

              <p className="text-muted mb-0">
                Manage and view all student records
              </p>
            </div>

          </div>
        </Col>

        <Col
          md={6}
          className="text-md-end mt-3 mt-md-0"
        >
          <Button
            variant="primary"
            className="fw-semibold px-4"
            onClick={() => navigate("/students/add")}
          >
            + Add Student
          </Button>
        </Col>

      </Row>


      {/* ==============================
          ERROR
      ============================== */}
      {error && (
        <Alert
          variant="danger"
          className="rounded-4"
        >
          <div className="d-flex justify-content-between align-items-center">

            <span>{error}</span>

            <Button
              variant="outline-danger"
              size="sm"
              onClick={fetchStudents}
            >
              <ArrowClockwise className="me-1" />
              Retry
            </Button>

          </div>
        </Alert>
      )}


      {/* ==============================
          MAIN CARD
      ============================== */}
      <Card
        className="border-0 shadow-sm"
        style={{
          borderRadius: "20px",
        }}
      >

        <Card.Body className="p-4">

          {/* ==============================
              TOP BAR
          ============================== */}
          <Row className="align-items-center mb-4">

            <Col md={6}>

              <h5 className="fw-bold mb-1">
                Student List
              </h5>

              <p className="text-muted mb-0">
                Total Students:{" "}
                <strong>
                  {students.length}
                </strong>
              </p>

            </Col>

            <Col
              md={6}
              className="mt-3 mt-md-0"
            >

              <InputGroup>

                <InputGroup.Text>
                  <Search />
                </InputGroup.Text>

                <Form.Control
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </InputGroup>

            </Col>

          </Row>


          {/* ==============================
              LOADING
          ============================== */}
          {loading ? (

            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                minHeight: "300px",
              }}
            >
              <div className="text-center">

                <Spinner
                  animation="border"
                  variant="primary"
                />

                <p className="text-muted mt-3 mb-0">
                  Loading students...
                </p>

              </div>
            </div>

          ) : (

            /* ==============================
               TABLE
            ============================== */

            <div className="table-responsive">

              <Table
                hover
                responsive
                className="align-middle mb-0"
              >

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {filteredStudents.length > 0 ? (

                    filteredStudents.map(
                      (student, index) => (

                        <tr key={student._id}>

                          <td>
                            {index + 1}
                          </td>

                          <td>
                            <Badge
                              bg="light"
                              text="dark"
                              className="px-3 py-2"
                            >
                              {student.StudentId}
                            </Badge>
                          </td>

                          <td>
                            <div className="fw-semibold">
                              {student.fullname}
                            </div>
                          </td>

                          <td>
                            {student.email}
                          </td>

                          <td>
                            {student.className}
                          </td>

                          <td>
                            {student.section}
                          </td>

                          <td>
                            {student.age}
                          </td>

                          <td>
                            {student.gender}
                          </td>

                          <td>
                            {student.phoneNumber}
                          </td>

                          <td>

                            <div className="d-flex justify-content-center gap-2">

                              {/* VIEW */}
                              <Button
                                variant="outline-primary"
                                size="sm"
                                title="View Student"
                                onClick={() =>
                                  handleView(
                                    student._id
                                  )
                                }
                              >
                                <Eye size={16} />
                              </Button>

                              {/* EDIT */}
                              <Button
                                variant="outline-warning"
                                size="sm"
                                title="Edit Student"
                                onClick={() =>
                                  handleEdit(
                                    student._id
                                  )
                                }
                              >
                                <Pencil size={16} />
                              </Button>

                              {/* DELETE */}
                              <Button
                                variant="outline-danger"
                                size="sm"
                                title="Delete Student"
                                onClick={() =>
                                  handleDelete(
                                    student._id
                                  )
                                }
                              >
                                <Trash size={16} />
                              </Button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="10"
                        className="text-center py-5"
                      >

                        <People
                          size={45}
                          className="text-muted mb-3"
                        />

                        <h5 className="fw-semibold">
                          No Students Found
                        </h5>

                        <p className="text-muted mb-0">
                          {search
                            ? "No students match your search."
                            : "There are no students available."}
                        </p>

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
  );
};

export default ViewStudents;