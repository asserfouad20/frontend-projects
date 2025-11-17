import Department from "../models/Department.js";
import mongoose from "mongoose";

// List all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    console.error("GetDepartments error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Get Department server error" });
  }
};

// Create a new department
export const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const newDepartment = new Department({ dep_name, description });
    await newDepartment.save();
    return res.status(200).json({ success: true, department: newDepartment });
  } catch (error) {
    console.error("AddDepartment error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Add Department server error" });
  }
};

// Fetch one department by ID
export const getDepartment = async (req, res) => {
  const { id } = req.params;

  // 1) Validate the format up front
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid department ID" });
  }

  try {
    const department = await Department.findById(id);
    if (!department) {
      return res
        .status(404)
        .json({ success: false, error: "Department not found" });
    }
    return res.status(200).json({ success: true, department });
  } catch (error) {
    console.error("GetDepartment error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

// Update an existing department
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    const updated = await Department.findByIdAndUpdate(
      id,
      { dep_name, description },
      { new: true }
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, error: "Department not found" });
    }
    return res.status(200).json({ success: true, department: updated });
  } catch (error) {
    console.error("UpdateDepartment error:", error);
    return res
      .status(500)
      .json({ success: false, error: "Edit Department server error" });
  }
};

// after your updateDepartment export
export const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  // 1) Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: "Invalid ID" });
  }

  try {
    const deleted = await Department.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    return res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("deleteDepartment error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
