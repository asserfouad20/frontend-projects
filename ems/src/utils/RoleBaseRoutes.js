import React from "react";
import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";
const RoleBaseRoutes = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading ....</div>;
  }
  if (!requiredRole.includes(user.role)) {
    <Navigate to="/unauthorized"></Navigate>;
  }
  return user ? children : <Navigate to={"/login"} />;

  return <div>RoleBaseRoutes</div>;
};

export default RoleBaseRoutes;
