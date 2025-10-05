import db from "../utils/db.js";

// Manager creates courier & auto-assigns
export const createCourier = async (req, res) => {
  try {
    const { tracking_number, description, pincode, manager_id } = req.body;
    if (!tracking_number || !pincode || !manager_id)
      return res.status(400).json({ message: "Missing required fields" });

    // 1️⃣ Insert courier
    const [insert] = await db.execute(
      "INSERT INTO couriers (tracking_number, description, pincode, manager_id) VALUES (?, ?, ?, ?)",
      [tracking_number, description, pincode, manager_id]
    );
    const courier_id = insert.insertId;

    // 2️⃣ Find employee with same pincode
    const [empRows] = await db.execute(
      "SELECT employee_id FROM employee WHERE pincode = ? LIMIT 1",
      [pincode]
    );

    if (empRows.length > 0) {
      const employee_id = empRows[0].employee_id;
      await db.execute(
        "UPDATE couriers SET employee_id = ? WHERE courier_id = ?",
        [employee_id, courier_id]
      );
      await db.execute(
        "INSERT INTO courier_history (courier_id, employee_id) VALUES (?, ?)",
        [courier_id, employee_id]
      );
    }

    res.json({ message: "Courier created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Manager: get couriers (pending)
export const getManagerCouriers = async (req, res) => {
  try {
    const { manager_id } = req.params;
    const [rows] = await db.execute(
      `SELECT c.*, e.name AS employee_name
       FROM couriers c
       LEFT JOIN employee e ON c.employee_id = e.employee_id
       WHERE c.manager_id = ? AND c.status = 'pending'
       ORDER BY c.created_at DESC`,
      [manager_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Employee: get assigned couriers
export const getEmployeeCouriers = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const [rows] = await db.execute(
      "SELECT * FROM couriers WHERE employee_id = ? AND status = 'pending' ORDER BY created_at DESC",
      [employee_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Employee: mark delivered
export const markDelivered = async (req, res) => {
  try {
    const { courier_id } = req.params;
    await db.execute(
      "UPDATE couriers SET status='delivered', delivered_at=NOW() WHERE courier_id=?",
      [courier_id]
    );
    await db.execute(
      "UPDATE courier_history SET delivered_at=NOW() WHERE courier_id=? AND delivered_at IS NULL",
      [courier_id]
    );
    res.json({ message: "Courier marked delivered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Manager: report filter
export const getReport = async (req, res) => {
  try {
    const { pincode, from, to } = req.query;
    const [rows] = await db.execute(
      `SELECT * FROM couriers
       WHERE pincode=? AND status='delivered'
       AND delivered_at BETWEEN ? AND ?`,
      [pincode, from, to]
    );
    res.json({ count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
