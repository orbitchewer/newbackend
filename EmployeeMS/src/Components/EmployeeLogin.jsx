import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeLogin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ Define API Base URL

  const handleSubmit = (event) => {
    event.preventDefault();
    // ✅ Use API_BASE
    axios
      .post(`${API_BASE}/employee/employee_login`, values)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem("valid", true);
          navigate("/employee_detail/" + result.data.id);
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background:
          "linear-gradient(135deg, #1f2937, #111827, #1f2937)",
        color: "#fff",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-4 rounded shadow-lg"
        style={{
          width: "380px",
          backgroundColor: "#1e293b",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-light">Employee Login</h2>
          <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
            Access your dashboard securely
          </p>
        </div>

        {error && (
          <div
            className="alert alert-danger py-2 text-center mb-3"
            style={{ fontSize: "0.9rem" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-light fw-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="off"
              onChange={(e) =>
                setValues({ ...values, email: e.target.value })
              }
              className="form-control rounded-3 bg-dark text-light border-0 py-2"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label text-light fw-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-3 bg-dark text-light border-0 py-2"
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
              I agree to the <span className="text-info">terms & conditions</span>
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="btn w-100 text-white fw-semibold py-2 rounded-3"
            style={{
              background:
                "linear-gradient(90deg, #2563eb, #3b82f6, #2563eb)",
              border: "none",
            }}
          >
            Log in
          </motion.button>
        </form>

        <div className="text-center mt-4">
          <p className="text-secondary mb-0" style={{ fontSize: "0.85rem" }}>
            Need help? <a href="/contact_admin" className="text-info text-decoration-none">Contact Admin</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmployeeLogin;