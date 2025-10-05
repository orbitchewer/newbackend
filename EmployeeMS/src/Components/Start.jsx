import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Start() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ Define API Base URL

  useEffect(() => {
    // Clear old data on load
    localStorage.removeItem("role");
    localStorage.removeItem("id");

    // ✅ Use API_BASE
    axios
      .get(`${API_BASE}/verify`, { withCredentials: true })
      .then((res) => {
        if (res.data.Status) {
          localStorage.setItem("role", res.data.role);
          localStorage.setItem("id", res.data.id);

          if (res.data.role === "manager") {
            navigate("/dashboard");
          } else if (res.data.role === "employee") {
            navigate("/employee_couriers");
          }
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        >
          <i className="bi bi-arrow-repeat fs-2"></i>
        </motion.div>
        <span className="ms-3 fs-5">Checking session...</span>
      </div>
    );

  return (
    <div
      className="vh-100 d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "#fff",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="p-5 rounded shadow-lg bg-dark bg-opacity-75"
        style={{ width: "90%", maxWidth: "450px" }}
      >
        <motion.h1
          className="fw-bold mb-4"
          style={{
            background: "linear-gradient(to right, #00c6ff, #0072ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          Courier Management System
        </motion.h1>

        <p className="text-light mb-4">
          Manage, track, and deliver your couriers efficiently.
        </p>

        <motion.div
          className="d-flex flex-column gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/adminlogin"
            className="btn btn-outline-info fw-semibold py-2 px-4 rounded-3"
            style={{
              boxShadow: "0 0 10px rgba(0, 198, 255, 0.4)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 0 20px rgba(0, 198, 255, 0.8)")
            }
            onMouseLeave={(e) =>
              (e.target.style.boxShadow = "0 0 10px rgba(0, 198, 255, 0.4)")
            }
          >
            Manager Login
          </Link>

          <Link
            to="/employee_login"
            className="btn btn-outline-success fw-semibold py-2 px-4 rounded-3"
            style={{
              boxShadow: "0 0 10px rgba(0, 255, 128, 0.4)",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 0 20px rgba(0, 255, 128, 0.8)")
            }
            onMouseLeave={(e) =>
              (e.target.style.boxShadow = "0 0 10px rgba(0, 255, 128, 0.4)")
            }
          >
            Employee Login
          </Link>
        </motion.div>

        <motion.p
          className="mt-4 small text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          © {new Date().getFullYear()} All Rights Reserved
        </motion.p>
      </motion.div>
    </div>
  );
}