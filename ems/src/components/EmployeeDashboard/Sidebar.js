import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaMoneyBillWave, FaCalendarAlt, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../context/authContext";

const Sidebar = () => {
  const { logout } = useAuth();

  const linkClasses =
    "flex items-center h-12 pl-6 pr-4 rounded-xl transition-colors duration-200 ease-in-out";

  return (
    <aside className="bg-gray-800 text-white h-screen fixed left-0 top-0 w-64 space-y-2 rounded-tr-xl rounded-br-xl overflow-visible">
      {/* Header */}
      <div className="relative z-10 bg-teal-600 border border-teal-500 h-14 flex items-center justify-center rounded-r-xl -mr-4 px-4">
        <h3 className="text-2xl font-bold">Employee Portal</h3>
      </div>

      {/* Navigation */}
      <nav className="mt-2 flex flex-col">
        <NavLink
          to="/employee-dashboard"
          end
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaTachometerAlt className="text-xl" />
          <span className="ml-4">Dashboard</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/profile"
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaUser className="text-xl" />
          <span className="ml-4">My Profile</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/salary"
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaMoneyBillWave className="text-xl" />
          <span className="ml-4">My Salary</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/leaves"
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaCalendarAlt className="text-xl" />
          <span className="ml-4">Leave</span>
        </NavLink>

        <NavLink
          to="/employee-dashboard/settings"
          className={`${linkClasses} hover:bg-teal-500`}
        >
          <FaCog className="text-xl" />
          <span className="ml-4">Settings</span>
        </NavLink>

        <button
          onClick={logout}
          className={`${linkClasses} hover:bg-red-600 mt-4`}
        >
          <FaSignOutAlt className="text-xl" />
          <span className="ml-4">Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
