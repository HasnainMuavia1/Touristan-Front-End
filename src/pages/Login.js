import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { connect } from "react-redux";
import { login, loginAsAdmin } from "../redux/actions/authActions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Alert, InputGroup, Nav, Tab } from "react-bootstrap";
import "../styles/password-toggle.css";

const Login = ({
  login,
  loginAsAdmin,
  isAuthenticated,
  error,
  loading,
  user,
}) => {
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If already authenticated, redirect based on role
    if (isAuthenticated) {
      // Check if user is admin and redirect accordingly
      if (user && user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        // Redirect to the page they were trying to access, or to home
        const from = location.state?.from?.pathname || "/";
        navigate(from);
      }
    }

    // Set error message if login fails
    if (error) {
      setLoginError(error);
    }
  }, [isAuthenticated, error, navigate, location, user]);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    setLoginError(""); // Clear any previous errors

    // Call the appropriate login action based on active tab
    if (activeTab === "admin") {
      loginAsAdmin(values.email, values.password);
    } else {
      login(values.email, values.password);
    }

    // Set submitting to false after a delay to show loading state
    setTimeout(() => {
      setSubmitting(false);
    }, 1000);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="auth-page"
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1530789253388-582c481c54b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        overflow: "auto",
        padding: "20px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          height: "550px",
          display: "flex",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
          margin: "auto"
        }}
      >
        {/* Left side - Form */}
        <div
          style={{
            flex: "1",
            background: "#ffffff",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 1
          }}
        >
        <div className="mb-4">
          <div 
            className="d-flex align-items-center mb-3"
            style={{
              marginBottom: "1.5rem"
            }}
          >
            <div 
              className="position-relative me-3"
              style={{
                width: 50,
                height: 50,
              }}
            >
              {/* Main logo shape */}
              <div
                className="position-absolute"
                style={{
                  background: "linear-gradient(135deg, #2c5282 0%, #4299e1 100%)",
                  width: 45,
                  height: 45,
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(44, 82, 130, 0.2)",
                  zIndex: 2,
                  border: "1px solid rgba(255,255,255,0.5)",
                  top: 0,
                  left: 0
                }}
              >
                <i className="fas fa-mountain text-white"></i>
              </div>
              
              {/* Background accent shape */}
              <div
                className="position-absolute"
                style={{
                  background: "linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)",
                  width: 45,
                  height: 45,
                  clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                  zIndex: 1,
                  top: 5,
                  left: 5,
                  opacity: 0.9
                }}
              ></div>
            </div>
            <div>
              <h2 className="auth-title fw-bold mb-0" style={{ color: "#2c5282" }}>
                Welcome Back
              </h2>
              <p className="text-muted mb-0">Sign in to continue your journey</p>
            </div>
          </div>
        </div>

        {loginError && (
          <Alert variant="danger" onClose={() => setLoginError("")} dismissible>
            {loginError}
          </Alert>
        )}

        <Tab.Container defaultActiveKey="user">
          <Nav className="mb-4 d-flex" style={{ gap: "10px" }}>
            <Nav.Item style={{ flex: 1 }}>
              <Nav.Link
                eventKey="user"
                onClick={() => setActiveTab("user")}
                className="text-center py-2"
                style={{
                  borderRadius: "8px",
                  backgroundColor: activeTab === "user" ? "#4299e1" : "transparent",
                  color: activeTab === "user" ? "white" : "#4a5568",
                  border: activeTab === "user" ? "none" : "1px solid #e2e8f0",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  boxShadow: activeTab === "user" ? "0 4px 6px rgba(66, 153, 225, 0.2)" : "none"
                }}
              >
                <i className="fas fa-user me-2"></i>Traveler
              </Nav.Link>
            </Nav.Item>
            <Nav.Item style={{ flex: 1 }}>
              <Nav.Link
                eventKey="admin"
                onClick={() => setActiveTab("admin")}
                className="text-center py-2"
                style={{
                  borderRadius: "8px",
                  backgroundColor: activeTab === "admin" ? "#4299e1" : "transparent",
                  color: activeTab === "admin" ? "white" : "#4a5568",
                  border: activeTab === "admin" ? "none" : "1px solid #e2e8f0",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  boxShadow: activeTab === "admin" ? "0 4px 6px rgba(66, 153, 225, 0.2)" : "none"
                }}
              >
                <i className="fas fa-user-shield me-2"></i>Admin
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            <Tab.Pane eventKey="user">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4" controlId="formEmail">
                      <Form.Label>Email address</Form.Label>
                      <InputGroup className="input-group-seamless shadow-none">
                        <InputGroup.Text className="bg-white border-end-0 rounded-start rounded-0">
                          <i className="fas fa-envelope text-primary"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.email && errors.email}
                          className="py-2 border-start-0 rounded-0 shadow-none"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formPassword">
                      <Form.Label>Password</Form.Label>
                      <InputGroup className="position-relative">
                        <InputGroup.Text className="bg-white border-end-0 rounded-start">
                          <i className="fas fa-lock text-primary"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.password && !!errors.password}
                          autoComplete="current-password"
                          className="py-2 border-start-0 pe-5"
                        />
                        <div 
                          onClick={togglePasswordVisibility}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 10,
                            cursor: "pointer",
                            color: "#6c757d"
                          }}
                        >
                          <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                        </div>
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        id="rememberMe"
                      />
                      <Link
                        to="/forgot-password"
                        className="text-primary small"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-100 py-2 mb-3 rounded-pill shadow-none"
                      disabled={isSubmitting || loading}
                      style={{
                        background:
                          "linear-gradient(to right, #2c5282, #4299e1)",
                        border: "none",
                      }}
                    >
                      {isSubmitting || loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Login
                        </>
                      )}
                    </Button>

                    <div className="text-center mt-4">
                      <p className="mb-0">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary fw-bold">
                          Sign up
                        </Link>
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </Tab.Pane>
            <Tab.Pane eventKey="admin">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4" controlId="formAdminEmail">
                      <Form.Label>Admin Email</Form.Label>
                      <InputGroup className="input-group-seamless shadow-none">
                        <InputGroup.Text className="bg-white border-end-0 rounded-start rounded-0">
                          <i className="fas fa-envelope text-primary"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter admin email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.email && errors.email}
                          className="py-2 border-start-0 rounded-0 shadow-none"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formAdminPassword">
                      <Form.Label>Password</Form.Label>
                      <InputGroup className="position-relative">
                        <InputGroup.Text className="bg-white border-end-0 rounded-start">
                          <i className="fas fa-lock text-primary"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.password && !!errors.password}
                          autoComplete="current-password"
                          className="py-2 border-start-0 pe-5"
                        />
                        <div 
                          onClick={togglePasswordVisibility}
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 10,
                            cursor: "pointer",
                            color: "#6c757d"
                          }}
                        >
                          <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                        </div>
                      </InputGroup>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check
                        type="checkbox"
                        label="Remember me"
                        id="adminRememberMe"
                      />
                      <Link
                        to="/forgot-password"
                        className="text-primary small"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-100 py-2 mb-3 rounded-pill shadow-none"
                      disabled={isSubmitting || loading}
                      style={{
                        background:
                          "linear-gradient(to right, #2c5282, #4299e1)",
                        border: "none",
                      }}
                    >
                      {isSubmitting || loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Logging in...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-in-alt me-2"></i>
                          Admin Login
                        </>
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        </div>
        
        {/* Right side - Image and animation */}
        <div
          style={{
            flex: "1",
            background: "linear-gradient(135deg, #2c5282 0%, #4299e1 100%)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            textAlign: "center",
            padding: "2rem"
          }}
        >
          {/* Background pattern */}
          <div 
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
              opacity: 0.1,
              zIndex: 1
            }}
          />
          
          {/* Content */}
          <div style={{ position: "relative", zIndex: 2, maxWidth: "80%" }}>
            <div className="mb-4">
              <i className="fas fa-globe-asia fa-4x mb-4"></i>
              <h2 className="display-6 fw-bold mb-3">Discover Pakistan</h2>
              <p className="lead mb-4">Explore breathtaking landscapes and rich cultural heritage with Touristaan</p>
            </div>
            
            {/* Animated elements */}
            <div className="d-flex justify-content-center mb-4">
              <div className="mx-2 d-flex flex-column align-items-center">
                <div 
                  className="rounded-circle mb-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(255,255,255,0.2)",
                    animation: "float 3s ease-in-out infinite"
                  }}
                >
                  <i className="fas fa-mountain fa-lg"></i>
                </div>
                <span>Mountains</span>
              </div>
              <div className="mx-2 d-flex flex-column align-items-center">
                <div 
                  className="rounded-circle mb-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(255,255,255,0.2)",
                    animation: "float 3s ease-in-out infinite 0.5s"
                  }}
                >
                  <i className="fas fa-water fa-lg"></i>
                </div>
                <span>Lakes</span>
              </div>
              <div className="mx-2 d-flex flex-column align-items-center">
                <div 
                  className="rounded-circle mb-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    background: "rgba(255,255,255,0.2)",
                    animation: "float 3s ease-in-out infinite 1s"
                  }}
                >
                  <i className="fas fa-mosque fa-lg"></i>
                </div>
                <span>Culture</span>
              </div>
            </div>
            
            <p>New to Touristaan? <Link to="/signup" className="text-white fw-bold">Create an account</Link></p>
          </div>
          
          {/* Animation keyframes */}
          <style>
            {`
              @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
                100% { transform: translateY(0px); }
              }
            `}
          </style>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.auth.error,
  loading: state.auth.loading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { login, loginAsAdmin })(Login);
