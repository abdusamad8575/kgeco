import React, { useState } from "react";
import axiosInstance from "../../axios";
import { useNavigate } from "react-router-dom";
import {
  Col,
  Row,
  Container,
  Form,
  Button,
  Image,
  Alert,
  Spinner,
  Tab,
  Nav,
} from "react-bootstrap";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaMobileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [userDetails, setUserDetails] = useState({
  //   email: "",
  //   password: "",
  // });

  const [activeTab, setActiveTab] = useState("otp");
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     const response = await axiosInstance.post("/auth/login", userDetails);
  //     localStorage.setItem(
  //       "Tokens",
  //       JSON.stringify({
  //         access: response?.data?.data?.token?.accessToken,
  //         refresh: response?.data?.data?.token?.refreshToken,
  //       })
  //     );

  //     if (response.data.proceed) {
  //       navigate("/");
  //     }
  //   } catch (error) {
  //     setErrorMessage(error.response.data.message);
  //     console.error("Error during login: ", error.response.data.message);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: userDetails.email,
        password: userDetails.password,
      });

      localStorage.setItem(
        "Tokens",
        JSON.stringify({
          access: response?.data?.data?.token?.accessToken,
          refresh: response?.data?.data?.token?.refreshToken,
        })
      );

      if (response.data.proceed) {
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
      console.error("Error during email login: ", error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/send-otp", { number: userDetails.phone });
      setOtpSent(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        number: userDetails.phone,
        otp: userDetails.otp,
      });

      localStorage.setItem(
        "Tokens",
        JSON.stringify({
          access: response?.data?.data?.token?.accessToken,
          refresh: response?.data?.data?.token?.refreshToken,
        })
      );

      navigate("/");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <header style={{ backgroundColor: "#ffffff", boxShadow: "0 2px 4px rgba(0,0,0,.1)" }}>
        <Container className="py-3">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Image
                src="logo.png"
                fluid
                alt="Logo"
                style={{ maxWidth: "120px" }}
              />
            </Link>
            <div style={{ color: "#28a745" }}>
              <FaLock style={{ marginRight: "0.5rem" }} />
              <span style={{ fontWeight: "bold" }}>Secure Login</span>
            </div>
          </div>
        </Container>
      </header>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6} xl={5}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,.1)", padding: "2rem" }}>
              <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#333" }}>Welcome Back</h2>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}


              <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
                <Nav variant="pills" className="justify-content-center mb-4">

                  <Nav.Item>
                    <Nav.Link eventKey="otp">OTP Login</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="email">Email Login</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="email">
                    <Form onSubmit={handleEmailLogin}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            type="email"
                            name="email"
                            required
                            value={userDetails.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            style={{ paddingLeft: "2.5rem" }}
                          />
                          <FaEnvelope
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "0.75rem",
                              transform: "translateY(-50%)",
                              color: "#6c757d",
                            }}
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formBasicPassword">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Form.Label>Password</Form.Label>
                          <Link
                            to="/email"
                            style={{
                              fontSize: "0.875rem",
                              color: "#007bff",
                              textDecoration: "none",
                            }}
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            name="password"
                            value={userDetails.password}
                            required
                            onChange={handleChange}
                            style={{
                              paddingLeft: "2.5rem",
                              paddingRight: "2.5rem",
                            }}
                          />
                          <FaLock
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "0.75rem",
                              transform: "translateY(-50%)",
                              color: "#6c757d",
                            }}
                          />
                          <div
                            onClick={handlePasswordVisibility}
                            style={{
                              position: "absolute",
                              top: "50%",
                              right: "0.75rem",
                              transform: "translateY(-50%)",
                              cursor: "pointer",
                              color: "#6c757d",
                            }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </div>
                        </div>
                      </Form.Group>

                      <Button
                        variant="danger"
                        type="submit"
                        disabled={isLoading}
                        style={{
                          width: "100%",
                          marginTop: "1rem",
                          backgroundColor: "#4CAF50",
                          borderColor: "#4CAF50",
                        }}
                      >
                        {isLoading ? <Spinner animation="border" size="sm" /> : "Sign In"}
                      </Button>
                    </Form>
                    <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
                      Don't have an account?{" "}
                      <Link to="/register" style={{ color: "#4CAF50", textDecoration: "none", fontWeight: "bold" }}>
                        Sign up
                      </Link>
                    </div>
                  </Tab.Pane>

                  <Tab.Pane eventKey="otp">
                    <Form onSubmit={otpSent ? handleOtpLogin : handleSendOtp}>
                      <Form.Group className="mb-3" controlId="formBasicPhone">
                        <Form.Label>Phone Number</Form.Label>
                        <div style={{ position: "relative" }}>
                          <Form.Control
                            type="text"
                            name="phone"
                            required
                            value={userDetails.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            style={{ paddingLeft: "2.5rem" }}
                            disabled={otpSent}
                          />
                          <FaMobileAlt
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "0.75rem",
                              transform: "translateY(-50%)",
                              color: "#6c757d",
                            }}
                          />
                        </div>
                      </Form.Group>

                      {otpSent && (
                        <Form.Group className="mb-3" controlId="formBasicOtp">
                          <Form.Label>OTP</Form.Label>
                          <Form.Control
                            type="text"
                            name="otp"
                            required
                            value={userDetails.otp}
                            onChange={handleChange}
                            placeholder="Enter the OTP"
                          />
                        </Form.Group>
                      )}

                      <Button
                        variant="danger"
                        type="submit"
                        disabled={isLoading}
                        style={{
                          width: "100%",
                          marginTop: "1rem",
                          backgroundColor: "#4CAF50",
                          borderColor: "#4CAF50",
                        }}
                      >
                        {isLoading ? (
                          <Spinner animation="border" size="sm" />
                        ) : otpSent ? (
                          "Verify OTP"
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </Form>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;