import React, { useEffect, useState } from "react";
import axios from "axios";
import { deliverCourier, getEmployeeCouriers } from "../Services/courierService";
import { motion } from "framer-motion";

export default function EmployeeCouriers() {
  const employee_id = localStorage.getItem("id");
  const [employee, setEmployee] = useState({});
  const [couriers, setCouriers] = useState([]);

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ Define API Base URL

  useEffect(() => {
    if (employee_id) {
      fetchEmployee();
      fetchCouriers();
    }
  }, [employee_id]);

  // ✅ Fetch employee details (API URL Change)
  async function fetchEmployee() {
    try {
      // ✅ Use API_BASE
      const res = await axios.get(`${API_BASE}/employee/detail/${employee_id}`);
      if (res.data.Status) {
        setEmployee(res.data.Result);
      }
    } catch (err) {
      console.error("Error fetching employee:", err);
    }
  }

  // ✅ Fetch couriers assigned to employee (Uses imported service, which is already corrected)
  async function fetchCouriers() {
    try {
      const res = await getEmployeeCouriers(employee_id);
      if (res.Status) {
        setCouriers(res.Result);
      }
    } catch (err) {
      console.error("Error fetching couriers:", err);
    }
  }

  // ✅ Mark a courier as delivered (Uses imported service, which is already corrected)
  // In EmployeeMS/src/Components/EmployeeCouriers.jsx

// In EmployeeMS/src/Components/EmployeeCouriers.jsx

async function handleDeliver(courier_id) {
  try {
    const employee_id = localStorage.getItem("id"); // Get the logged-in employee's ID

    // Pass both the courier_id and employee_id to the service
    const res = await deliverCourier(courier_id, employee_id); 

    if (res.Status) {
      alert("✅ Courier marked as delivered!");
      fetchCouriers(); // This will refresh the list and remove the delivered item
    } else {
      alert(res.Error || "Error updating courier");
    }
  } catch (err) {
    console.error("Error marking courier delivered:", err);
  }
}
  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-primary">Employee Dashboard</h2>
        <p className="text-muted">Manage your assigned deliveries here</p>
      </div>

      {/* Employee Info Card */}
      <motion.div
        className="card shadow-sm p-4 mb-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h5 className="mb-3 fw-bold text-secondary">👤 Employee Details</h5>
        <div className="row">
          <div className="col-md-6">
            <p><strong>Name:</strong> {employee.name}</p>
            <p><strong>Email:</strong> {employee.email}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Phone:</strong> {employee.phone}</p>
            <p><strong>Pincode:</strong> {employee.pincode}</p>
          </div>
        </div>
      </motion.div>

      {/* Couriers List */}
      <motion.div
        className="card shadow-sm p-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h5 className="mb-3 fw-bold text-secondary">📦 My Assigned Couriers</h5>

        {couriers.length === 0 ? (
          <div className="text-center text-muted py-4">
            No couriers assigned yet.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tracking Number</th>
                  <th>Description</th>
                  <th>Pincode</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {couriers.map((c) => (
                  <motion.tr
                    key={c.courier_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="fw-semibold text-primary">
                      {c.tracking_number || `TRK-${c.courier_id}`}
                    </td>
                    <td>{c.description}</td>
                    <td>{c.pincode}</td>
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
                    <td>
                      {c.status === "pending" ? (
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => handleDeliver(c.courier_id)}
                        >
                          Mark Delivered
                        </button>
                      ) : (
                        <span className="text-success fw-semibold">
                          Delivered ✓
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}