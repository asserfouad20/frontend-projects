// Backend/routes/dashboard.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getSummary } from "../controllers/dashboardController.js";

const router = express.Router();

// Get dashboard summary statistics
router.get("/summary", protect, getSummary);

export default router;
