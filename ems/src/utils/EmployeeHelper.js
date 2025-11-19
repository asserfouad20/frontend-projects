import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEdit, FaDollarSign, FaTrash } from "react-icons/fa";
import axios from "axios";
// Table column definitions for employees
export const columns = [
  {
    name: "Serial No",
    cell: (row) => <span className="text-md font-medium">{row.sno}</span>,
    style: { width: "70px" },
  },
  {
    name: "Name",
    cell: (row) => <span className="text-sm font-medium">{row.name}</span>,
    sortable: true,
    style: { width: "100px" },
  },
  {
    name: "Image",
    selector: (row) => row.image,
    cell: (row) => (
      <img
        src={row.image ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${row.image}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(row.name)}&background=0D8ABC&color=fff`}
        alt={row.name}
        className="h-8 w-8 rounded-full object-cover mx-auto"
      />
    ),
    style: { width: "90px" },
  },
  {
    name: "Department",
    cell: (row) => <span className="text-sm font-medium">{row.dept}</span>,
    sortable: true,
    style: { width: "120px" },
  },
  {
    name: "DOB",
    cell: (row) => <span className="text-sm font-medium">{row.dob}</span>,
    sortable: true,
    style: { width: "130px" },
  },

  {
    name: "Action",
    selector: (row) => row.action,
  },
];
// employees for salary
export const getEmployees = async (id) => {
  let employees;
  try {
    const response = await axios.get(
      `/api/employee/department/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data.success) {
      employees = response.data.employees;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return employees;
};

// Buttons for each employee row
export const EmployeeButtons = ({ empId, onEmployeeDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-2 pr-4 z-10">
      <button
        onClick={() => navigate(`/admin-dashboard/employees/${empId}`)}
        aria-label="View Employee"
        className="p-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition"
      >
        <FaEye size={16} />
      </button>
      <button
        onClick={() => navigate(`/admin-dashboard/employees/edit/${empId}`)}
        aria-label="Edit Employee"
        className="p-2 bg-gray-500 text-white rounded-3xl hover:bg-gray-600 transition"
      >
        <FaEdit size={16} />
      </button>
      <button
        onClick={() => navigate(`/admin-dashboard/employees/salary/${empId}`)}
        aria-label="Salary"
        className="p-2 bg-green-500 text-white rounded-3xl hover:bg-green-600 transition"
      >
        <FaDollarSign size={16} />
      </button>
      <button
        onClick={() => onEmployeeDelete(empId)}
        aria-label="Delete Employee"
        className="p-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition"
      >
        <FaTrash size={16} />
      </button>
    </div>
  );
};
