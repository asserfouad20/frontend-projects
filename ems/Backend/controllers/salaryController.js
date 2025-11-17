// controllers/salaryController.js
import Salary from "../models/Salary.js";

export const addSalary = async (req, res) => {
  try {
    const { employee, basicSalary, allowances, deductions, payDate } = req.body;
    const totalSalary =
      parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);
    const newSalary = await Salary.create({
      employee,
      basicSalary,
      allowances,
      deductions,
      netSalary: totalSalary,
      payDate,
    });
    await newSalary.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("addSalary error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// controllers/salaryController.js
export const getSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const salary = await Salary.find({ employee: id })
      // pull in the employeeId (and user name if you like):
      .populate({
        path: "employee",
        select: "employeeId userId",
        populate: {
          path: "userId",
          select: "name",
        },
      });

    return res.status(200).json({ success: true, salary });
  } catch (err) {
    console.error("getSalary error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
