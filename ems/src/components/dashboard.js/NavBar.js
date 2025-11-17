import React from "react";
import { useAuth } from "../../context/authContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  return (
    <div
      className="
      flex-1
      bg-teal-600 border border-teal-600
      h-14
      flex items-center px-6
    "
    >
      <p className="font-semibold text-base text-white">
        Welcome {user?.role === "admin" ? "Admin" : user?.name || "User"}
      </p>
      <button
        className="text-white font-semibold ml-auto px-4 py-1 bg-teal-700 rounded-lg transform transition-transform duration-200 ease-in-out hover:scale-105 text-base"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

export default NavBar;
