import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getDepartments,
  addDepartment,
  getDepartment,
  updateDepartment,
  deleteDepartment, // ← pull in the correct function name
} from "../controllers/departmentController.js";

const router = express.Router();

// GET  /api/department           → list all
router.get("/", protect, getDepartments);

// POST /api/department/add       → create new
router.post("/add", protect, addDepartment);

// GET  /api/department/:id       → fetch one
router.get("/:id", protect, getDepartment);

// PUT  /api/department/:id       → update
router.put("/:id", protect, updateDepartment);

router.delete("/:id", protect, deleteDepartment);

export default router;
