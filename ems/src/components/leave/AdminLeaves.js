import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

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
      width: "70px",
    },
    {
      name: "EMPLOYEE",
      selector: (row) => row.employeeName,
      sortable: true,
      wrap: true,
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
      name: "REASON",
      selector: (row) => row.reason,
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
    {
      name: "ACTIONS",
      cell: (row) =>
        row.status === "Pending" ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleUpdateStatus(row._id, "Approved")}
              className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => handleUpdateStatus(row._id, "Rejected")}
              className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">No actions</span>
        ),
      width: "200px",
    },
  ];

  useEffect(() => {
    fetchLeaves();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredLeaves(leaves);
    } else {
      setFilteredLeaves(
        leaves.filter(
          (leave) =>
            leave.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            leave.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, leaves]);

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
      const response = await axios.get("/api/leave", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const mappedLeaves = response.data.leaves.map((leave, index) => ({
          _id: leave._id,
          sno: index + 1,
          employeeName: leave.employee?.userId?.name || "Unknown",
          leaveType: leave.leaveType,
          from: new Date(leave.startDate).toLocaleDateString(),
          to: new Date(leave.endDate).toLocaleDateString(),
          reason: leave.reason,
          appliedDate: new Date(leave.appliedAt).toLocaleDateString(),
          status: leave.status,
        }));
        setLeaves(mappedLeaves);
        setFilteredLeaves(mappedLeaves);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setToast({
        show: true,
        message: "Failed to fetch leave requests",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (leaveId, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `/api/leave/${leaveId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setToast({
          show: true,
          message: `Leave ${status.toLowerCase()} successfully!`,
          type: "success",
        });
        fetchLeaves(); // Refresh the list
      }
    } catch (error) {
      console.error("Error updating leave status:", error);
      setToast({
        show: true,
        message: error.response?.data?.error || "Failed to update leave status",
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
      <h2 className="text-2xl font-bold mb-6">Leave Management</h2>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by employee, leave type, or status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1 block w-96 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all duration-300 ease-in-out hover:border-teal-400"
        />
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
          noDataComponent="No leave requests found"
        />
      </div>
    </div>
  );
};

export default AdminLeaves;
