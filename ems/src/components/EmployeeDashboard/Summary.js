import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaMoneyBillWave, FaBuilding, FaCalendarAlt } from "react-icons/fa";

const Summary = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const { data } = await axios.get("/api/employee/detail", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success) {
          setEmployee(data.employee);
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-3xl font-bold text-black">Loading...</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-xl text-red-600">Unable to load employee data</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <FaUser className="text-blue-600 text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Employee ID</p>
            <p className="text-2xl font-bold">{employee.employeeId}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <div className="bg-green-100 p-4 rounded-full">
            <FaMoneyBillWave className="text-green-600 text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Salary</p>
            <p className="text-2xl font-bold">${employee.salary?.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <div className="bg-purple-100 p-4 rounded-full">
            <FaBuilding className="text-purple-600 text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Department</p>
            <p className="text-xl font-bold">{employee.department?.dep_name || "N/A"}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4">
          <div className="bg-orange-100 p-4 rounded-full">
            <FaCalendarAlt className="text-orange-600 text-2xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Designation</p>
            <p className="text-xl font-bold">{employee.designation || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Full Name</p>
            <p className="text-lg font-semibold">{employee.userId?.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="text-lg font-semibold">{employee.userId?.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Date of Birth</p>
            <p className="text-lg font-semibold">
              {employee.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Gender</p>
            <p className="text-lg font-semibold">{employee.gender || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Marital Status</p>
            <p className="text-lg font-semibold">{employee.maritalStatus || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
