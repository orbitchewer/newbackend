import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function PrivateRoute({ children, allowedRole }) {
  const [auth, setAuth] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL; // ✅ Define API Base URL

  useEffect(() => {
    // ✅ Use API_BASE
    axios
      .get(`${API_BASE}/verify`, { withCredentials: true })
      .then((res) => {
        if (res.data.Status && res.data.role === allowedRole) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      })
      .catch(() => setAuth(false));
  }, [allowedRole]);

  if (auth === null) return <div>Loading...</div>;

  return auth ? children : <Navigate to="/" />;
}