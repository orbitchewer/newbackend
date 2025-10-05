import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ContactAdmin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    issueType: "Login Problem",
    message: "",
  });
  const [success, setSuccess] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ Define API Base URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Use API_BASE
      const res = await axios.post(`${API_BASE}/auth/contact_admin`, form);
      if (res.data.Status) {
        setSuccess(true);
        setTimeout(() => navigate("/adminlogin"), 2500);
      } else {
        alert(res.data.Error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while sending your message!");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #533483)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
      }}
    >
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .glass-card {
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            background-color: rgba(17, 25, 40, 0.65);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.125);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            color: #fff;
          }

          .form-control, .form-select {
            background-color: rgba(255, 255, 255, 0.1) !important;
            color: #fff !important;
            border: none;
          }

          .form-control:focus, .form-select:focus {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
          }

          .btn-glow {
            background: linear-gradient(135deg, #00b894, #00cec9);
            color: white;
            border: none;
            transition: all 0.3s ease;
          }
          .btn-glow:hover {
            box-shadow: 0 0 10px #00cec9, 0 0 20px #00b894;
            transform: translateY(-2px);
          }

          .btn-outline-light:hover {
            background-color: rgba(255, 255, 255, 0.15);
          }
        `}
      </style>

      <motion.div
        className="glass-card p-5 text-light"
        style={{ width: "420px", maxWidth: "90%" }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-center mb-3 fw-bold">📬 Contact Admin</h2>
        <p className="text-center text-light mb-4" style={{ opacity: 0.8 }}>
          Facing login or account issues? Let us know below — we’ll get back to you soon.
        </p>

        <AnimatePresence>
          {success ? (
            <motion.div
              className="alert alert-success text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              ✅ Message sent successfully! Redirecting...
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={form.name}
                  required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={form.email}
                  required
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Issue Type</label>
                <select
                  className="form-select"
                  value={form.issueType}
                  onChange={(e) => setForm({ ...form, issueType: e.target.value })}
                >
                  <option>Login Problem</option>
                  <option>Account Locked</option>
                  <option>Password Reset</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Describe your issue..."
                  value={form.message}
                  required
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                ></textarea>
              </div>

              <motion.button
                type="submit"
                className="btn btn-glow w-100 mb-3"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Send Message
              </motion.button>

              <motion.button
                type="button"
                className="btn btn-outline-light w-100"
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate("/adminlogin")}
              >
                ← Back to Login
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ContactAdmin;