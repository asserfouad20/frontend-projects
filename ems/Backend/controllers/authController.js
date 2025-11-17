// backend/controllers/authController.js

import User from "../models/User.js";
import Employee from "../models/Employee.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * @desc    Authenticate user & get token (with Email OR Employee ID)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validate request
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Email/Employee ID and password are required" });
  }

  try {
    console.log("Attempt login for:", email);

    let user = null;

    // First, try to find user by email
    user = await User.findOne({ email });

    // If not found, try to find by Employee ID
    if (!user) {
      const employee = await Employee.findOne({ employeeId: email }).populate("userId");
      if (employee && employee.userId) {
        user = employee.userId;
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    console.log("DB hash is:", user.password);

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("bcrypt.compare result:", isMatch);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Generate JWT
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "10d" });

    // Respond with token and user info
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * @desc    Verify user from token
 * @route   GET /api/auth/verify
 * @access  Protected
 */
export const verifyUser = (req, res) => {
  // req.user should be attached by auth middleware
  if (!req.user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  return res.status(200).json({ success: true, user: req.user });
};
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Name, email & password are required" });
  }
  try {
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    // Create user
    const user = await User.create({ name, email, password: hashed, role });
    res
      .status(201)
      .json({ success: true, user: { id: user._id, name, email, role } });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Change user password (for both admin and employee)
 * @route   PUT /api/auth/change-password
 * @access  Protected
 */
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: "Current password and new password are required",
    });
  }

  try {
    // Get user from database
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while changing password",
    });
  }
};
