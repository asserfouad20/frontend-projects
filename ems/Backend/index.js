// Backend/index.js
import dotenv from "dotenv";
dotenv.config();

// Verify JWT_KEY is loaded
if (!process.env.JWT_KEY) {
  console.error("❌ Missing JWT_KEY in environment variables");
  console.error("💡 Make sure .env file exists in Backend folder with JWT_KEY defined");
  process.exit(1);
}

console.log("✅ JWT_KEY loaded successfully");

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import departmentRoutes from "./routes/department.js";
import employeeRoutes from "./routes/employee.js";
import connectToDatabase from "./db/db.js";
import salaryRouter from "./routes/salary.js";
import dashboardRouter from "./routes/dashboard.js";
import leaveRouter from "./routes/leave.js";

connectToDatabase();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/salary", salaryRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/leave", leaveRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
