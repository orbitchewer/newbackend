import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

// ✅ Manager Login
router.post("/adminlogin", (req, res) => {
  const sql = "SELECT * FROM manager WHERE email = ?";

  con.query(sql, [req.body.email], (err, result) => {
    if (err) {
      return res.json({ loginStatus: false, Error: "Query error" });
    }

    if (result.length === 0) {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }

    const manager = result[0];

    bcrypt.compare(req.body.password, manager.password, (err, isMatch) => {
      if (err) return res.json({ loginStatus: false, Error: "Compare error" });
      if (!isMatch) {
        return res.json({ loginStatus: false, Error: "Wrong email or password" });
      }

      const token = jwt.sign(
        { role: "manager", email: manager.email, id: manager.admin_id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, { httpOnly: true });
      return res.json({ loginStatus: true, id: manager.admin_id });
    });
  });
});

// ✅ Manager Signup
router.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ signupStatus: false, Error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO manager (name, email, phone, password) VALUES (?, ?, ?, ?)";

    con.query(sql, [name, email, phone, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.json({ signupStatus: false, Error: "Email already exists" });
        }
        return res.json({ signupStatus: false, Error: "Database error: " + err.message });
      }

      // Auto-login after signup
      const token = jwt.sign(
        { role: "manager", email: email, id: result.insertId },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, { httpOnly: true });
      return res.json({
        signupStatus: true,
        Message: "Signup successful",
        id: result.insertId,
      });
    });
  } catch (error) {
    return res.json({ signupStatus: false, Error: error.message });
  }
});

// ✅ Other existing routes (keep same)
router.get("/admin_records", (req, res) => {
  const sql = "SELECT * FROM manager";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.get("/admin_count", (req, res) => {
  const sql = "SELECT COUNT(admin_id) as manager FROM manager";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.put("/edit_manager/:id", (req, res) => {
  const id = req.params.id;
  const { name, email, phone } = req.body;

  const sql = "UPDATE manager SET name = ?, email = ?, phone = ? WHERE admin_id = ?";
  con.query(sql, [name, email, phone, id], (err) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Message: "Manager updated successfully" });
  });
});

router.delete("/delete_manager/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM manager WHERE admin_id = ?";
  con.query(sql, [id], (err) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Message: "Manager deleted successfully" });
  });
});

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

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

// Add this entire block to AdminRoute.js

router.post("/add_manager", async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      signupStatus: false,
      Error: "All fields are required",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO manager (name, email, phone, password) VALUES (?, ?, ?, ?)";

    con.query(sql, [name, email, phone, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.json({
            signupStatus: false,
            Error: "Email already exists",
          });
        }
        return res.json({
          signupStatus: false,
          Error: "Database error: " + err.message,
        });
      }

      return res.json({
        Status: true,
        Message: "Manager added successfully",
      });
    });
  } catch (error) {
    return res.json({ Status: false, Error: error.message });
  }
});

export { router as adminRouter };