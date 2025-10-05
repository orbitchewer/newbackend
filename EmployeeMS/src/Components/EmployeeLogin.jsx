import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeLogin = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    pincode: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (isSignup) {
      // ✅ Signup request
      axios
        .post("http://localhost:3000/employee/add", values)
        .then((res) => {
          if (res.data.Status) {
            setSuccess("Account created successfully! You can now log in.");
            setIsSignup(false);
            setValues({ name: "", email: "", password: "", phone: "", pincode: "" });
          } else {
            setError(res.data.Error);
          }
        })
        .catch((err) => setError("Signup failed. Please try again."));
    } else {
      // ✅ Login request
      axios
        .post("http://localhost:3000/employee/employee_login", values)
        .then((result) => {
          if (result.data.loginStatus) {
            localStorage.setItem("valid", true);
            navigate("/employee_detail/" + result.data.id);
          } else {
            setError(result.data.Error);
          }
        })
        .catch((err) => setError("Login failed. Please try again."));
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #1f2937, #111827, #1f2937)",
        color: "#fff",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-4 rounded shadow-lg"
        style={{
          width: "400px",
          backgroundColor: "#1e293b",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="text-center mb-4">
          <h2 className="fw-bold text-light">
            {isSignup ? "Employee Sign Up" : "Employee Login"}
          </h2>
          <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
            {isSignup
              ? "Create your employee account"
              : "Access your dashboard securely"}
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

        {success && (
          <div
            className="alert alert-success py-2 text-center mb-3"
            style={{ fontSize: "0.9rem" }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <div className="mb-3">
                <label className="form-label text-light fw-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                  className="form-control rounded-3 bg-dark text-light border-0 py-2"
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light fw-semibold">Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone"
                  value={values.phone}
                  onChange={(e) =>
                    setValues({ ...values, phone: e.target.value })
                  }
                  className="form-control rounded-3 bg-dark text-light border-0 py-2"
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light fw-semibold">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Enter your pincode"
                  value={values.pincode}
                  onChange={(e) =>
                    setValues({ ...values, pincode: e.target.value })
                  }
                  className="form-control rounded-3 bg-dark text-light border-0 py-2"
                />
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={(e) =>
                setValues({ ...values, email: e.target.value })
              }
              className="form-control rounded-3 bg-dark text-light border-0 py-2"
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className="form-control rounded-3 bg-dark text-light border-0 py-2"
            />
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
            {isSignup ? "Sign Up" : "Log In"}
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

export default EmployeeLogin;