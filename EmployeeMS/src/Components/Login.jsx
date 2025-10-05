import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ Define API Base URL

  const handleSubmit = (e) => {
    e.preventDefault();
    // ✅ Use API_BASE
    axios
      .post(`${API_BASE}/auth/adminlogin`, values)
      .then((result) => {
        if (result.data.loginStatus) {
            localStorage.setItem("valid", "true");
            if (result.data.id) localStorage.setItem("id", result.data.id);  // <-- important
            navigate('/dashboard');
        }else {
          setError(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
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
      {/* Subtle floating background circles */}
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

      {/* Main login card */}
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
            Manager Login
          </motion.h2>
          <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
            Welcome back to your dashboard
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
          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={(e) =>
                setValues({ ...values, email: e.target.value })
              }
              className="form-control rounded-3 bg-dark text-light border-0 py-2"
              style={{ backgroundColor: "#0f172a" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-3 bg-dark text-light border-0 py-2"
              style={{ backgroundColor: "#0f172a" }}
            />
          </div>

          <div className="form-check text-start mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="tick"
              style={{ cursor: "pointer" }}
            />
            <label
              className="form-check-label text-secondary"
              htmlFor="tick"
              style={{ fontSize: "0.85rem" }}
            >
              I agree to the{" "}
              <span className="text-info text-decoration-none">
                terms & conditions
              </span>
            </label>
          </div>

          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 15px rgba(168,85,247,0.5)",
            }}
            whileTap={{ scale: 0.98 }}
            className="btn w-100 text-white fw-semibold py-2 rounded-3"
            style={{
              background:
                "linear-gradient(90deg, #3b82f6, #9333ea, #3b82f6)",
              border: "none",
              letterSpacing: "0.5px",
            }}
          >
            Sign In
          </motion.button>
        </form>

        <div className="text-center mt-4">
          <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>
            Need help?{" "}
            <a href="/contact_admin" className="text-info text-decoration-none">
            Contact Admin
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;