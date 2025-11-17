import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const { data } = await axios.get("/api/employee/salary", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success) {
          setSalaries(data.salaries);
        }
      } catch (error) {
        console.error("Error fetching salary data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, []);

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <span className="text-sm font-medium">{index + 1}</span>,
      width: "80px",
      center: true,
    },
    {
      name: "Basic Salary",
      selector: (row) => row.basicSalary,
      cell: (row) => (
        <span className="text-sm font-medium">${row.basicSalary.toLocaleString()}</span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Allowances",
      selector: (row) => row.allowances,
      cell: (row) => (
        <span className="text-sm font-medium text-green-600">
          ${row.allowances.toLocaleString()}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Deductions",
      selector: (row) => row.deductions,
      cell: (row) => (
        <span className="text-sm font-medium text-red-600">
          -${row.deductions.toLocaleString()}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Net Salary",
      selector: (row) => row.netSalary,
      cell: (row) => (
        <span className="text-sm font-bold text-blue-600">
          ${row.netSalary.toLocaleString()}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "Pay Date",
      selector: (row) => row.payDate,
      cell: (row) => (
        <span className="text-sm font-medium">
          {new Date(row.payDate).toLocaleDateString()}
        </span>
      ),
      sortable: true,
      center: true,
    },
  ];

  const customStyles = {
    headRow: {
      style: { borderBottom: "1px solid #e2e8f0" },
    },
    headCells: {
      style: {
        fontSize: "1rem",
        fontWeight: 600,
        textAlign: "center",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
    cells: {
      style: {
        textAlign: "center",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">My Salary History</h2>

      {/* Summary Cards */}
      {salaries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <FaMoneyBillWave className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Latest Net Salary</p>
                <p className="text-2xl font-bold">
                  ${salaries[0]?.netSalary.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-4 rounded-full">
                <FaMoneyBillWave className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Earnings</p>
                <p className="text-2xl font-bold">
                  $
                  {salaries
                    .reduce((sum, s) => sum + s.netSalary, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <FaCalendarAlt className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Payments</p>
                <p className="text-2xl font-bold">{salaries.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Salary Table */}
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={salaries}
          customStyles={customStyles}
          progressPending={loading}
          progressComponent={
            <div className="flex items-center justify-center h-48">
              <span className="text-3xl font-bold text-black">Loading…</span>
            </div>
          }
          pagination
          highlightOnHover
          pointerOnHover
          noDataComponent={
            <div className="flex flex-col items-center justify-center h-48">
              <FaMoneyBillWave className="text-gray-400 text-6xl mb-4" />
              <span className="text-gray-500 text-lg">No salary records found</span>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default Salary;
