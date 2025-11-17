// src/components/employees/AddSalary.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function AddSalary() {
  const { id } = useParams();
  const navigate = useNavigate();

  // For dropdowns
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Form fields
  const [form, setForm] = useState({
    department: "",
    employee: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    payDate: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // 1️⃣ Load departments
  useEffect(() => {
    axios
      .get("/api/department", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(({ data }) => {
        if (data.success) setDepartments(data.departments);
      })
      .catch((err) => console.error("Could not load departments", err));
  }, []);

  // 2️⃣ When department changes, fetch its employees
  const handleDepartment = async (e) => {
    const depId = e.target.value;
    // reset the form’s employee picker
    setForm((f) => ({ ...f, department: depId, employee: "" }));
    // clear the old list while loading
    setEmployees([]);

    try {
      // still hits your existing endpoint
      const { data } = await axios.get("/api/employee", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (data.success) {
        // only keep those whose populated .department._id matches
        const filtered = data.employees.filter(
          (emp) => emp.department && emp.department._id === depId
        );
        setEmployees(filtered);
      }
    } catch (err) {
      console.error("Could not load employees for dept", err);
    }
  };

  // 3️⃣ Handle any other form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // 4️⃣ Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.post("/api/salary/add", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        navigate("/admin-dashboard/employees");
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      console.error("Add salary error:", err);
      alert(err.response?.data?.error || "Server error");
    } finally {
      setSubmitting(false);
    }
  };
  const inputStyles = `
  mt-1 block w-full border border-gray-300 rounded-xl
  px-3 py-2
  focus:outline-none focus:ring-2 focus:ring-teal-600
  transition-shadow duration-200 ease-in-out
`;
  // 5️⃣ The actual return at component level:
  return (
    <div className="max-w-4xl mx-auto mt-20 bg-white p-8 rounded-3xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">Add Salary</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Department */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            name="department"
            value={form.department}
            onChange={handleDepartment}
            required
            className={inputStyles}
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.dep_name}
              </option>
            ))}
          </select>
        </div>

        {/* Employee */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee
          </label>
          <select
            name="employee"
            value={form.employee}
            onChange={handleChange}
            required
            className={inputStyles}
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.userId.name} ({emp.employeeId})
              </option>
            ))}
          </select>
        </div>

        {/* Basic Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Basic Salary
          </label>
          <input
            name="basicSalary"
            type="number"
            placeholder="Basic Salary"
            value={form.basicSalary}
            onChange={handleChange}
            required
            className={inputStyles}
          />
        </div>

        {/* Allowances */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Allowances
          </label>
          <input
            name="allowances"
            type="number"
            placeholder="Allowances"
            value={form.allowances}
            onChange={handleChange}
            required
            className={inputStyles}
          />
        </div>

        {/* Deductions */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Deductions
          </label>
          <input
            name="deductions"
            type="number"
            placeholder="Deductions"
            value={form.deductions}
            onChange={handleChange}
            required
            className={inputStyles}
          />
        </div>

        {/* Pay Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pay Date
          </label>
          <input
            name="payDate"
            type="date"
            value={form.payDate}
            onChange={handleChange}
            required
            className={inputStyles}
          />
        </div>

        {/* Submit & Back */}
        <div className="md:col-span-3 flex justify-center items-center space-x-6 mt-6">
          <Link
            to="/admin-dashboard/employees"
            className="text-teal-600 hover:underline transition-colors duration-200 ease-in-out"
          >
            ← Back to Employees
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="
      bg-teal-600 text-white py-3 px-8 rounded-xl
      hover:bg-teal-700 disabled:opacity-50
      transition-colors duration-200 ease-in-out
    "
          >
            {submitting ? "Saving…" : "Save Salary"}
          </button>
        </div>
      </form>
    </div>
  );
}
