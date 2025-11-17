// src/components/departments/EditDepartment.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOne = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (data.success) {
          setDepartment({
            dep_name: data.department.dep_name,
            description: data.department.description || "",
          });
        } else {
          alert(data.error);
        }
      } catch (err) {
        console.error(err);
        alert("Error loading department");
      } finally {
        setLoading(false);
      }
    };

    fetchOne();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/department/${id}`,
        department,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (data.success) {
        navigate("/admin-dashboard/departments");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) {
    return <div className="pt-5 text-center">Loading…</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-32 p-6 bg-white rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Department</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="dep_name" className="block font-medium mb-1">
            Department Name
          </label>
          <input
            id="dep_name"
            name="dep_name"
            type="text"
            value={department.dep_name}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-200 ease-in-out"
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={department.description}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-200 ease-in-out"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-600 text-white py-2 rounded-xl hover:bg-teal-700 transition-all duration-200 ease-in-out"
        >
          Update
        </button>
        <Link
          to="/admin-dashboard/departments"
          className="block mt-4 text-start text-teal-600 hover:underline transition-all duration-200 ease-in-out"
        >
          ← Back to Departments
        </Link>
      </form>
    </div>
  );
};

export default EditDepartment;
