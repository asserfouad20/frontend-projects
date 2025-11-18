import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaTimes } from "react-icons/fa";

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchStatus, setSearchStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const customStyles = {
    headRow: { style: { borderBottom: "1px solid #e2e8f0" } },
    headCells: {
      style: {
        fontSize: "1rem",
        fontWeight: 600,
        textAlign: "left",
        paddingLeft: "1rem",
      },
    },
    cells: { style: { textAlign: "left", paddingLeft: "1rem" } },
  };

  const columns = [
    {
      name: "SNO",
      selector: (row) => row.sno,
      width: "80px",
    },
    {
      name: "LEAVE TYPE",
      selector: (row) => row.leaveType,
      sortable: true,
    },
    {
      name: "FROM",
      selector: (row) => row.from,
      sortable: true,
    },
    {
      name: "TO",
      selector: (row) => row.to,
      sortable: true,
    },
    {
      name: "DESCRIPTION",
      selector: (row) => row.description,
      wrap: true,
    },
    {
      name: "APPLIED DATE",
      selector: (row) => row.appliedDate,
      sortable: true,
    },
    {
      name: "STATUS",
      selector: (row) => row.status,
      cell: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            row.status === "Approved"
              ? "bg-green-100 text-green-700"
              : row.status === "Rejected"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.status}
        </span>
      ),
      sortable: true,
    },
  ];

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    if (searchStatus === "") {
      setFilteredLeaves(leaves);
    } else {
      setFilteredLeaves(
        leaves.filter((leave) =>
          leave.status.toLowerCase().includes(searchStatus.toLowerCase())
        )
      );
    }
  }, [searchStatus, leaves]);

  useEffect(() => {
    if (toast.show) {
      const id = setTimeout(
        () => setToast((t) => ({ ...t, show: false })),
        3000
      );
      return () => clearTimeout(id);
    }
  }, [toast.show]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "/api/leave/employee",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const mappedLeaves = response.data.leaves.map((leave, index) => ({
          _id: leave._id,
          sno: index + 1,
          leaveType: leave.leaveType,
          from: new Date(leave.startDate).toLocaleDateString(),
          to: new Date(leave.endDate).toLocaleDateString(),
          description: leave.reason,
          appliedDate: new Date(leave.appliedAt).toLocaleDateString(),
          status: leave.status,
        }));
        setLeaves(mappedLeaves);
        setFilteredLeaves(mappedLeaves);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/leave/apply",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setToast({
          show: true,
          message: "Leave application submitted successfully!",
          type: "success",
        });
        setShowModal(false);
        setFormData({
          leaveType: "",
          startDate: "",
          endDate: "",
          reason: "",
        });
        fetchLeaves(); // Refresh the list
      }
    } catch (error) {
      console.error("Error applying for leave:", error);
      setToast({
        show: true,
        message: error.response?.data?.error || "Failed to apply for leave",
        type: "error",
      });
    } finally {
      setSubmitting(false);
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
      <h2 className="text-2xl font-bold mb-6">Manage Leaves</h2>

      {/* Search and Add Button */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search By Status"
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
          className="mt-1 block w-64 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          Add Leave
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredLeaves}
          customStyles={customStyles}
          progressPending={loading}
          pagination
          highlightOnHover
          pointerOnHover
          noDataComponent="No leave records found"
        />
      </div>

      {/* Add Leave Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-3xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Modal Header */}
            <h3 className="text-2xl font-bold mb-6">Apply for Leave</h3>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Leave Type */}
              <div>
                <label
                  htmlFor="leaveType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Leave Type
                </label>
                <select
                  id="leaveType"
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
                >
                  <option value="">Select Leave Type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  From Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
                />
              </div>

              {/* End Date */}
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  To Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
                />
              </div>

              {/* Reason - Full Width */}
              <div className="md:col-span-2">
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reason
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
                  placeholder="Enter reason for leave"
                />
              </div>

              {/* Submit Button - Full Width */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg ${
                    submitting
                      ? "opacity-50 cursor-not-allowed transform-none"
                      : ""
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;
