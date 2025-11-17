// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    // 1) Grab the token from Authorization header
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, error: "Token not provided" });
    }
    const token = authHeader.split(" ")[1];

    // 2) Verify & decode
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded || !decoded.userId) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid token payload" });
    }

    // 3) Fetch user from DB (minus password)
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // 4) Attach and proceed
    req.user = user;
    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
}
