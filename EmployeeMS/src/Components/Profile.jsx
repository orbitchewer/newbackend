import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from "recharts";

export default function Profile() {
  const [manager, setManager] = useState({});
  const [couriers, setCouriers] = useState([]);
  const manager_id = localStorage.getItem("id");

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ Define API Base URL

  useEffect(() => {
    fetchManagerDetails();
    fetchManagerCouriers();
  }, []);

  const fetchManagerDetails = async () => {
    try {
      // ✅ Use API_BASE
      const res = await axios.get(`${API_BASE}/auth/manager/${manager_id}`);
      if (res.data.Status) setManager(res.data.Result);
    } catch (err) {
      console.error("Error fetching manager details:", err);
    }
  };

  const fetchManagerCouriers = async () => {
    try {
      // ✅ Use API_BASE
      const res = await axios.get(`${API_BASE}/courier/manager/${manager_id}`);
      if (res.data.Status) setCouriers(res.data.Result);
    } catch (err) {
      console.error("Error fetching couriers:", err);
    }
  };

  // ✅ Prepare Data for Charts
  const deliveredCount = couriers.filter(c => c.status === "delivered").length;
  const pendingCount = couriers.filter(c => c.status === "pending").length;

  const statusData = [
    { name: "Delivered", count: deliveredCount },
    { name: "Pending", count: pendingCount },
  ];

  // ✅ Group couriers by date for trend graph
  const dateMap = {};
  couriers.forEach(c => {
    const date = new Date(c.created_at).toLocaleDateString();
    if (!dateMap[date]) dateMap[date] = { date, Delivered: 0, Pending: 0 };
    if (c.status === "delivered") dateMap[date].Delivered += 1;
    else dateMap[date].Pending += 1;
  });

  const trendData = Object.values(dateMap);

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
                <Bar dataKey="count" fill="#4CAF50" barSize={60} />
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