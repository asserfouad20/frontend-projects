// src/components/departments/DepartmentsList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import { columns } from "../../utils/DepartmentHelper";
import { DepartmentButtons } from "../../utils/DepartmentHelper";
import { FaPlus } from "react-icons/fa";

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

export default function DepartmentsList() {
  const [departments, setDepartments] = useState([]); // raw data
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // remove by id with functional update
  const onDepartmentDelete = (id) =>
    setDepartments((prev) => prev.filter((dep) => dep._id !== id));

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/department", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success) {
          setDepartments(data.departments);
        }
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.error || "Failed to load departments");
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // filter & then map into table rows
  const rows = departments
    .filter((dep) =>
      dep.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((dep, idx) => ({
      _id: dep._id,
      sno: idx + 1,
      dep_name: dep.dep_name,
      action: (
        <DepartmentButtons
          DepId={dep._id}
          onDepartmentDelete={onDepartmentDelete}
        />
      ),
    }));

  return (
    <div className="pt-5 px-6 space-y-4">
      {/* Header + Add */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Manage Departments</h3>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Dept Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-46 px-4 py-2 border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-teal-600
            transition-shadow duration-200
          "
        />
        <Link
          to="/admin-dashboard/add-department"
          className="
    flex items-center justify-center
    w-10 h-10
    bg-teal-600 text-white
    rounded-full
    hover:bg-teal-700
    transition-colors duration-300
  "
          aria-label="Add Department"
        >
          <FaPlus className="text-sm" />
        </Link>
      </div>

      {/* Table */}
      <div className="mt-5 bg-white shadow-2xl rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={rows}
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
          noDataComponent="No departments found"
        />
      </div>
    </div>
  );
}
