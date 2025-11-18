// src/components/dashboard.js/AdminSidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUser,
  FaBuilding,
  FaCalendar,
  FaMoneyBill,
  FaCog,
  FaMoneyBillWave,
  FaClipboardList,
  FaChartBar,
} from "react-icons/fa";

const AdminSidebar = () => {
  const linkClasses =
    "flex items-center h-12 pl-6 pr-4 rounded-xl transition-colors duration-200 ease-in-out";

  return (
    <aside className="bg-gray-800 text-white h-screen fixed left-0 top-0 w-64 space-y-2 rounded-tr-xl rounded-br-xl overflow-visible">
      {/* Header */}
      <div className="relative z-10 bg-teal-600 border border-teal-500 h-14 flex items-center justify-center rounded-r-xl -mr-4 px-4">
        <h3 className="text-2xl font-bold">Admin Portal</h3>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-col">
        <NavLink
          to="/admin-dashboard"
          end
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaTachometerAlt className="text-xl" />
          <span className="ml-4">Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/employees"
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaUser className="text-xl" />
          <span className="ml-4">Employee</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/departments"
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaBuilding className="text-xl" />
          <span className="ml-4">Department</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/leave"
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaCalendar className="text-xl" />
          <span className="ml-4">Leave</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/salary/add"
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaMoneyBillWave className="text-xl" />
          <span className="ml-4">Salary</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/attendance"
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaClipboardList className="text-xl" />
          <span className="ml-4">Attendance</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/attendance-report"
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaChartBar className="text-xl" />
          <span className="ml-4">Attendance Report</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/settings"
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaCog className="text-xl" />
          <span className="ml-4">Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
