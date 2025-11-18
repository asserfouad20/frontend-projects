// Backend/routes/attendance.js

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  markAttendance,
  getAttendance,
  getMyAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendanceReport,
} from "../controllers/attendanceController.js";

const router = express.Router();

// Admin routes
router.post("/mark", protect, markAttendance);
router.get("/", protect, getAttendance);
router.get("/report", protect, getAttendanceReport);
router.put("/:id", protect, updateAttendance);
router.delete("/:id", protect, deleteAttendance);

// Employee route
router.get("/my-attendance", protect, getMyAttendance);

export default router;
