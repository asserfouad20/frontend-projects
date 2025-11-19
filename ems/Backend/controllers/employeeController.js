// controllers/employeeController.js
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import fs from "fs";
import Department from "../models/Department.js";
import { response } from "express";

// 1️⃣ Set up Multer storage & upload middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
export const upload = multer({ storage });

// 2️⃣ CREATE: addEmployee
export const addEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required",
      });
    }

    // create User (password will be hashed by User model's pre-save hook)
    const newUser = await new User({
      name,
      email,
      password,
      role,
      profileImage: req.file?.filename || "",
    }).save();

    // create Employee record
    await new Employee({
      userId: newUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    }).save();

    return res.status(201).json({ success: true, message: "Employee created" });
  } catch (err) {
    console.error("addEmployee error:", err);

    // Handle specific MongoDB duplicate key errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({
        success: false,
        error: `${field} already exists. Please use a different ${field}.`
      });
    }

    return res
      .status(500)
      .json({ success: false, error: err.message || "Server error in adding employee" });
  }
};

// 3️⃣ READ ALL: getEmployees
export const getEmployees = async (req, res) => {
  try {
    const list = await Employee.find()
      .populate("userId", "-password")
      .populate("department", "dep_name"); // <-- add this line

    return res.json({ success: true, employees: list });
  } catch (err) {
    console.error("getEmployees error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// 4️⃣ READ ONE: getEmployee
export const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const emp = await Employee.findById(id)
      .populate("userId", "name profileImage") // bring back name + profileImage
      .populate("department", "dep_name");
    if (!emp) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    return res.status(200).json({ success: true, employee: emp }); // <-- was "employees"
  } catch (err) {
    console.error("getEmployee error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// 6️⃣ DELETE: deleteEmployee
export const deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    return res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error("deleteEmployee error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, maritalStatus, designation, department, salary } =
      req.body;

    // Find both docs
    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: false, error: "Employee not found" });
    }
    const user = await User.findById(employee.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Perform updates and return the new docs
    const updatedUser = await User.findByIdAndUpdate(
      employee.userId,
      { name },
      { new: true }
    );
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { maritalStatus, designation, salary, department },
      { new: true }
    );

    // Error only if one of them failed
    if (!updatedUser || !updatedEmployee) {
      return res.status(500).json({ success: false, error: "Update failed" });
    }

    // Success!
    return res.status(200).json({
      success: true,
      employee: updatedEmployee,
      user: updatedUser,
    });
  } catch (error) {
    console.error("updateEmployee error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const fetchEmployeesByDepId = async (req, res) => {
  const { id } = req.params;
  try {
    const employees = await Employee.find({ department: id });

    return res.status(200).json({ success: true, employee: employees }); // <-- was "employees"
  } catch (err) {
    console.error("getEmployee error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get logged-in employee's own details
export const getEmployeeDetail = async (req, res) => {
  try {
    // req.user comes from the auth middleware (it's the User object)
    const employee = await Employee.findOne({ userId: req.user._id })
      .populate("userId", "name email profileImage")
      .populate("department", "dep_name");

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee record not found" });
    }

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    console.error("getEmployeeDetail error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get logged-in employee's salary history
export const getEmployeeSalary = async (req, res) => {
  try {
    const Salary = (await import("../models/Salary.js")).default;

    // Find employee record
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee record not found" });
    }

    // Find all salary records for this employee
    const salaries = await Salary.find({ employee: employee._id })
      .sort({ payDate: -1 }); // most recent first

    return res.status(200).json({ success: true, salaries });
  } catch (error) {
    console.error("getEmployeeSalary error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Change employee's password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters long",
      });
    }

    // Get the user with password (we need it to verify current password)
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

    // Update password (will be hashed by User model's pre-save hook)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error changing password",
    });
  }
};
