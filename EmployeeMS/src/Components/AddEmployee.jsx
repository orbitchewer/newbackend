import axios from "axios";
import React, { useState, useEffect } from "react"; // Kept useEffect since it was in original
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    phone: "", // Adjusted field
    pincode: "", // Adjusted field
    // Removed unused initial state: salary, address, category_id, image
  });
  const [category, setCategory] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    // ✅ Changed API base URL to use VITE_API_URL from .env
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
    e.preventDefault()
    // Since your backend employee route seems to expect JSON, we'll send the state directly.
    // If your backend is configured for multer (file upload), you should re-enable FormData.
    // Assuming JSON post for the simple fields (name, email, password, phone, pincode).
    
    // ✅ Changed API base URL to use VITE_API_URL from .env
    axios.post(`${import.meta.env.VITE_API_URL}/employee/add`, employee) 
    .then(result => {
        if(result.data.Status) {
            navigate('/dashboard/employee')
        } else {
            alert(result.data.Error)
        }
    })
    .catch(err => console.log(err))
  }


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
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control rounded-0"
              placeholder="Enter Email"
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control rounded-0"
              placeholder="Enter Password"
              onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Enter Phone Number"
              onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
            />
          </div>
          <div className="col-12">
            <label className="form-label">Pincode</label>
            <input
              type="text"
              className="form-control rounded-0"
              placeholder="Enter Pincode"
              onChange={(e) => setEmployee({ ...employee, pincode: e.target.value })}
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