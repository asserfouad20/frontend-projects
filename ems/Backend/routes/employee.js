import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  upload,
  addEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  fetchEmployeesByDepId,
  getEmployeeDetail,
  getEmployeeSalary,
  changePassword
} from "../controllers/employeeController.js";

const router = express.Router();

// Employee self-service routes (must come before :id routes)
router.get("/detail", protect, getEmployeeDetail);
router.get("/salary", protect, getEmployeeSalary);
router.put("/change-password", protect, changePassword);

// Admin routes
router.post("/add", protect, upload.single("profileImage"), addEmployee);
router.get("/", protect, getEmployees);
router.get("/department/:id", protect, fetchEmployeesByDepId);
router.get("/:id", protect, getEmployee);
router.put("/:id", protect, upload.single("profileImage"), updateEmployee);
router.delete("/:id", protect, deleteEmployee);

export default router;
