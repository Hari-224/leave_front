import React from "react";
import { Routes, Route } from "react-router-dom";
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<LeaveList />} />
        <Route path="create-leave" element={<CreateLeave />} />
        <Route path="leave/:id" element={<LeaveDetailsPage />} />
        <Route path="leave/:id/edit" element={<EditLeave />} />
        <Route path="leave-types" element={<LeaveTypeList />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
