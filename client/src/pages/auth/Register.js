import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { PersonFill, EnvelopeFill, LockFill, ShieldLockFill, FileBarGraphFill, ClipboardCheckFill, BarChartFill } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { register } from "./authApi";

const Register = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    adminPassword: "",
  });

  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");

    /* Validation */

    if (!formData.name.trim()) {
      setMessage("Please enter full name");
      return;
    }

    if (!formData.email.trim()) {
      setMessage("Please enter email address");
      return;
    }

    if (!formData.password.trim()) {
      setMessage("Please enter password");
      return;
    }

    if (!formData.role) {
      setMessage("Please select role");
      return;
    }

    /* Admin Validation */

    if (
      formData.role === "admin" &&
      !formData.adminPassword.trim()
    ) {

      setMessage(
        "Please enter admin secret password"
      );

      return;
    }

    try {

      setLoading(true);

      // USING AUTHAPI INSTEAD OF LOCALHOST URL
      const res = await register(formData);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      setMessage("Registration Successful");

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        adminPassword: "",
      });

    } catch (error) {

      console.log(error);

      setMessage(
        error.response?.data?.message ||
        "Registration Failed"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background:
          "linear-gradient(135deg,#4f46e5,#7c3aed,#9333ea)",
        padding: "40px 0",
      }}
    >

      <Container>

        <Row className="align-items-center justify-content-center">

          {/* LEFT SIDE */}
          <Col
            lg={6}
            className="text-white mb-5 mb-lg-0"
          >

            <div className="pe-lg-5">

              <h1
                className="fw-bold mb-4"
                style={{
                  fontSize: "clamp(2.5rem,5vw,4.5rem)",
                  lineHeight: "1.2",
                }}
              >
                Classroom Analytics Dashboard
              </h1>

              <p
                className="fs-5 text-light opacity-75"
                style={{
                  maxWidth: "520px",
                  lineHeight: "1.9",
                }}
              >
                Smart platform to manage students,
                attendance, marks, reports and
                classroom performance analytics
                with beautiful insights.
              </p>

              {/* FEATURES */}
              <div className="mt-5">

                <div className="d-flex align-items-center mb-4">
                  <div
                    className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "55px",
                      height: "55px",
                    }}
                  >
                    <BarChartFill size={24} />
                  </div>

                  <div>
                    <h5 className="mb-1 fw-bold">
                      Analytics Dashboard
                    </h5>

                    <small className="text-light opacity-75">
                      Visualize student performance
                    </small>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4">
                  <div
                    className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "55px",
                      height: "55px",
                    }}
                  >
                    <ClipboardCheckFill size={24} />
                  </div>

                  <div>
                    <h5 className="mb-1 fw-bold">
                      Attendance Management
                    </h5>

                    <small className="text-light opacity-75">
                      Track student attendance easily
                    </small>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div
                    className="bg-white text-dark rounded-circle d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: "55px",
                      height: "55px",
                    }}
                  >
                    <FileBarGraphFill size={24} />
                  </div>

                  <div>
                    <h5 className="mb-1 fw-bold">
                      Performance Reports
                    </h5>

                    <small className="text-light opacity-75">
                      Generate smart reports instantly
                    </small>
                  </div>
                </div>

              </div>

            </div>

          </Col>

          {/* RIGHT SIDE */}
          <Col lg={5} md={8} sm={11}>

            <Card
              className="border-0 shadow-lg overflow-hidden"
              style={{
                borderRadius: "28px",
                backdropFilter: "blur(10px)",
              }}
            >

              <Card.Body className="p-4 p-lg-5">

                <div className="text-center mb-4">

                  <h2 className="fw-bold mb-2">
                    Create Account
                  </h2>

                  <p className="text-muted">
                    Register to continue
                  </p>

                </div>

                {/* ALERT */}

                {message && (

                  <Alert
                    variant={
                      message.includes("Successful")
                        ? "success"
                        : "danger"
                    }
                    className="rounded-4"
                  >

                    {message}

                  </Alert>

                )}

                <Form onSubmit={handleSubmit}>

                  {/* NAME */}
                  <Form.Group className="mb-4">

                    <Form.Label className="fw-semibold">
                      Full Name
                    </Form.Label>

                    <InputGroup>

                      <InputGroup.Text>
                        <PersonFill />
                      </InputGroup.Text>

                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        size="lg"
                        style={{
                          borderRadius: "0 12px 12px 0",
                        }}
                      />

                    </InputGroup>

                  </Form.Group>

                  {/* EMAIL */}
                  <Form.Group className="mb-4">

                    <Form.Label className="fw-semibold">
                      Email Address
                    </Form.Label>

                    <InputGroup>

                      <InputGroup.Text>
                        <EnvelopeFill />
                      </InputGroup.Text>

                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        size="lg"
                      />

                    </InputGroup>

                  </Form.Group>

                  {/* PASSWORD */}
                  <Form.Group className="mb-4">

                    <Form.Label className="fw-semibold">
                      Password
                    </Form.Label>

                    <InputGroup>

                      <InputGroup.Text>
                        <LockFill />
                      </InputGroup.Text>

                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        size="lg"
                      />

                    </InputGroup>

                  </Form.Group>

                  {/* ROLE */}
                  <Form.Group className="mb-4">

                    <Form.Label className="fw-semibold">
                      Select Role
                    </Form.Label>

                    <Form.Select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      size="lg"
                    >

                      <option value="">
                        Choose Role
                      </option>

                      <option value="student">
                        Student
                      </option>

                      <option value="teacher">
                        Teacher
                      </option>

                      <option value="admin">
                        Admin
                      </option>

                    </Form.Select>

                  </Form.Group>

                  {/* ADMIN PASSWORD */}

                  {formData.role === "admin" && (

                    <Form.Group className="mb-4">

                      <Form.Label className="fw-semibold">
                        Admin Secret Password
                      </Form.Label>

                      <InputGroup>

                        <InputGroup.Text>
                          <ShieldLockFill />
                        </InputGroup.Text>

                        <Form.Control
                          type="password"
                          name="adminPassword"
                          placeholder="Enter admin secret password"
                          value={formData.adminPassword}
                          onChange={handleChange}
                          size="lg"
                        />

                      </InputGroup>

                    </Form.Group>

                  )}

                  {/* BUTTON */}

                  <Button
                    type="submit"
                    className="w-100 fw-bold py-3 border-0"
                    disabled={loading}
                    style={{
                      borderRadius: "14px",
                      background:
                        "linear-gradient(135deg,#4f46e5,#7c3aed)",
                      fontSize: "17px",
                    }}
                  >

                    {
                      loading
                        ? "Creating Account..."
                        : "Register"
                    }

                  </Button>

                </Form>

                {/* FOOTER */}

                <div className="text-center mt-4">

                  <span className="text-muted">
                    Already have an account?
                  </span>

                  <span
                    className="fw-bold ms-2"
                    style={{
                      color: "#4f46e5",
                      cursor: "pointer",

                    }}
                    onClick={()=>navigate("/login")}
                  >
                    Login
                  </span>

                </div>

              </Card.Body>

            </Card>

          </Col>

        </Row>

      </Container>

    </div>
  );
};

export default Register;