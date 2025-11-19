// src/components/employees/View.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const View = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await axios.get(
          `/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (data.success) {
          setEmployee(data.employee);
        } else {
          alert(data.error || "Failed to load employee");
        }
      } catch (err) {
        console.error("Error loading employee:", err);
        alert("Server error while loading employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-2xl font-bold">Loading…</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="pt-10 text-center text-red-600">Employee not found.</div>
    );
  }

  return (
    <div className="pt-5 px-6 space-y-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-teal-600 hover:underline"
      >
        <FaArrowLeft className="mr-2" />
        Back to Employees
      </button>

      {/* Details card */}
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Employee Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Image */}
          <div className="flex justify-center items-center">
            <img
              src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${employee.userId.profileImage}`}
              alt={employee.userId.name}
              className="h-64 w-52 rounded-full object-cover"
            />
          </div>

          {/* Details List */}
          <div className="space-y-4">
            <div className="flex space-x-3">
              <p className="text-lg font-bold">Name:</p>
              <p className="font-medium">{employee.userId.name}</p>
            </div>

            <div className="flex space-x-3">
              <p className="text-lg font-bold">Employee ID:</p>
              <p className="font-medium">{employee.employeeId}</p>
            </div>
            <div className="flex space-x-3">
              <p className="text-lg font-bold">Department:</p>
              <p className="font-medium">{employee.department.dep_name}</p>
            </div>
            <div className="flex space-x-3">
              <p className="text-lg font-bold">Designation:</p>
              <p className="font-medium">{employee.designation}</p>
            </div>
            <div className="flex space-x-3">
              <p className="text-lg font-bold">Salary In USD:</p>
              <p className="font-medium">${employee.salary.toLocaleString()}</p>
            </div>
            <div className="flex space-x-3">
              <p className="text-lg font-bold">Date Of Birth:</p>
              <p className="font-medium">
                {new Date(employee.dob).toLocaleDateString()}
              </p>
            </div>

            <div className="flex space-x-3">
              <p className="text-lg font-bold">Gender:</p>
              <p className="font-medium">{employee.gender}</p>
            </div>

            <div className="flex space-x-3">
              <p className="text-lg font-bold">Marital Status:</p>
              <p className="font-medium">{employee.maritalStatus}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
