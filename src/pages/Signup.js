import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { register } from '../redux/actions/authActions';
import '../styles/password-toggle.css';

const Signup = ({ register, isAuthenticated, error }) => {
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Track the current step (1 or 2)

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuthenticated) {
      navigate('/');
    }
    
    // Set error message if signup fails
    if (error) {
      setSignupError(error);
      setSignupSuccess(false);
    }
  }, [isAuthenticated, error, navigate]);

  // Validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required')
  });

  // Initial form values
  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    // If we're on step 1, just move to step 2
    if (currentStep === 1) {
      setCurrentStep(2);
      setSubmitting(false);
      return;
    }
    
    // On step 2, complete the registration
    // Make sure passwords match
    if (values.password !== values.confirmPassword) {
      setSignupError('Passwords do not match');
      setSubmitting(false);
      return;
    }

    // Call the register action from Redux
    const { name, email, password } = values;
    register({ name, email, password });
    setSubmitting(false);
  };
  
  // Go back to step 1
  const handleBack = () => {
    setCurrentStep(1);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div
      className="auth-page"
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px 20px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          flexDirection: "row",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 15px 30px rgba(0, 0, 0, 0.3)",
          margin: "auto",
          height: "auto"
        }}
      >
        {/* Left side - Image and animation */}
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
            padding: "3rem 2rem"
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
              <h2 className="display-6 fw-bold mb-3">Join Touristaan</h2>
              <p className="lead mb-4">Create your account and start exploring the beauty of Pakistan</p>
            </div>
            
            {/* Animated illustration */}
            <div className="position-relative my-4" style={{ height: "180px" }}>
              <div 
                className="position-absolute"
                style={{
                  width: "100px",
                  height: "100px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "15px",
                  top: "20px",
                  left: "50%",
                  transform: "translateX(-50%) rotate(10deg)",
                  animation: "float 4s ease-in-out infinite",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <i className="fas fa-passport fa-3x"></i>
              </div>
              
              <div 
                className="position-absolute"
                style={{
                  width: "70px",
                  height: "70px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "50%",
                  bottom: "30px",
                  left: "30px",
                  animation: "float 3s ease-in-out infinite 0.5s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <i className="fas fa-camera fa-2x"></i>
              </div>
              
              <div 
                className="position-absolute"
                style={{
                  width: "60px",
                  height: "60px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "12px",
                  bottom: "10px",
                  right: "40px",
                  transform: "rotate(-10deg)",
                  animation: "float 3.5s ease-in-out infinite 1s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <i className="fas fa-map-marked-alt fa-2x"></i>
              </div>
            </div>
            
            <p>Already have an account? <Link to="/login" className="text-white fw-bold">Sign in</Link></p>
          </div>
          
          {/* Animation keyframes */}
          <style>
            {`
              @keyframes float {
                0% { transform: translateY(0px) rotate(10deg); }
                50% { transform: translateY(-15px) rotate(5deg); }
                100% { transform: translateY(0px) rotate(10deg); }
              }
            `}
          </style>
        </div>
        
        {/* Right side - Form */}
        <div
          style={{
            flex: "1",
            background: "#ffffff",
            padding: "3rem 2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 1
          }}
        >
        <div className="mb-4">
          <div 
            className="d-flex align-items-center"
            style={{
              marginBottom: "1rem"
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
                <i className="fas fa-user-plus text-white"></i>
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
                Create Account
              </h2>
              <p className="text-muted mb-0">Fill in your details to get started</p>
            </div>
          </div>
        </div>

        {signupError && (
          <Alert variant="danger" onClose={() => setSignupError('')} dismissible>
            {signupError}
          </Alert>
        )}
        {signupSuccess && (
          <Alert variant="success">Signup successful! Redirecting to login...</Alert>
        )}

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
            isSubmitting
          }) => (
            <Form onSubmit={handleSubmit}>
              {currentStep === 1 ? (
                // Step 1: Personal Information
                <>
                  <div className="text-center mb-4">
                    <div className="step-indicator d-flex justify-content-center mb-4">
                      <div className="d-flex align-items-center">
                        <div className="step active d-flex align-items-center justify-content-center" 
                          style={{ 
                            width: "36px", 
                            height: "36px", 
                            borderRadius: "50%", 
                            background: "#4299e1", 
                            color: "white",
                            fontWeight: "bold"
                          }}>
                          1
                        </div>
                        <div className="ms-2 me-2 fw-bold" style={{ color: "#4299e1" }}>Personal Info</div>
                      </div>
                      <div style={{ width: "60px", height: "2px", background: "#e2e8f0", margin: "0 10px", alignSelf: "center" }}></div>
                      <div className="d-flex align-items-center">
                        <div className="step d-flex align-items-center justify-content-center" 
                          style={{ 
                            width: "36px", 
                            height: "36px", 
                            borderRadius: "50%", 
                            background: "#e2e8f0", 
                            color: "#718096",
                            fontWeight: "bold"
                          }}>
                          2
                        </div>
                        <div className="ms-2 fw-bold text-muted">Security</div>
                      </div>
                    </div>
                    <h5 className="mb-1">Personal Information</h5>
                    <p className="text-muted small mb-2">Let's get to know you better</p>
                  </div>
                  
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <InputGroup className="input-group-seamless shadow-none">
                      <InputGroup.Text className="bg-white border-end-0 rounded-start rounded-0">
                        <i className="fas fa-user text-primary"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.name && errors.name}
                        className="py-2 border-start-0 rounded-0 rounded-end shadow-none"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
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
                        className="py-2 border-start-0 rounded-0 rounded-end shadow-none"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  
                  <Button 
                    type="button" 
                    className="w-100 py-2 mb-3 rounded-pill shadow-none" 
                    onClick={() => {
                      if (values.name && values.email && !(touched.name && !!errors.name) && !(touched.email && !!errors.email)) {
                        setCurrentStep(2);
                      }
                    }}
                    disabled={!values.name || !values.email || (touched.name && !!errors.name) || (touched.email && !!errors.email)}
                    style={{ 
                      background: 'linear-gradient(to right, #2c5282, #4299e1)',
                      border: 'none'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        Continue <i className="fas fa-arrow-right ms-2"></i>
                      </>
                    )}
                  </Button>
                </>
              ) : (
                // Step 2: Security Information
                <>
                  <div className="text-center mb-4">
                    <div className="step-indicator d-flex justify-content-center mb-4">
                      <div className="d-flex align-items-center">
                        <div className="step completed d-flex align-items-center justify-content-center" 
                          style={{ 
                            width: "36px", 
                            height: "36px", 
                            borderRadius: "50%", 
                            background: "#48bb78", 
                            color: "white",
                            fontWeight: "bold"
                          }}>
                          <i className="fas fa-check"></i>
                        </div>
                        <div className="ms-2 me-2 fw-bold" style={{ color: "#48bb78" }}>Personal Info</div>
                      </div>
                      <div style={{ width: "60px", height: "2px", background: "#48bb78", margin: "0 10px", alignSelf: "center" }}></div>
                      <div className="d-flex align-items-center">
                        <div className="step active d-flex align-items-center justify-content-center" 
                          style={{ 
                            width: "36px", 
                            height: "36px", 
                            borderRadius: "50%", 
                            background: "#4299e1", 
                            color: "white",
                            fontWeight: "bold"
                          }}>
                          2
                        </div>
                        <div className="ms-2 fw-bold" style={{ color: "#4299e1" }}>Security</div>
                      </div>
                    </div>
                    <h5 className="mb-1">Create Your Password</h5>
                    <p className="text-muted small mb-2">Secure your account with a strong password</p>
                  </div>
                  
                  <Form.Group className="mb-3" controlId="formPassword">
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
                        autoComplete="new-password"
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
                    <small className="text-muted">Password must be at least 6 characters</small>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <InputGroup className="position-relative">
                      <InputGroup.Text className="bg-white border-end-0 rounded-start">
                        <i className="fas fa-lock text-primary"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                        autoComplete="new-password"
                        className="py-2 border-start-0 pe-5"
                      />
                      <div 
                        onClick={toggleConfirmPasswordVisibility}
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
                        <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                      </div>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <div className="d-flex gap-2 mb-3">
                    <Button 
                      type="button" 
                      className="py-2 rounded-pill shadow-none flex-grow-1" 
                      onClick={handleBack}
                      variant="light"
                      style={{ border: '1px solid #e2e8f0' }}
                    >
                      <i className="fas fa-arrow-left me-2"></i> Back
                    </Button>
                    
                    <Button 
                      type="submit" 
                      className="py-2 rounded-pill shadow-none flex-grow-1" 
                      disabled={isSubmitting || !values.password || !values.confirmPassword || (touched.password && errors.password) || (touched.confirmPassword && errors.confirmPassword)}
                      style={{ 
                        background: 'linear-gradient(to right, #2c5282, #4299e1)',
                        border: 'none'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-user-plus me-2"></i>
                          Complete Signup
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
              

              <div className="d-none d-md-block text-center mt-4">
                <p className="mb-0">
                  Already have an account? <Link to="/login" className="text-primary fw-bold">Login</Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.auth.error
});

export default connect(mapStateToProps, { register })(Signup);
