// Backend/routes/leave.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getEmployeeLeaves,
  applyLeave,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";

const router = express.Router();

// Employee routes
router.get("/employee", protect, getEmployeeLeaves);
router.post("/apply", protect, applyLeave);

// Admin routes
router.get("/", protect, getAllLeaves);
router.put("/:id", protect, updateLeaveStatus);

export default router;
