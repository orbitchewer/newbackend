import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
import { CourierRouter } from "./Routes/CourierRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from 'dotenv'; // Import dotenv
dotenv.config(); // Load variables from your .env file

const app = express();

// ✅ Environment check
const isDev = process.env.NODE_ENV !== "production";

app.use(
  cors({
    origin: ["https://hearty-miracle-production.up.railway.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Use routes
app.use("/auth", adminRouter);
app.use("/employee", EmployeeRouter);
app.use("/courier", CourierRouter);

// ✅ JWT verification middleware
const verifyUser = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.json({ Status: false, Error: "Not authenticated" });
  }

  // Use JWT_SECRET from the .env file
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.json({ Status: false, Error: "Invalid token" });
    }

    req.id = decoded.id;
    req.role = decoded.role;
    next();
  });
};

// ✅ Verify route
app.get("/verify", verifyUser, (req, res) => {
  if (req.role === "manager") {
    return res.json({ Status: true, role: "manager", id: req.id });
  } else if (req.role === "employee") {
    return res.json({ Status: true, role: "employee", id: req.id });
  } else {
    return res.json({ Status: false, Error: "Invalid role" });
  }
});

// ✅ Static file serving (only if in production)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "../EmployeeMS/dist");

if (!isDev && fs.existsSync(distPath)) {
  console.log("Serving static files from:", distPath);
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.log("Development mode: skipping static file serving");
}

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${isDev ? "development" : "production"})`);
});