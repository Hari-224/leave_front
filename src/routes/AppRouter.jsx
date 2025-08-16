import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import LeaveList from "../pages/leave/LeaveList";
import CreateLeave from "../pages/leave/CreateLeave";
import LeaveDetailsPage from "../pages/leave/LeaveDetailsPage";
import EditLeave from "../pages/leave/EditLeave";
import LeaveTypeList from "../pages/leaveType/LeaveTypeList";

function AppRouter() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Redirect root to dashboard if logged in */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Protected routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* Nested routes inside dashboard */}
        <Route index element={<LeaveList />} />
        <Route path="create-leave" element={<CreateLeave />} />
        <Route path="leave/:id" element={<LeaveDetailsPage />} />
        <Route path="leave/:id/edit" element={<EditLeave />} />
        <Route path="leave-types" element={<LeaveTypeList />} />
      </Route>

      {/* Catch-all route for 404 */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRouter;
