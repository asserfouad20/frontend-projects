// Backend/controllers/leaveController.js
import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";

// Get all leaves for logged-in employee
export const getEmployeeLeaves = async (req, res) => {
  try {
    // Find employee record
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee record not found" });
    }

    // Find all leave records for this employee
    const leaves = await Leave.find({ employee: employee._id })
      .sort({ appliedAt: -1 }); // most recent first

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("getEmployeeLeaves error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Apply for leave (employee creates leave request)
export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    // Validate input
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Find employee record
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee record not found" });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({
        success: false,
        error: "End date must be after start date",
      });
    }

    // Create leave request
    const leave = await Leave.create({
      employee: employee._id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Leave application submitted successfully",
      leave,
    });
  } catch (error) {
    console.error("applyLeave error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error applying for leave",
    });
  }
};

// Admin: Get all leaves
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({
        path: "employee",
        populate: {
          path: "userId",
          select: "name email",
        },
      })
      .sort({ appliedAt: -1 });

    return res.status(200).json({ success: true, leaves });
  } catch (error) {
    console.error("getAllLeaves error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Admin: Update leave status
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Must be 'Approved' or 'Rejected'",
      });
    }

    const leave = await Leave.findByIdAndUpdate(
      id,
      {
        status,
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ success: false, error: "Leave not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Leave ${status.toLowerCase()} successfully`,
      leave,
    });
  } catch (error) {
    console.error("updateLeaveStatus error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
