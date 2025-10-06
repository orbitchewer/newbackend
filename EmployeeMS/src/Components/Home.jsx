import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [managerTotal, setManagerTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [courierTotal, setCourierTotal] = useState(0);
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [editing, setEditing] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate(); 
  // Detect system theme
  useEffect(() => {
    const matchMedia = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(matchMedia.matches);
    matchMedia.addEventListener("change", (e) => setIsDarkMode(e.matches));
  }, []);

  useEffect(() => {
    fetchManagers();
    fetchEmployees();
    fetchCouriers();
  }, []);

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ Define API Base URL

  const showToast = (msg, type = "success") =>
    toast[type](msg, {
      position: "top-right",
      autoClose: 2000,
      theme: isDarkMode ? "dark" : "colored",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
    });

  const fetchManagers = () => {
    // ✅ Use API_BASE
    axios.get(`${API_BASE}/auth/admin_records`).then((res) => {
      if (res.data.Status) {
        setManagers(res.data.Result);
        setManagerTotal(res.data.Result.length);
      } else toast.error(res.data.Error);
    });
  };

  const fetchEmployees = () => {
    // ✅ Use API_BASE
    axios.get(`${API_BASE}/employee`).then((res) => {
      if (res.data.Status) setEmployeeTotal(res.data.Result.length);
    });
  };

  const fetchCouriers = () => {
    // ✅ Use API_BASE
    axios.get(`${API_BASE}/courier/count`).then((res) => {
      if (res.data.Status) setCourierTotal(res.data.Result[0].couriers);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editing
      // ✅ Use API_BASE
      ? `${API_BASE}/auth/edit_manager/${editing}`
      // ✅ Use API_BASE
      : `${API_BASE}/auth/add_manager`;

    axios[editing ? "put" : "post"](url, form)
      .then((res) => {
        if (res.data.Status) {
          fetchManagers();
          setForm({ name: "", email: "", password: "", phone: "" });
          setEditing(null);
          showToast(editing ? "Manager updated successfully!" : "Manager added successfully!");
          navigate('/dashboard/employee', { state: { refresh: true } });
        } else {
          toast.error(res.data.Error);
        }
      })
      .catch(() => toast.error("An error occurred"));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;
    // ✅ Use API_BASE
    axios.delete(`${API_BASE}/auth/delete_manager/${id}`).then((res) => {
      if (res.data.Status) {
        setManagers(managers.filter((m) => m.admin_id !== id));
        showToast("Manager deleted successfully!", "info");
      } else toast.error(res.data.Error);
    });
  };

  const handleEdit = (m) => {
    setEditing(m.admin_id);
    setForm({ name: m.name, email: m.email, password: "", phone: m.phone });
  };

  const theme = {
    background: isDarkMode ? "#1E1E1E" : "#FAFAFA",
    card: isDarkMode ? "#2C2C2C" : "#FFFFFF",
    text: isDarkMode ? "#EAEAEA" : "#1A1A1A",
    header: isDarkMode ? "#343434" : "#E0F2FE",
    border: isDarkMode ? "#3A3A3A" : "#E5E7EB",
    accent: "#6C63FF",
  };

  return (
    <div
      className="container py-4"
      style={{
        fontFamily: "Poppins, sans-serif",
        color: theme.text,
        background: theme.background,
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      <ToastContainer />

      {/* ===== Stats Section ===== */}
      <div className="row text-center mb-4">
        {[
          { title: "Managers", value: managerTotal, color: "#7DD3FC" },
          { title: "Employees", value: employeeTotal, color: "#C7B8EA" },
          { title: "Couriers", value: courierTotal, color: "#FEBE8C" },
        ].map((stat, idx) => (
          <div className="col-md-4 mb-3" key={idx}>
            <div
              className="card border-0 shadow-sm"
              style={{
                background: isDarkMode ? "#333" : stat.color,
                borderRadius: "15px",
                color: isDarkMode ? "#EAEAEA" : "#1A1A1A",
                transition: "transform 0.2s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div className="card-body">
                <h5 className="fw-medium mb-2">{stat.title}</h5>
                <h2 className="fw-bold">{stat.value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Manager List ===== */}
      <div
        className="card shadow-sm border-0 mb-4"
        style={{
          borderRadius: "15px",
          background: theme.card,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{
            background: theme.header,
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
          }}
        >
          <h5 className="mb-0 fw-semibold" style={{ color: theme.text }}>
            List of Managers
          </h5>
          {/* <button
            className="btn btn-outline-dark btn-sm"
            onClick={() => {
              setEditing(null);
              setForm({ name: "", email: "", password: "", phone: "" });
            }}
          >
            + Add New
          </button> */}
        </div>

        <div className="card-body table-responsive">
          <table className={`table align-middle ${isDarkMode ? "table-dark" : ""} table-hover`}>
            <thead style={{ background: isDarkMode ? "#2D2D2D" : "#F9FAFB" }}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers.length > 0 ? (
                managers.map((m) => (
                  <tr key={m.admin_id}>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.phone}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-outline-success btn-sm me-2"
                        onClick={() => handleEdit(m)}
                      >
                        <i className="bi bi-pencil-square"></i> Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(m.admin_id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-3">
                    No managers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Add/Edit Manager Form ===== */}
      <div
        className="card shadow-sm border-0"
        style={{
          borderRadius: "15px",
          background: theme.card,
          border: `1px solid ${theme.border}`,
        }}
      >
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{
            background: theme.header,
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
          }}
        >
          <h5 className="mb-0 fw-semibold" style={{ color: theme.text }}>
            {editing ? "Edit Manager" : "Add Manager"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-medium">Name</label>
              <input
                type="text"
                className="form-control"
                style={{ background: isDarkMode ? "#3A3A3A" : "", color: theme.text }}
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-medium">Email</label>
              <input
                type="email"
                className="form-control"
                style={{ background: isDarkMode ? "#3A3A3A" : "", color: theme.text }}
                value={form.email}
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            {!editing && (
              <div className="col-md-6">
                <label className="form-label fw-medium">Password</label>
                <input
                  type="password"
                  className="form-control"
                  style={{ background: isDarkMode ? "#3A3A3A" : "", color: theme.text }}
                  value={form.password}
                  required
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            )}
            <div className="col-md-6">
              <label className="form-label fw-medium">Phone</label>
              <input
                type="text"
                className="form-control"
                style={{ background: isDarkMode ? "#3A3A3A" : "", color: theme.text }}
                value={form.phone}
                required
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="col-12 d-flex justify-content-end mt-3">
              <button type="submit" className="btn btn-primary px-4">
                {editing ? "Update Manager" : "Add Manager"}
              </button>
              {editing && (
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2 px-4"
                  onClick={() => {
                    setEditing(null);
                    setForm({ name: "", email: "", password: "", phone: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;