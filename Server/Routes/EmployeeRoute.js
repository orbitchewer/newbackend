import express from 'express';
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
// bcrypt import removed

const router = express.Router();

// ✅ Employee Login (Plaintext check)
router.post("/employee_login", (req, res) => {
  const sql = "SELECT * FROM employee WHERE email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });

    if (result.length > 0) {
      const employee = result[0];
      
      // 🛑 PLAIN TEXT CHECK: Compare password directly
      if (req.body.password === employee.password) {
        const token = jwt.sign(
          { role: "employee", email: employee.email, id: employee.employee_id },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );

        res.cookie("token", token, { httpOnly: true });
        return res.json({ loginStatus: true, id: employee.employee_id });
      } else {
        return res.json({ loginStatus: false, Error: "Wrong email or password" });
      }
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});

// ✅ Get all employees
router.get("/", (req, res) => {
  const sql = "SELECT employee_id, name, email, phone, pincode FROM employee";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result });
  });
});

// ✅ Get Employee Details
router.get('/detail/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM employee WHERE employee_id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error" });
    return res.json({ Status: true, Result: result[0] });
  });
});

// ✅ Add Employee (Plaintext save)
router.post("/add", async (req, res) => {
  const { name, email, password, phone, pincode } = req.body;

  try {
    // 🛑 PLAIN TEXT SAVE: Saving password directly without hashing
    const plaintextPassword = password; 
    const sql = "INSERT INTO employee (name, email, password, phone, pincode) VALUES (?, ?, ?, ?, ?)";
    con.query(sql, [name, email, plaintextPassword, phone, pincode], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Insert error: " + err.message });
      return res.json({ Status: true, Message: "Employee added successfully" });
    });
  } catch (error) {
    return res.json({ Status: false, Error: error.message });
  }
});

// ✅ Update Employee
router.put("/update/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, phone, pincode } = req.body;

  const sql = "UPDATE employee SET name=?, email=?, phone=?, pincode=? WHERE employee_id=?";
  con.query(sql, [name, email, phone, pincode, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Update error: " + err.message });
    return res.json({ Status: true, Message: "Employee updated successfully" });
  });
});

// ✅ Delete Employee
router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM employee WHERE employee_id=?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Delete error: " + err.message });
    return res.json({ Status: true, Message: "Employee deleted successfully" });
  });
});

// ✅ Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: true });
});

export { router as EmployeeRouter };