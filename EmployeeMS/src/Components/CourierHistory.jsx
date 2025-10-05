import React, { useEffect, useState } from "react";
import axios from "axios";

const CourierHistory = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState({ pincode: "", from: "", to: "" });

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ Define API Base URL

  const fetchHistory = async () => {
    try {
      // ✅ Use API_BASE
      const res = await axios.get(`${API_BASE}/courier/history`, {
        params: filter,
      });
      if (res.data.Status) setHistory(res.data.Result);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchHistory();
  };

  return (
    <div className="container mt-4">
      <h3>Courier History</h3>
      <form className="mb-3 shadow-sm p-3 rounded" onSubmit={handleFilter}>
        <div className="row">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Pincode"
              value={filter.pincode}
              onChange={(e) => setFilter({ ...filter, pincode: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={filter.from}
              onChange={(e) => setFilter({ ...filter, from: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={filter.to}
              onChange={(e) => setFilter({ ...filter, to: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary w-100">Apply</button>
          </div>
        </div>
      </form>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Description</th>
            <th>Pincode</th>
            <th>Employee</th>
            <th>Assigned At</th>
            <th>Delivered At</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.map((h) => (
              <tr key={h.id}>
                <td>{h.description}</td>
                <td>{h.pincode}</td>
                <td>{h.employee_name}</td>
                <td>{h.assigned_at}</td>
                <td>{h.delivered_at || "Pending"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No courier history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CourierHistory;