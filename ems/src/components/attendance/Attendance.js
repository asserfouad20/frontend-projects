// src/components/attendance/Attendance.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
    timeIn: "",
    timeOut: "",
    remarks: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  useEffect(() => {
    const filtered = attendanceRecords.filter((record) => {
      const employeeName = record.employee?.userId?.name?.toLowerCase() || "";
      const employeeId = record.employee?.employeeId?.toLowerCase() || "";
      const status = record.status?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return (
        employeeName.includes(search) ||
        employeeId.includes(search) ||
        status.includes(search)
      );
    });
    setFilteredRecords(filtered);
  }, [searchTerm, attendanceRecords]);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setAttendanceRecords(response.data.attendance);
        setFilteredRecords(response.data.attendance);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setToast({
        show: true,
        message: "Failed to fetch attendance records",
        type: "error",
      });
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/employee", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/attendance/mark",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setToast({
          show: true,
          message: response.data.message,
          type: "success",
        });
        setShowModal(false);
        setFormData({
          employeeId: "",
          date: new Date().toISOString().split("T")[0],
          status: "Present",
          timeIn: "",
          timeOut: "",
          remarks: "",
        });
        fetchAttendance();
      }
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.error || "Failed to mark attendance",
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/attendance/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setToast({
          show: true,
          message: "Attendance record deleted successfully",
          type: "success",
        });
        fetchAttendance();
      }
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.error || "Failed to delete record",
        type: "error",
      });
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Present: "bg-green-100 text-green-800 border-green-300",
      Absent: "bg-red-100 text-red-800 border-red-300",
      Late: "bg-yellow-100 text-yellow-800 border-yellow-300",
      "Half-Day": "bg-blue-100 text-blue-800 border-blue-300",
      "Work from Home": "bg-purple-100 text-purple-800 border-purple-300",
      "On Leave": "bg-gray-100 text-gray-800 border-gray-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          badges[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const columns = [
    {
      name: "Employee ID",
      selector: (row) => row.employee?.employeeId || "N/A",
      sortable: true,
    },
    {
      name: "Employee Name",
      selector: (row) => row.employee?.userId?.name || "N/A",
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => getStatusBadge(row.status),
      sortable: true,
    },
    {
      name: "Time In",
      selector: (row) => row.timeIn || "-",
    },
    {
      name: "Time Out",
      selector: (row) => row.timeOut || "-",
    },
    {
      name: "Working Hours",
      selector: (row) =>
        row.workingHours ? `${row.workingHours.toFixed(1)}h` : "-",
    },
    {
      name: "Remarks",
      selector: (row) => row.remarks || "-",
      wrap: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="p-6">
      {toast.show && (
        <div
          className={`fixed top-0 left-0 sm:top-4 sm:left-4 lg:top-6 lg:left-6 z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-4 py-2 rounded opacity-100`}
        >
          {toast.message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Attendance Management
          </h2>
        </div>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by name, ID, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            onClick={() => setShowModal(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 h-[42px]"
          >
            Mark Attendance
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredRecords}
            pagination
            highlightOnHover
            responsive
            customStyles={{
              headRow: {
                style: {
                  backgroundColor: "#f9fafb",
                  borderBottom: "2px solid #e5e7eb",
                },
              },
              headCells: {
                style: {
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#374151",
                },
              },
            }}
          />
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Mark Attendance
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Employee
                  </label>
                  <select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.employeeId} - {emp.userId?.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Half-Day">Half-Day</option>
                    <option value="Work from Home">Work from Home</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Time In
                  </label>
                  <input
                    type="time"
                    name="timeIn"
                    value={formData.timeIn}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Time Out
                  </label>
                  <input
                    type="time"
                    name="timeOut"
                    value={formData.timeOut}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Optional remarks..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
