import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaLock,
  FaBuilding,
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationCircle,
  FaEdit,
} from "react-icons/fa";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("password");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Company Info State
  const [companyData, setCompanyData] = useState({
    companyName: "TechVision Solutions Inc.",
    address: "1234 Innovation Drive, Suite 500\nSan Francisco, CA 94105\nUnited States",
    phone: "+1 (415) 555-0123",
    email: "info@techvisionsolutions.com",
    website: "https://www.techvisionsolutions.com",
  });
  const [companyLoading, setCompanyLoading] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companySaved, setCompanySaved] = useState(true);

  // Leave Types State
  const [leaveTypes, setLeaveTypes] = useState([
    { type: "Sick Leave", maxDays: 10, enabled: true },
    { type: "Casual Leave", maxDays: 12, enabled: true },
    { type: "Annual Leave", maxDays: 20, enabled: true },
    { type: "Maternity Leave", maxDays: 90, enabled: true },
    { type: "Paternity Leave", maxDays: 15, enabled: true },
  ]);
  const [isEditingLeaveTypes, setIsEditingLeaveTypes] = useState(false);
  const [leaveTypesSaved, setLeaveTypesSaved] = useState(true);

  useEffect(() => {
    if (toast.show) {
      const id = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3000);
      return () => clearTimeout(id);
    }
  }, [toast.show]);

  // Password Change Handlers
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setToast({
        show: true,
        message: "New password and confirm password do not match",
        type: "error",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setToast({
        show: true,
        message: "New password must be at least 6 characters long",
        type: "error",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/api/auth/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setToast({
          show: true,
          message: "Password changed successfully!",
          type: "success",
        });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setToast({
        show: true,
        message: error.response?.data?.error || "Failed to change password",
        type: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Company Info Handlers
  const handleCompanyChange = (e) => {
    setCompanyData({
      ...companyData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setCompanyLoading(true);

    try {
      // Simulate saving company info (you can create a backend endpoint for this)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setToast({
        show: true,
        message: "Company information saved successfully!",
        type: "success",
      });
      setIsEditingCompany(false);
      setCompanySaved(true);
    } catch (error) {
      setToast({
        show: true,
        message: "Failed to save company information",
        type: "error",
      });
    } finally {
      setCompanyLoading(false);
    }
  };

  // Leave Types Handlers
  const handleLeaveTypeChange = (index, field, value) => {
    const updatedLeaveTypes = [...leaveTypes];
    updatedLeaveTypes[index][field] = value;
    setLeaveTypes(updatedLeaveTypes);
  };

  const handleLeaveTypesSubmit = async (e) => {
    e.preventDefault();

    try {
      // Simulate saving leave types (you can create a backend endpoint for this)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setToast({
        show: true,
        message: "Leave types configuration saved successfully!",
        type: "success",
      });
      setIsEditingLeaveTypes(false);
      setLeaveTypesSaved(true);
    } catch (error) {
      setToast({
        show: true,
        message: "Failed to save leave types configuration",
        type: "error",
      });
    }
  };

  return (
    <div className="p-6 relative">
      {/* Toast */}
      {toast.show && (
        <div
          className={`
            fixed top-0 left-0 sm:top-4 sm:left-4 lg:top-6 lg:left-6 z-50
            transform transition-transform transition-opacity duration-300 ease-out
            ${
              toast.show
                ? "translate-x-0 translate-y-0 opacity-100"
                : "-translate-x-full -translate-y-full opacity-0"
            }
            ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}
            text-white px-4 py-2 rounded
            text-sm sm:text-base
          `}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
            activeTab === "password"
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-gray-600 hover:text-teal-600"
          }`}
        >
          <FaLock />
          Change Password
        </button>
        <button
          onClick={() => setActiveTab("company")}
          className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
            activeTab === "company"
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-gray-600 hover:text-teal-600"
          }`}
        >
          <FaBuilding />
          Company Info
        </button>
        <button
          onClick={() => setActiveTab("leave")}
          className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
            activeTab === "leave"
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-gray-600 hover:text-teal-600"
          }`}
        >
          <FaCalendarAlt />
          Leave Types
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Password Change Tab */}
        {activeTab === "password" && (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Change Admin Password
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className={`w-full bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                    passwordLoading
                      ? "opacity-50 cursor-not-allowed transform-none"
                      : ""
                  }`}
                >
                  {passwordLoading ? "Changing Password..." : "Change Password"}
                </button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Password Requirements:
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Minimum 6 characters long</li>
                <li>• Use a unique password you haven't used before</li>
                <li>• Don't share your password with anyone</li>
              </ul>
            </div>
          </div>
        )}

        {/* Company Info Tab */}
        {activeTab === "company" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Company Information
              </h3>
              {!isEditingCompany && companySaved && (
                <button
                  onClick={() => setIsEditingCompany(true)}
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <FaEdit />
                  Edit
                </button>
              )}
            </div>

            {!isEditingCompany && companySaved ? (
              // View Mode
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <p className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                    {companyData.companyName}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <p className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 whitespace-pre-line">
                    {companyData.address}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <p className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                    {companyData.phone}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <p className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                    {companyData.email}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <p className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                    {companyData.website || "Not specified"}
                  </p>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleCompanySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={companyData.companyName}
                  onChange={handleCompanyChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
                  placeholder="Enter company name"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={companyData.address}
                  onChange={handleCompanyChange}
                  required
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
                  placeholder="Enter company address"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={companyData.phone}
                  onChange={handleCompanyChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={companyData.email}
                  onChange={handleCompanyChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
                  placeholder="Enter email address"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={companyData.website}
                  onChange={handleCompanyChange}
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
                  placeholder="https://example.com"
                />
              </div>

              <div className="md:col-span-2 pt-4 flex gap-4">
                <button
                  type="submit"
                  disabled={companyLoading}
                  className={`flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                    companyLoading
                      ? "opacity-50 cursor-not-allowed transform-none"
                      : ""
                  }`}
                >
                  {companyLoading ? "Saving..." : "Save Company Information"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingCompany(false)}
                  className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
            )}
          </div>
        )}

        {/* Leave Types Tab */}
        {activeTab === "leave" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Configure Leave Types
              </h3>
              {!isEditingLeaveTypes && leaveTypesSaved && (
                <button
                  onClick={() => setIsEditingLeaveTypes(true)}
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  <FaEdit />
                  Edit
                </button>
              )}
            </div>

            {!isEditingLeaveTypes && leaveTypesSaved ? (
              // View Mode
              <div className="space-y-4">
                {leaveTypes.map((leave, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg ${
                      leave.enabled
                        ? "border-teal-200 bg-teal-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          leave.enabled ? "bg-teal-600" : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          {leave.type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {leave.enabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-teal-600">
                        {leave.maxDays}
                      </p>
                      <p className="text-sm text-gray-600">days/year</p>
                    </div>
                  </div>
                ))}

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">
                    Note:
                  </h4>
                  <p className="text-sm text-blue-700">
                    Disabled leave types will not appear in the employee leave application
                    form. Maximum days per year defines the limit for each leave type.
                  </p>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleLeaveTypesSubmit} className="space-y-4">
              <div className="space-y-4">
                {leaveTypes.map((leave, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-teal-500 transition-colors"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={leave.enabled}
                        onChange={(e) =>
                          handleLeaveTypeChange(index, "enabled", e.target.checked)
                        }
                        className="w-5 h-5 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">
                        Leave Type
                      </label>
                      <input
                        type="text"
                        value={leave.type}
                        onChange={(e) =>
                          handleLeaveTypeChange(index, "type", e.target.value)
                        }
                        disabled={!leave.enabled}
                        className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:hover:border-gray-300"
                      />
                    </div>

                    <div className="w-40">
                      <label className="block text-sm font-medium text-gray-700">
                        Max Days/Year
                      </label>
                      <input
                        type="number"
                        value={leave.maxDays}
                        onChange={(e) =>
                          handleLeaveTypeChange(
                            index,
                            "maxDays",
                            parseInt(e.target.value) || 0
                          )
                        }
                        disabled={!leave.enabled}
                        min="1"
                        className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:hover:border-gray-300"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  Save Leave Configuration
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingLeaveTypes(false)}
                  className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">
                  Note:
                </h4>
                <p className="text-sm text-blue-700">
                  Disabled leave types will not appear in the employee leave application
                  form. Maximum days per year defines the limit for each leave type.
                </p>
              </div>
            </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
