// Backend/controllers/dashboardController.js
import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";

export const getSummary = async (req, res) => {
  try {
    // 1. Count total employees
    const totalEmployees = await Employee.countDocuments();

    // 2. Count total departments
    const totalDepartments = await Department.countDocuments();

    // 3. Calculate total monthly salary (sum of all employee salaries)
    const salaryAggregation = await Employee.aggregate([
      {
        $group: {
          _id: null,
          totalSalary: { $sum: "$salary" },
        },
      },
    ]);
    const monthlySalary = salaryAggregation.length > 0 ? salaryAggregation[0].totalSalary : 0;

    // 4. Count leaves by status
    const leaveStats = await Leave.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Transform leave stats into an object for easier access
    const leaves = {
      applied: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
    };

    leaveStats.forEach((stat) => {
      if (stat._id === "Approved") leaves.approved = stat.count;
      else if (stat._id === "Pending") leaves.pending = stat.count;
      else if (stat._id === "Rejected") leaves.rejected = stat.count;
    });

    // Total applied = all leaves regardless of status
    leaves.applied = await Leave.countDocuments();

    return res.status(200).json({
      success: true,
      totalEmployees,
      totalDepartments,
      monthlySalary,
      leaves,
    });
  } catch (error) {
    console.error("getSummary error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error fetching dashboard summary",
    });
  }
};
