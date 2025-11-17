// Backend/routes/auth.js

import express from "express";
import { login, verifyUser, register, changePassword } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register); // ← new
router.post("/login", login);
router.get("/me", protect, verifyUser);
router.put("/change-password", protect, changePassword);

export default router;
