import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from "./Components/Start";
import Login from "./Components/Login";
import EmployeeLogin from "./Components/EmployeeLogin";
import EmployeeDetail from "./Components/EmployeeDetail";
import Dashboard from "./Components/Dashboard";
import Home from "./Components/Home";
import Employee from "./Components/Employee";
import Category from "./Components/Category";
import Profile from "./Components/Profile";
import AddCategory from "./Components/AddCategory";
import AddEmployee from "./Components/AddEmployee";
import EditEmployee from "./Components/EditEmployee";
import ManagerCouriers from "./Components/ManagerCouriers";
import EmployeeCouriers from "./Components/EmployeeCouriers";
import CourierHistory from "./Components/CourierHistory";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Start />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/employee_login" element={<EmployeeLogin />} />
        <Route path="/employee_detail/:id" element={<EmployeeDetail />} />

        {/* Manager Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <PrivateRoute allowedRole="manager">
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="" element={<Home />} />
          <Route path="employee" element={<Employee />} />
          <Route path="category" element={<Category />} />
          <Route path="profile" element={<Profile />} />
          <Route path="add_category" element={<AddCategory />} />
          <Route path="add_employee" element={<AddEmployee />} />
          <Route path="edit_employee/:id" element={<EditEmployee />} />
          <Route path="couriers" element={<ManagerCouriers />} />
          <Route path="history" element={<CourierHistory />} />
        </Route>

        {/* Employee Dashboard */}
        <Route
          path="/employee_couriers"
          element={
            <PrivateRoute allowedRole="employee">
              <EmployeeCouriers />
            </PrivateRoute>
          }
        />
        <Route
          path="/courier_history"
          element={
            <PrivateRoute allowedRole="employee">
              <CourierHistory />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
