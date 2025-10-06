import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Cell
} from "recharts";

export default function Profile() {
  const [manager, setManager] = useState({});
  const [couriers, setCouriers] = useState([]);
  const manager_id = localStorage.getItem("id");

  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchManagerDetails();
    fetchManagerCouriers();
  }, []);

  const fetchManagerDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/manager/${manager_id}`);
      if (res.data.Status) {
        setManager(res.data.Result);
      } else {
        // ✅ Handle API-specific errors
        console.error("API Error fetching manager details:", res.data.Error);
      }
    } catch (err) {
      console.error("Network/Server Error fetching manager details:", err);
    }
  };

  const fetchManagerCouriers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/courier/manager/${manager_id}`);
      if (res.data.Status) {
        setCouriers(res.data.Result);
      } else {
        // ✅ Handle API-specific errors
        console.error("API Error fetching couriers:", res.data.Error);
      }
    } catch (err) {
      console.error("Network/Server Error fetching couriers:", err);
    }
  };

  // Data processing for charts remains the same...
  const deliveredCount = couriers.filter(c => c.status === "delivered").length;
  const pendingCount = couriers.filter(c => c.status === "pending").length;

  const statusData = [
    { name: "Delivered", count: deliveredCount, color: "#4CAF50" },
    { name: "Pending", count: pendingCount, color: "#FFC107" },
  ];

  const dateMap = {};
  couriers.forEach(c => {
    const date = new Date(c.created_at).toISOString().split('T')[0];
    if (!dateMap[date]) {
      dateMap[date] = { date, Delivered: 0, Pending: 0 };
    }
    if (c.status === "delivered") {
      dateMap[date].Delivered += 1;
    } else if (c.status === "pending") {
      dateMap[date].Pending += 1;
    }
  });

  const trendData = Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="container mt-4">
      <h2 className="text-center fw-bold mb-4">📊 Manager Profile Dashboard</h2>

      {/* Manager Details */}
      <div className="shadow-sm p-4 rounded bg-light mb-4 text-center">
        <h4 className="mb-2">{manager?.name || "Manager"}</h4>
        <p className="mb-1"><strong>Email:</strong> {manager?.email || "—"}</p>
        <p className="mb-1"><strong>Phone:</strong> {manager?.phone || "—"}</p>
      </div>

      <div className="row">
        {/* Status Bar Chart */}
        <div className="col-md-6 mb-4">
          <div className="shadow-sm p-3 rounded bg-white">
            <h5 className="text-center mb-3">Courier Status Overview</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" barSize={60}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart: Trends */}
        <div className="col-md-6 mb-4">
          <div className="shadow-sm p-3 rounded bg-white">
            <h5 className="text-center mb-3">Courier Creation Trends</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Delivered" stroke="#4CAF50" strokeWidth={2} />
                <Line type="monotone" dataKey="Pending" stroke="#FFC107" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}