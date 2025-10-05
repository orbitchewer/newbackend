import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeDetail = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ Define API Base URL

  useEffect(() => {
    // ✅ Use API_BASE
    axios
      .get(`${API_BASE}/employee/`)
      .then((result) => {
        if (result.data.Status) {
          setEmployees(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const handleLogout = () => {
    // ✅ Use API_BASE
    axios
      .get(`${API_BASE}/employee/logout`)
      .then((result) => {
        if (result.data.Status) {
          localStorage.removeItem("valid");
          navigate("/");
        }
      })
      .catch((err) => console.error("Logout error:", err));
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="p-3 shadow d-flex justify-content-between align-items-center bg-dark text-white">
        <h4 className="m-0">Employee Management System</h4>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Search Bar */}
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>All Employees</h3>
          <input
            type="text"
            placeholder="Search by name or email"
            className="form-control w-25"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Employee Table */}
        {filteredEmployees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <div className="table-responsive shadow-sm rounded">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Pincode</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.employee_id}>
                    <td>{emp.employee_id}</td>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.pincode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;