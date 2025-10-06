import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  createCourier,
  getManagerCouriers,
  getReport,
} from "../Services/courierService";

export default function ManagerCouriers() {
  const manager_id = localStorage.getItem("id");
  const [couriers, setCouriers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    tracking_number: "",
    description: "",
    pincode: "",
    employee_id: "",
  });
  const [filter, setFilter] = useState({ status: "pending" });
  const [report, setReport] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ Define API Base URL

  useEffect(() => {
    if (manager_id) {
      fetchCouriers();
      fetchEmployees();
    }
  }, [manager_id]);

  async function fetchCouriers() {
    try {
      const res = await getManagerCouriers(manager_id);
      if (res.Status) setCouriers(res.Result);
    } catch (err) {
      console.error("Error fetching couriers:", err);
    }
  }

  async function fetchEmployees() {
    try {
      // ✅ Use API_BASE
      const res = await axios.get(`${API_BASE}/employee`);
      if (res.data.Status) setEmployees(res.data.Result);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  }

  // ✅ Add new courier + auto-assign (updates instantly)
  // In EmployeeMS/src/Components/ManagerCouriers.jsx

// In EmployeeMS/src/Components/ManagerCouriers.jsx

async function handleAdd(e) {
  e.preventDefault();
  try {
    const payload = {
      ...form,
      manager_id,
      employee_id: form.employee_id || null,
    };
    const res = await createCourier(payload); // This calls your service
    if (res.Status) {
      setForm({
        tracking_number: "",
        description: "",
        pincode: "",
        employee_id: "",
      });

      // ✅ Instantly add the new courier from the response to the top of the list
      setCouriers(prevCouriers => [res.Result, ...prevCouriers]);
      
      // ✅ We no longer need this, so it can be removed
      // await fetchCouriers(); 

      alert("✅ Courier added successfully!");
    } else {
      alert(res.Error || "Error adding courier");
    }
  } catch (err) {
    console.error("Error adding courier:", err);
  }
}
  async function handleReport(e) {
    e.preventDefault();
    try {
      const res = await getReport(filter.pincode, filter.from, filter.to);
      if (res.Status) setReport(res.Result);
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  }

  // Filtering + Pagination
  const filteredCouriers = couriers.filter(
    (c) => c.status === (filter.status || "pending")
  );
  const totalPages = Math.ceil(filteredCouriers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCouriers = filteredCouriers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="container mt-4">
      {/* ➕ Add Courier Section */}
      <h3 className="mb-3 text-primary fw-bold">Add Courier</h3>
      <form
        onSubmit={handleAdd}
        className="mb-4 shadow-sm p-4 rounded bg-light"
      >
        <div className="row">
          <div className="col-md-3 mb-3">
            <input
              className="form-control"
              placeholder="Tracking Number"
              value={form.tracking_number}
              onChange={(e) =>
                setForm({ ...form, tracking_number: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              className="form-control"
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3 mb-3">
            <select
              className="form-select"
              value={form.employee_id}
              onChange={(e) =>
                setForm({ ...form, employee_id: e.target.value })
              }
            >
              <option value="">Assign Employee (optional)</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.name} — {emp.pincode}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <button className="btn btn-primary w-100">Add Courier</button>
          </div>
        </div>
        <textarea
          className="form-control"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </form>

      {/* 📦 Status of Couriers */}
      <h4 className="mt-5 mb-3 text-center fw-bold text-secondary">
        Status of Couriers
      </h4>

      {/* Filter */}
      <div className="d-flex justify-content-center mb-3">
        <select
          className="form-select w-auto shadow-sm"
          value={filter.status}
          onChange={(e) => {
            setFilter({ ...filter, status: e.target.value });
            setCurrentPage(1);
          }}
        >
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Couriers Table */}
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Tracking Number</th>
              <th>Description</th>
              <th>Pincode</th>
              <th>Assigned To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginatedCouriers.length > 0 ? (
                paginatedCouriers.map((c, index) => (
                  <motion.tr
                    key={c.courier_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="fw-semibold text-primary">
                      {c.tracking_number ||
                        `TRK-${String(
                          index + 1 + (currentPage - 1) * itemsPerPage
                        ).padStart(4, "0")}`}
                    </td>
                    <td>{c.description}</td>
                    <td>{c.pincode}</td>
                    <td
                      className={
                        c.status === "delivered"
                          ? "text-success fw-semibold"
                          : c.employee_name
                          ? "text-dark fw-semibold"
                          : "text-danger fw-semibold"
                      }
                    >
                      {c.employee_name || "Unassigned"}
                    </td>
                    <td>
                      <span
                        className={`badge px-3 py-2 ${
                          c.status === "delivered"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {c.status.toUpperCase()}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-3">
                    No {filter.status} couriers found.
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* 🌀 Pagination */}
      {filteredCouriers.length > itemsPerPage && (
        <motion.div
          className="d-flex justify-content-center align-items-center mt-3 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-muted">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </motion.div>
      )}

      <div className="my-5"></div>

      {/* 📊 Delivered Report */}
      <h4>Delivered Report</h4>
      <form
        onSubmit={handleReport}
        className="mb-3 shadow-sm p-3 rounded bg-light"
      >
        <div className="row">
          <div className="col-md-3 mb-2">
            <input
              className="form-control"
              placeholder="Pincode"
              value={filter.pincode || ""}
              onChange={(e) =>
                setFilter({ ...filter, pincode: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-3 mb-2">
            <input
              type="date"
              className="form-control"
              value={filter.from || ""}
              onChange={(e) => setFilter({ ...filter, from: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3 mb-2">
            <input
              type="date"
              className="form-control"
              value={filter.to || ""}
              onChange={(e) => setFilter({ ...filter, to: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3 mb-2">
            <button className="btn btn-success w-100">Get Report</button>
          </div>
        </div>
      </form>

      {report && (
        <div className="alert alert-info">
          <strong>{report.count}</strong> couriers delivered in pincode{" "}
          <strong>{filter.pincode}</strong> between {filter.from} and{" "}
          {filter.to}.
        </div>
      )}
    </div>
  );
}