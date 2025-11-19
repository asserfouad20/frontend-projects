import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ← import useNavigate
import axios from "axios"; // ← import axios

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ← actually call it
    try {
      const response = await axios.post(
        "/api/department/add",
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      console.error(error);
      const msg = error?.response?.data?.error || "Something went wrong";
      alert(msg);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-40 bg-white p-8 rounded-2xl shadow-2xl w-96">
      <h2 className="text-center text-2xl font-bold mb-6">
        Add New Department
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Department Name */}
        <div className="mb-4">
          <label
            htmlFor="dep_name"
            className="block text-sm font-medium text-gray-700"
          >
            Department Name
          </label>
          <input
            id="dep_name"
            name="dep_name"
            type="text"
            placeholder="Enter Dept Name"
            value={department.dep_name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Description"
            value={department.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 ease-in-out"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          Add Department
        </button>

        {/* Back Link */}
        <Link
          to="/admin-dashboard/departments"
          className="inline-block mt-4 text-teal-600 hover:underline"
        >
          ← Back to Departments
        </Link>
      </form>
    </div>
  );
};

export default AddDepartment;
