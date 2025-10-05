import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
// bcrypt import removed

const router = express.Router();

// ✅ Manager Login (Plaintext check)
router.post("/adminlogin", async (req, res) => {
  const sql = "SELECT * FROM manager WHERE email = ?";

  try {
    // 🛑 Use AWAIT with the promise-based query
    const [result] = await con.query(sql, [req.body.email]);

    if (result.length === 0) {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }

    const manager = result[0];

    // 🛑 PLAIN TEXT CHECK: Compare password directly
    if (req.body.password === manager.password) {
      const token = jwt.sign(
        { role: "manager", email: manager.email, id: manager.admin_id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, { httpOnly: true });
      return res.json({ loginStatus: true, id: manager.admin_id });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }

  } catch (err) {
    // This MUST now log the error to your terminal
    console.error("ADMIN LOGIN FATAL DB ERROR:", err); 
    return res.json({ loginStatus: false, Error: "Query error (DB Fatal)" });
  }
});

// ✅ Get All Managers
router.get("/admin_records", (req, res) => {
  const sql = "SELECT * FROM manager";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// ✅ Count Managers
router.get("/admin_count", (req, res) => {
  const sql = "SELECT COUNT(admin_id) as manager FROM manager";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

// ✅ Add Manager (Plaintext save)
router.post("/add_manager", (req, res) => {
  const { name, email, phone, password } = req.body;
  // 🛑 PLAIN TEXT SAVE: Saving password directly without hashing

  const sql = "INSERT INTO manager (name, email, phone, password) VALUES (?)";
  // Use plaintext password directly
  const values = [name, email, phone, password]; 

  con.query(sql, [values], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.json({ Status: false, Error: "Email already exists" });
      }
      return res.json({ Status: false, Error: "Query Error: " + err.message });
    }
    return res.json({ Status: true, Message: "Manager added successfully" });
  });
});

// ✅ Edit Manager
router.put("/edit_manager/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, phone } = req.body;

  const sql = "UPDATE manager SET name = ?, email = ?, phone = ? WHERE admin_id = ?";
  con.query(sql, [name, email, phone, id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Message: "Manager updated successfully" });
  });
});

// ✅ Delete Manager
router.delete("/delete_manager/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM manager WHERE admin_id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Message: "Manager deleted successfully" });
  });
});

// ✅ Get Single Manager (for Profile.jsx)
router.get("/manager/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT admin_id, name, email, phone FROM manager WHERE admin_id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error: " + err.message });
    if (result.length > 0) {
      return res.json({ Status: true, Result: result[0] });
    } else {
      return res.json({ Status: false, Error: "Manager not found" });
    }
  });
});

// ✅ Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

export { router as adminRouter };