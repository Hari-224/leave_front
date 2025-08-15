// src/pages/leave/LeaveDetailsPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ROLES, LEAVE_STATUS } from "../../utils/constants";
import "./LeaveDetailsPage.css";

const LeaveDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Example data — replace with API call
  const leave = {
    id,
    type: "SICK",
    status: LEAVE_STATUS.PENDING,
    startDate: "2025-08-20",
    endDate: "2025-08-22",
    reason: "Fever and rest needed",
    requestedBy: {
      name: "John Doe",
      role: ROLES.EMPLOYEE,
      email: "john@example.com",
    },
  };

  const getStatusClass = (status) => {
    switch (status) {
      case LEAVE_STATUS.PENDING:
        return "badge pending";
      case LEAVE_STATUS.APPROVED:
        return "badge approved";
      case LEAVE_STATUS.REJECTED:
        return "badge rejected";
      default:
        return "badge";
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        return "role admin";
      case ROLES.MANAGER:
        return "role manager";
      case ROLES.EMPLOYEE:
        return "role employee";
      default:
        return "role";
    }
  };

  return (
    <div className="container">
      <h1>Leave Application Details</h1>

      <div style={{ marginBottom: "20px" }}>
        <strong>Leave ID:</strong> {leave.id}
      </div>

      <div>
        <strong>Type:</strong> {leave.type}
      </div>

      <div>
        <strong>Status:</strong>{" "}
        <span className={getStatusClass(leave.status)}>{leave.status}</span>
      </div>

      <div>
        <strong>From:</strong> {leave.startDate}
      </div>

      <div>
        <strong>To:</strong> {leave.endDate}
      </div>

      <div>
        <strong>Reason:</strong> {leave.reason}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Requested By</h3>
        <p>
          <span className={getRoleClass(leave.requestedBy.role)}>
            {leave.requestedBy.role}
          </span>{" "}
          — {leave.requestedBy.name}
        </p>
        <p>{leave.requestedBy.email}</p>
      </div>

      <div style={{ marginTop: "30px" }}>
        <button
          className="btn primary"
          onClick={() => navigate("/leave-applications")}
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default LeaveDetailsPage;
