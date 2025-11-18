// Backend/controllers/attendanceController.js

import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

/**
 * @desc    Mark attendance for employees (admin only)
 * @route   POST /api/attendance/mark
 * @access  Protected (Admin)
 */
export const markAttendance = async (req, res) => {
  const { employeeId, date, status, timeIn, timeOut, remarks } = req.body;

  if (!employeeId || !date || !status) {
    return res.status(400).json({
      success: false,
      error: "Employee ID, date, and status are required",
    });
  }

  try {
    // Verify employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee not found",
      });
    }

    // Calculate working hours if both timeIn and timeOut are provided
    let workingHours = null;
    if (timeIn && timeOut) {
      const [inHour, inMin] = timeIn.split(":").map(Number);
      const [outHour, outMin] = timeOut.split(":").map(Number);
      workingHours = outHour + outMin / 60 - (inHour + inMin / 60);
    }

    // Check if attendance already exists for this employee on this date
    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: new Date(date),
    });

    if (existingAttendance) {
      // Update existing attendance
      existingAttendance.status = status;
      existingAttendance.timeIn = timeIn || existingAttendance.timeIn;
      existingAttendance.timeOut = timeOut || existingAttendance.timeOut;
      existingAttendance.workingHours = workingHours || existingAttendance.workingHours;
      existingAttendance.remarks = remarks || existingAttendance.remarks;
      existingAttendance.markedBy = req.user._id;
      existingAttendance.updatedAt = Date.now();

      await existingAttendance.save();

      return res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
        attendance: existingAttendance,
      });
    }

    // Create new attendance record
    const attendance = await Attendance.create({
      employee: employeeId,
      date: new Date(date),
      status,
      timeIn,
      timeOut,
      workingHours,
      remarks,
      markedBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error("Mark attendance error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while marking attendance",
    });
  }
};

/**
 * @desc    Get attendance records with filters
 * @route   GET /api/attendance
 * @access  Protected (Admin)
 */
export const getAttendance = async (req, res) => {
  const { employeeId, startDate, endDate, status } = req.query;

  try {
    // Build query
    let query = {};

    if (employeeId) {
      query.employee = employeeId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    if (status) {
      query.status = status;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate({
        path: "employee",
        populate: {
          path: "userId",
          select: "name email",
        },
        select: "employeeId department",
      })
      .populate("markedBy", "name")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      attendance: attendanceRecords,
    });
  } catch (error) {
    console.error("Get attendance error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching attendance",
    });
  }
};

/**
 * @desc    Get attendance for a specific employee (employee can view their own)
 * @route   GET /api/attendance/my-attendance
 * @access  Protected (Employee)
 */
export const getMyAttendance = async (req, res) => {
  try {
    // Find employee by userId
    const employee = await Employee.findOne({ userId: req.user._id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: "Employee record not found",
      });
    }

    const { startDate, endDate } = req.query;

    let query = { employee: employee._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    const attendanceRecords = await Attendance.find(query)
      .populate("markedBy", "name")
      .sort({ date: -1 });

    return res.status(200).json({
      success: true,
      attendance: attendanceRecords,
    });
  } catch (error) {
    console.error("Get my attendance error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching attendance",
    });
  }
};

/**
 * @desc    Update attendance record
 * @route   PUT /api/attendance/:id
 * @access  Protected (Admin)
 */
export const updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { status, timeIn, timeOut, remarks } = req.body;

  try {
    const attendance = await Attendance.findById(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: "Attendance record not found",
      });
    }

    // Update fields
    if (status) attendance.status = status;
    if (timeIn) attendance.timeIn = timeIn;
    if (timeOut) attendance.timeOut = timeOut;
    if (remarks !== undefined) attendance.remarks = remarks;

    // Recalculate working hours if both times are present
    if (attendance.timeIn && attendance.timeOut) {
      const [inHour, inMin] = attendance.timeIn.split(":").map(Number);
      const [outHour, outMin] = attendance.timeOut.split(":").map(Number);
      attendance.workingHours = outHour + outMin / 60 - (inHour + inMin / 60);
    }

    attendance.markedBy = req.user._id;
    attendance.updatedAt = Date.now();

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    console.error("Update attendance error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while updating attendance",
    });
  }
};

/**
 * @desc    Delete attendance record
 * @route   DELETE /api/attendance/:id
 * @access  Protected (Admin)
 */
export const deleteAttendance = async (req, res) => {
  const { id } = req.params;

  try {
    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: "Attendance record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    console.error("Delete attendance error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while deleting attendance",
    });
  }
};

/**
 * @desc    Get attendance summary/report
 * @route   GET /api/attendance/report
 * @access  Protected (Admin)
 */
export const getAttendanceReport = async (req, res) => {
  const { employeeId, month, year } = req.query;

  try {
    let query = {};

    if (employeeId) {
      query.employee = employeeId;
    }

    // Filter by month and year
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendanceRecords = await Attendance.find(query).populate({
      path: "employee",
      populate: [
        {
          path: "userId",
          select: "name email",
        },
        {
          path: "department",
          select: "dep_name",
        },
      ],
    });

    // Calculate summary statistics
    const summary = {
      totalDays: attendanceRecords.length,
      present: attendanceRecords.filter((a) => a.status === "Present").length,
      absent: attendanceRecords.filter((a) => a.status === "Absent").length,
      late: attendanceRecords.filter((a) => a.status === "Late").length,
      halfDay: attendanceRecords.filter((a) => a.status === "Half-Day").length,
      wfh: attendanceRecords.filter((a) => a.status === "Work from Home").length,
      onLeave: attendanceRecords.filter((a) => a.status === "On Leave").length,
      totalWorkingHours: attendanceRecords.reduce((sum, a) => sum + (a.workingHours || 0), 0),
    };

    return res.status(200).json({
      success: true,
      summary,
      records: attendanceRecords,
    });
  } catch (error) {
    console.error("Get attendance report error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while generating report",
    });
  }
};
