import express from "express";
import con from "../utils/db.js";

const router = express.Router();

/**
 * ✅ Add new courier (with optional employee assignment)
 */
// In Server/Routes/CourierRoute.js

router.post("/add", (req, res) => {
  const { tracking_number, description, pincode, manager_id, employee_id } = req.body;

  const getEmployeeSql = "SELECT employee_id FROM employee WHERE pincode = ? LIMIT 1";

  const assignCourier = (empId = null) => {
    const insertSql = `
      INSERT INTO couriers (tracking_number, description, pincode, employee_id, manager_id, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'pending', NOW())
    `;
    con.query(insertSql, [tracking_number, description, pincode, empId, manager_id], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Insert error: " + err.message });

      const courierId = result.insertId;
      
      // ✅ New code: After inserting, fetch the full courier details
      const getNewCourierSql = `
        SELECT c.*, e.name AS employee_name
        FROM couriers c
        LEFT JOIN employee e ON c.employee_id = e.employee_id
        WHERE c.courier_id = ?
      `;

      con.query(getNewCourierSql, [courierId], (fetchErr, newCourierResult) => {
        if (fetchErr) {
          return res.json({ Status: false, Error: "Failed to fetch newly created courier." });
        }

        const newCourier = newCourierResult[0];

        if (empId) {
          const historySql = `
            INSERT INTO courier_history (courier_id, employee_id, assigned_at)
            VALUES (?, ?, NOW())
          `;
          con.query(historySql, [courierId, empId], (historyErr) => {
            if (historyErr) return res.json({ Status: false, Error: "History insert error: " + historyErr.message });
            
            // ✅ Return the new courier object
            return res.json({ Status: true, Result: newCourier, Message: "Courier added and assigned" });
          });
        } else {
          // ✅ Return the new courier object
          return res.json({ Status: true, Result: newCourier, Message: "Courier added (unassigned)" });
        }
      });
    });
  };

  if (employee_id) {
    assignCourier(employee_id);
  } else {
    con.query(getEmployeeSql, [pincode], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query error: " + err.message });
      const empId = result.length > 0 ? result[0].employee_id : null;
      assignCourier(empId);
    });
  }
});

/**
 * ✅ Get all couriers for a manager
 */
router.get("/manager/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT c.courier_id, c.tracking_number, c.description, c.pincode, c.status, c.created_at, c.delivered_at,
           e.name AS employee_name
    FROM couriers c
    LEFT JOIN employee e ON c.employee_id = e.employee_id
    WHERE c.manager_id = ?
    ORDER BY c.created_at DESC
  `;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error: " + err.message });
    return res.json({ Status: true, Result: result });
  });
});

/**
 * ✅ Get all couriers assigned to an employee
 */
router.get("/employee/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT c.*, m.name AS manager_name
    FROM couriers c
    LEFT JOIN manager m ON c.manager_id = m.admin_id
    WHERE c.employee_id = ?
    ORDER BY c.created_at DESC
  `;
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error: " + err.message });
    return res.json({ Status: true, Result: result });
  });
});

/**
 * ✅ Mark courier as delivered
 */
router.put("/deliver/:id", (req, res) => {
  const id = req.params.id;
  const sql = `
    UPDATE couriers 
    SET status = 'delivered', delivered_at = NOW() 
    WHERE courier_id = ?
  `;
  con.query(sql, [id], (err) => {
    if (err) return res.json({ Status: false, Error: "Update error: " + err.message });

    const historySql = `
      UPDATE courier_history
      SET delivered_at = NOW()
      WHERE courier_id = ?
    `;
    con.query(historySql, [id], (err2) => {
      if (err2) return res.json({ Status: false, Error: "History update error: " + err2.message });
      return res.json({ Status: true, Message: "Courier marked as delivered successfully" });
    });
  });
});

/**
 * ✅ Report — count delivered by pincode and date range
 */
router.post("/report", (req, res) => {
  const { pincode, from, to } = req.body;
  const sql = `
    SELECT COUNT(*) AS count
    FROM couriers
    WHERE pincode = ? AND status = 'delivered'
      AND delivered_at BETWEEN ? AND ?
  `;
  con.query(sql, [pincode, from, to], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error: " + err.message });
    return res.json({ Status: true, Result: result[0] });
  });
});

/**
 * ✅ Count all couriers (dashboard)
 */
router.get("/count", (req, res) => {
  const sql = "SELECT COUNT(*) AS couriers FROM couriers";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error: " + err.message });
    return res.json({ Status: true, Result: result });
  });
});

/**
 * ✅ Courier history (for reports)
 */
router.get("/history", (req, res) => {
  const { from, to, pincode } = req.query;
  let sql = `
    SELECT h.id, h.assigned_at, h.delivered_at,
           c.courier_id, c.tracking_number, c.description, c.pincode,
           e.name AS employee_name
    FROM courier_history h
    JOIN couriers c ON h.courier_id = c.courier_id
    JOIN employee e ON h.employee_id = e.employee_id
    WHERE 1=1
  `;
  const params = [];

  if (pincode) {
    sql += " AND c.pincode = ?";
    params.push(pincode);
  }

  if (from && to) {
    sql += " AND DATE(h.assigned_at) BETWEEN ? AND ?";
    params.push(from, to);
  }

  sql += " ORDER BY h.assigned_at DESC";

  con.query(sql, params, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query error: " + err.message });
    return res.json({ Status: true, Result: result });
  });
});

export { router as CourierRouter };
