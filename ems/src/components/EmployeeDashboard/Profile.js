import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

const Profile = () => {
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
        <span className="text-xl text-red-600">Unable to load profile</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 h-32"></div>

        <div className="px-8 pb-8">
          {/* Profile Picture */}
          <div className="flex items-end -mt-16 mb-6">
            <img
              src={
                employee.userId?.profileImage
                  ? `/uploads/${employee.userId.profileImage}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      employee.userId?.name || "User"
                    )}&background=0D8ABC&color=fff&size=200`
              }
              alt={employee.userId?.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="ml-6 pb-2">
              <h3 className="text-2xl font-bold">{employee.userId?.name}</h3>
              <p className="text-gray-600">{employee.designation || "Employee"}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-semibold">{employee.employeeId}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{employee.userId?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaBriefcase className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-semibold">{employee.department?.dep_name || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-semibold">{employee.gender || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-semibold">
                    {employee.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaUser className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Marital Status</p>
                  <p className="font-semibold">{employee.maritalStatus || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="mt-8 pt-6 border-t">
            <h4 className="text-xl font-bold mb-4">Employment Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-semibold text-lg">{employee.designation || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-semibold text-lg">${employee.salary?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-semibold text-lg">
                  {employee.createdAt
                    ? new Date(employee.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
