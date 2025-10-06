import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    pincode: "",
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/category`)
      .then((result) => {
        if (result.data.Status) {
          setCategory(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ===== VALIDATION LOGIC START =====
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employee.email)) {
      alert("Please enter a valid email address.");
      return; // Stop submission
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(employee.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return; // Stop submission
    }

    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(employee.pincode)) {
      alert("Pincode must be exactly 6 digits.");
      return; // Stop submission
    }
    // ===== VALIDATION LOGIC END =====

    axios
      .post(`${import.meta.env.VITE_API_URL}/employee/add`, employee)
      .then((result) => {
        if (result.data.Status) {
          navigate("/dashboard/employee");
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-12">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Enter Name"
              required
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-0"
              placeholder="Enter Email"
              required
              onChange={(e) =>
                setEmployee({ ...employee, email: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-0"
              placeholder="Enter Password"
              required
              onChange={(e) =>
                setEmployee({ ...employee, password: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Enter Phone Number"
              required
              onChange={(e) =>
                setEmployee({ ...employee, phone: e.target.value })
              }
              // ===== HTML5 VALIDATION ATTRIBUTES ADDED =====
              maxLength="10"
              pattern="\d{10}"
              title="Phone number must be 10 digits"
            />
          </div>
          <div className="col-12">
            <label className="form-label">Pincode</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Enter Pincode"
              required
              onChange={(e) =>
                setEmployee({ ...employee, pincode: e.target.value })
              }
              // ===== HTML5 VALIDATION ATTRIBUTES ADDED =====
              maxLength="6"
              pattern="\d{6}"
              title="Pincode must be 6 digits"
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;