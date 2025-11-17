import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";

import AdminSummary from "./components/dashboard.js/AdminSummary";
import DepartmentsList from "./components/departments/DepartmentsList";
import AddDepartment from "./components/departments/AddDepartment";
import EditDepartment from "./components/departments/EditDepartment";

// ← add these two
import List from "./components/employee.js/List";
import Add from "./components/employee.js/Add";
import View from "./components/employee.js/View";
import Edit from "./components/employee.js/Edit";
import AddSalary from "./components/salary/AddSalary";
import ViewSalary from "./components/salary/ViewSalary";
import AdminLeaves from "./components/leave/AdminLeaves";
import AdminSettings from "./components/settings/AdminSettings";

// Employee Dashboard Components
import EmployeeSummary from "./components/EmployeeDashboard/Summary";
import EmployeeProfile from "./components/EmployeeDashboard/Profile";
import EmployeeSalary from "./components/EmployeeDashboard/Salary";
import EmployeeLeaves from "./components/EmployeeDashboard/Leaves";
import EmployeeSettings from "./components/EmployeeDashboard/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin"]}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }
      >
        <Route index element={<AdminSummary />} />
        <Route path="departments" element={<DepartmentsList />} />
        <Route path="add-department" element={<AddDepartment />} />
        <Route path="department/:id" element={<EditDepartment />} />

        <Route path="employees" element={<List />} />
        <Route path="add-employee" element={<Add />} />
        <Route path="employees/:id" element={<View />} />
        <Route path="salary/add" element={<AddSalary />} />
        <Route path="employees/edit/:id" element={<Edit />} />
        <Route path="employees/salary/:id" element={<ViewSalary />} />
        <Route path="leave" element={<AdminLeaves />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route
        path="/employee-dashboard"
        element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["employee"]}>
              <EmployeeDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }
      >
        <Route index element={<EmployeeSummary />} />
        <Route path="profile" element={<EmployeeProfile />} />
        <Route path="salary" element={<EmployeeSalary />} />
        <Route path="leaves" element={<EmployeeLeaves />} />
        <Route path="settings" element={<EmployeeSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
