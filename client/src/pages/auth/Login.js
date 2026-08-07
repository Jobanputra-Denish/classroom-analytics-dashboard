import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  InputGroup,
} from "react-bootstrap";
import {
  EnvelopeFill,
  LockFill,
  BarChartFill,
  CalendarCheckFill,
  FileEarmarkBarGraphFill,
} from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.email.trim()) {
      setMessage("Please enter email address");
      return;
    }

    if (!formData.password.trim()) {
      setMessage("Please enter password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // REDIRECT DIRECTLY TO DASHBOARD
      navigate("/");

    } catch (error) {
      console.log(error);
      setMessage(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        background: "linear-gradient(135deg,#4f46e5,#7c3aed,#9333ea)",
        padding: "40px 0",
      }}
    >
      <Container>
        <Row className="align-items-center justify-content-center">
          {/* LEFT SIDE */}
          <Col lg={6} className="text-white mb-5 mb-lg-0">
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
                Manage student records, attendance, marks, reports and classroom
                analytics with one powerful smart dashboard.
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
                    <h5 className="mb-1 fw-bold">Smart Analytics</h5>
                    <small className="text-light opacity-75">
                      Track performance with charts
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
                    <CalendarCheckFill size={24} />
                  </div>

                  <div>
                    <h5 className="mb-1 fw-bold">Attendance Tracking</h5>
                    <small className="text-light opacity-75">
                      Manage daily attendance easily
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
                    <FileEarmarkBarGraphFill size={24} />
                  </div>

                  <div>
                    <h5 className="mb-1 fw-bold">Reports & Insights</h5>
                    <small className="text-light opacity-75">
                      Generate reports instantly
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
              }}
            >
              <Card.Body className="p-4 p-lg-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2">Welcome Back</h2>
                  <p className="text-muted">
                    Login to continue to your dashboard
                  </p>
                </div>

                {/* ALERT */}
                {message && (
                  <Alert variant="danger" className="rounded-4">
                    {message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
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
                    <div className="d-flex justify-content-between mb-2">
                      <Form.Label className="fw-semibold mb-0">
                        Password
                      </Form.Label>
                    </div>

                    <InputGroup>
                      <InputGroup.Text>
                        <LockFill />
                      </InputGroup.Text>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        size="lg"
                      />
                    </InputGroup>
                    <small
                      style={{
                        color: "#4f46e5",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      Forgot Password?
                    </small>
                  </Form.Group>

                  {/* BUTTON */}
                  <Button
                    type="submit"
                    className="w-100 fw-bold py-3 border-0"
                    disabled={loading}
                    style={{
                      borderRadius: "14px",
                      background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
                      fontSize: "17px",
                    }}
                  >
                    {loading ? "Logging In..." : "Login"}
                  </Button>
                </Form>

                {/* FOOTER */}
                <div className="text-center mt-4">
                  <span className="text-muted">Don't have an account?</span>
                  <span
                    className="fw-bold ms-2"
                    style={{
                      color: "#4f46e5",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate("/register")}
                  >
                    Register
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

export default Login;