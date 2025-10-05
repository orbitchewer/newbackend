// src/Services/courierService.js
import axios from "axios";

// ✅ Changed API base URL to use VITE_API_URL from .env
const API = `${import.meta.env.VITE_API_URL}/courier`; 
axios.defaults.withCredentials = true; // important for cookies (JWT) to work

export const createCourier = (data) =>
  axios.post(`${API}/add`, data).then((r) => r.data);

export const getManagerCouriers = (managerId) =>
  axios.get(`${API}/manager/${managerId}`).then((r) => r.data);

export const getEmployeeCouriers = (employeeId) =>
  axios.get(`${API}/employee/${employeeId}`).then((r) => r.data);

export const deliverCourier = (courierId) =>
  axios.put(`${API}/deliver/${courierId}`).then((r) => r.data);

export const getReport = (pincode, from, to) =>
  axios.post(`${API}/report`, { pincode, from, to }).then((r) => r.data);

export const getCourierCount = () =>
  axios.get(`${API}/count`).then((r) => r.data);

export const getHistory = (params = {}) =>
  axios.get(`${API}/history`, { params }).then((r) => r.data);