// src/components/salary/ViewSalary.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";

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
  { name: "SNO", selector: (row) => row.sno, width: "70px" },
  { name: "Emp ID", selector: (row) => row.empId, sortable: true },
  {
    name: "Salary",
    selector: (row) => row.salary,
    sortable: true,
    cell: (row) => (
      <span className="font-semibold text-blue-600">
        ${row.salary.toLocaleString()}
      </span>
    ),
  },
  {
    name: "Allowance",
    selector: (row) => row.allowance,
    sortable: true,
    cell: (row) => (
      <span className="font-semibold text-green-600">
        +${row.allowance.toLocaleString()}
      </span>
    ),
  },
  {
    name: "Deduction",
    selector: (row) => row.deduction,
    sortable: true,
    cell: (row) => (
      <span className="font-semibold text-red-600">
        -${row.deduction.toLocaleString()}
      </span>
    ),
  },
  {
    name: "Total",
    selector: (row) => row.total,
    sortable: true,
    cell: (row) => (
      <span className="font-bold text-teal-600 text-lg">
        ${row.total.toLocaleString()}
      </span>
    ),
  },
  { name: "Pay Date", selector: (row) => row.payDate, sortable: true },
];

export default function ViewSalary() {
  const { id } = useParams();
  const [salaries, setSalaries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/salary/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (data.success) {
          // remap each salary into the row shape we need
          const rows = data.salary.map((sal, i) => ({
            _id: sal._id,
            sno: i + 1,
            empId: sal.employee.employeeId,
            salary: sal.basicSalary,
            allowance: sal.allowances,
            deduction: sal.deductions,
            total: sal.netSalary,
            payDate: new Date(sal.payDate).toLocaleDateString(),
          }));
          setSalaries(rows);
          setFiltered(rows);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load salary history");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  // live‐filter by Emp ID
  useEffect(() => {
    setFiltered(
      salaries.filter((r) =>
        r.empId.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, salaries]);

  return (
    <div className="pt-5 px-6 space-y-4">
      {/* 1) Title above */}
      <h3 className="text-2xl font-bold">Salary History</h3>

      {/* 2) Back button below title */}
      <div>
        <Link
          to="/admin-dashboard/employees"
          className="
            text-teal-600 hover:underline
            transition-colors duration-200
          "
        >
          ← Back to Employees
        </Link>
      </div>

      {/* 3) Table */}
      <div className="mt-5 bg-white shadow-2xl rounded-xl overflow-hidden">
        <DataTable
          columns={columns}
          data={filtered}
          customStyles={customStyles}
          progressPending={loading}
          pagination
          highlightOnHover
          pointerOnHover
          noDataComponent="No salary records found"
        />
      </div>
    </div>
  );
}
