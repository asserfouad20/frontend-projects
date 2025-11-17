// src/components/employees/List.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import DataTable from "react-data-table-component";
import {
  columns as employeeColumns,
  EmployeeButtons,
} from "../../utils/EmployeeHelper";
const customStyles = {
  headRow: {
    style: { borderBottom: "1px solid #e2e8f0" },
  },
  headCells: {
    style: {
      fontSize: "1rem",
      fontWeight: 600,
      textAlign: "left",
      paddingLeft: "1rem",
      paddingRight: "1rem",
    },
  },
  cells: {
    style: {
      textAlign: "left",
      paddingLeft: "1rem",
      paddingRight: "1rem",
    },
  },
  columns: {
    // Shift Action column (index 6) 0.5rem to the left
    6: {
      style: {
        paddingLeft: "70.5rem",
      },
    },
  },
};
export default function List() {
  const [employees, setEmployees] = useState([]); // rows ready for display
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // ← add this

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/employee", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success && Array.isArray(data.employees)) {
          const rows = data.employees.map((emp, idx) => ({
            _id: emp._id,
            sno: idx + 1,
            name: emp.userId?.name || "N/A",
            email: emp.userId?.email || "N/A",
            dept: emp.department?.dep_name || "No Department",
            dob: new Date(emp.dob).toLocaleDateString(),
            image: emp.userId?.profileImage || "",
            action: (
              <EmployeeButtons
                empId={emp._id}
                onEmployeeDelete={(id) =>
                  setEmployees((prev) => prev.filter((e) => e._id !== id))
                }
              />
            ),
          }));
          setEmployees(rows);
        } else {
          alert(data.error || "Failed to load employees");
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        alert(err.response?.data?.error || "Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // filter out of UI render (just like DepartmentsList)
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-5 px-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Manage Employees</h3>
      </div>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Emp Name"
          value={searchTerm} // ← controlled input
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-60 px-4 py-2 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-teal-600
            transition-shadow duration-200
          "
        />

        <Link
          to="/admin-dashboard/add-employee"
          className="
    flex items-center justify-center
    w-10 h-10
    bg-teal-600 text-white
    rounded-full
    hover:bg-teal-700
    transition-colors duration-300
  "
          aria-label="Add Employee"
        >
          <FaPlus className="text-sm" />
        </Link>
      </div>

      <div className="mt-5 bg-white shadow-2xl rounded-xl overflow-hidden">
        <DataTable
          columns={employeeColumns}
          data={filteredEmployees}
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
          noDataComponent="No employees found"
        />
      </div>
    </div>
  );
}
