import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

axios.defaults.withCredentials = true;
//qqwe
const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (isSignup) {
      // ✅ Manager Signup
      axios
        .post(`${import.meta.env.VITE_API_URL}/auth/signup`, values)
        .then((res) => {
          console.log("Signup Response:", res.data);
          if (res.data.signupStatus) {
            alert("Signup successful!");
            navigate("/dashboard"); // ✅ redirect to same dashboard
          } else {
            setError(res.data.Error || "Signup failed. Please try again.");
          }
        })
        .catch(() => setError("Signup failed. Please try again."));
    } else {
      // ✅ Manager Login
      axios
        .post(`${import.meta.env.VITE_API_URL}/auth/adminlogin`, {
          email: values.email,
          password: values.password,
        })
        .then((res) => {
          console.log("Login Response:", res.data);
          if (res.data.loginStatus) {
            localStorage.setItem("id", res.data.id)
            navigate("/dashboard"); // ✅ redirect to same dashboard
          } else {
            setError(res.data.Error || "Invalid email or password.");
          }
        })
        .catch(() => setError("Login failed. Please try again."));
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "radial-gradient(circle at top left, #0f172a, #1e293b 70%)",
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Background Glows */}
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "400px",
          height: "400px",
          background: "rgba(147, 51, 234, 0.15)",
          top: "-100px",
          right: "-100px",
          filter: "blur(80px)",
        }}
      />
      <div
        className="position-absolute rounded-circle"
        style={{
          width: "300px",
          height: "300px",
          background: "rgba(59, 130, 246, 0.15)",
          bottom: "-80px",
          left: "-100px",
          filter: "blur(70px)",
        }}
      />

      {/* Login/Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-4 rounded-4 shadow-lg"
        style={{
          width: "400px",
          backdropFilter: "blur(16px)",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="text-center mb-4">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="fw-bold text-light"
          >
            {isSignup ? "Manager Sign Up" : "Manager Login"}
          </motion.h2>
          <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
            {isSignup
              ? "Create your manager account"
              : "Welcome back to your dashboard"}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="alert alert-danger text-center py-2 mb-3"
            style={{ fontSize: "0.9rem" }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div className="mb-3">
                <label className="form-label text-light fw-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleInput}
                  required
                  className="form-control rounded-3 bg-dark text-light border-0 py-2"
                  style={{ backgroundColor: "#0f172a" }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light fw-semibold">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={values.phone}
                  onChange={handleInput}
                  className="form-control rounded-3 bg-dark text-light border-0 py-2"
                  style={{ backgroundColor: "#0f172a" }}
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleInput}
              required
              className="form-control rounded-3 bg-dark text-light border-0 py-2"
              style={{ backgroundColor: "#0f172a" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleInput}
              required
              className="form-control rounded-3 bg-dark text-light border-0 py-2"
              style={{ backgroundColor: "#0f172a" }}
            />
          </div>

          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 15px rgba(168,85,247,0.5)",
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn w-100 text-white fw-semibold py-2 rounded-3"
            style={{
              background:
                "linear-gradient(90deg, #3b82f6, #9333ea, #3b82f6)",
              border: "none",
              letterSpacing: "0.5px",
            }}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </motion.button>
        </form>

        <div className="text-center mt-4">
          <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignup(false)}
                  className="btn btn-link text-info p-0"
                  style={{ fontSize: "0.85rem" }}
                >
                  Log In
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsSignup(true)}
                  className="btn btn-link text-info p-0"
                  style={{ fontSize: "0.85rem" }}
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;