import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [employee, setEmployee] = useState({
    name: "",
    maritalStatus: "",
    designation: "",
    salary: 0,
    department: "",
  });

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const { data } = await axios.get("/api/department", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success) setDepartments(data.departments);
      } catch (err) {
        console.error("Could not load departments", err);
      }
    };
    getDepartments();
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (data.success) {
          const employee = data.employee;
          setEmployee((prev) => ({
            ...prev,
            name: employee.userId.name,
            maritalStatus: employee.maritalStatus,
            designation: employee.designation,
            salary: employee.salary,
            department: employee.department,
          }));
        } else {
          alert(data.error || "Failed to load employee");
        }
      } catch (err) {
        console.error("Error loading employee:", err);
        alert("Server error while loading employee");
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "department") {
      const fullDep = departments.find((d) => d._id === value) || null;
      setEmployee((prev) => ({ ...prev, department: fullDep }));
    } else if (name === "role") {
      // update inside userId
      setEmployee((prev) => ({
        ...prev,
        userId: {
          ...prev.userId,
          role: value,
        },
      }));
    } else {
      setEmployee((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.put(`/api/employee/${id}`, employee, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        navigate("/admin-dashboard/employees");
      } else {
        alert(res.data.error);
      }
    } catch (err) {
      console.error("Update employee error:", err);
      alert(err.response?.data?.error || "Server error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 bg-white p-8 rounded-3xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">Edit Employee</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            name="name"
            type="text"
            placeholder="Enter Name"
            value={employee.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-shadow duration-200"
          />
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Marital Status
          </label>
          <select
            name="maritalStatus"
            value={employee.maritalStatus}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-shadow duration-200"
          >
            <option value="">Select Status</option>
            <option>Single</option>
            <option>Married</option>
          </select>
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Designation
          </label>
          <input
            required
            name="designation"
            type="text"
            placeholder="Designation"
            value={employee.designation}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-shadow duration-200"
          />
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Salary
          </label>
          <input
            required
            name="salary"
            type="number"
            placeholder="Salary In USD"
            value={employee.salary}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-shadow duration-200"
          />
        </div>
        {/* Department */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            required
            name="department"
            value={employee.department?._id || ""}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-shadow duration-200"
          >
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.dep_name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit & Back */}
        <div className="md:col-span-3 flex justify-center items-center space-x-6 mt-6">
          <Link
            to="/admin-dashboard/employees"
            className="text-teal-600 hover:underline"
          >
            ← Back to Employees
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-teal-600 text-white py-3 px-8 rounded-xl hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50"
          >
            {submitting ? "Updating…" : "Update Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
