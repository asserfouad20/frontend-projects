import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addSalary, getSalary } from "../controllers/salaryController.js";

const router = express.Router();

router.post("/add", protect, addSalary);
router.get("/:id", protect, getSalary);

export default router;
