// src/utils/DepartmentHelper.js
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

export const columns = [
  {
    name: "Serial No",
    // small inline style for width
    cell: (row) => <span className="text-md font-medium">{row.sno}</span>,
    style: { width: "120px" },
  },
  {
    name: "Department Name",
    cell: (row) => <span className="text-sm font-medium">{row.dep_name}</span>,
    // instead of grow/minWidth props, use style:
    style: { width: "200px", minWidth: "180px" },
  },
  {
    name: "Action",
    selector: (row) => row.action,
    style: { width: "160px" },
  },
];

export const DepartmentButtons = ({ DepId, onDepartmentDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/department/${DepId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (data.success) {
        onDepartmentDelete(DepId);
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error during delete");
    }
  };

  return (
    <div className="flex justify-end space-x-2 pr-4">
      <button
        onClick={() => navigate(`/admin-dashboard/department/${DepId}`)}
        aria-label="Edit Department"
        className="p-2 bg-gray-500 text-white rounded-3xl hover:bg-gray-600 transition"
      >
        <FaEdit size={16} />
      </button>
      <button
        onClick={handleDelete}
        aria-label="Delete Department"
        className="p-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 transition"
      >
        <FaTrash size={16} />
      </button>
    </div>
  );
};
