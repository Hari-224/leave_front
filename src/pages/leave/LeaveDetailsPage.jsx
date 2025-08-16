// src/pages/leaves/LeaveDetailsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // JWT hook
import axios from "axios";
import { Loader2 } from "lucide-react";
import { ROLES, LEAVE_STATUS } from "../../utils/constants";
import "./LeaveDetailsPage.css";

const LeaveDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch leave details
  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const res = await api.get(`/leave-applications/${id}`);
        setLeave(res.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch leave details");
      } finally {
        setLoading(false);
      }
    };
    fetchLeave();
  }, [id, token]);

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
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
    switch (role?.toLowerCase()) {
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading)
    return (
      <div className="loading-screen">
        <Loader2 className="spin" /> Loading leave details...
      </div>
    );

  if (error)
    return (
      <div className="error-screen">
        <p>{error}</p>
        <button onClick={() => navigate("/leave-applications")} className="btn primary">
          Back to List
        </button>
      </div>
    );

  return (
    <div className="leave-details-container">
      <h1>Leave Application Details</h1>

      <div className="detail-row">
        <strong>Leave ID:</strong> {leave.id}
      </div>

      <div className="detail-row">
        <strong>Type:</strong> {leave.leaveType}
      </div>

      <div className="detail-row">
        <strong>Status:</strong>{" "}
        <span className={getStatusClass(leave.status)}>{leave.status}</span>
      </div>

      <div className="detail-row">
        <strong>From:</strong> {formatDate(leave.startDate)}
      </div>

      <div className="detail-row">
        <strong>To:</strong> {formatDate(leave.endDate)}
      </div>

      <div className="detail-row">
        <strong>Reason:</strong> {leave.reason || "-"}
      </div>

      {leave.halfDay && (
        <div className="detail-row">
          <strong>Half-Day:</strong> Yes
        </div>
      )}

      {leave.emergencyContact && (
        <div className="detail-row">
          <strong>Emergency Contact:</strong> {leave.emergencyContact}
        </div>
      )}

      <div className="requester-info">
        <h3>Requested By</h3>
        {leave.user ? (
          <>
            <p>
              <span className={getRoleClass(leave.user.role)}>
                {leave.user.role}
              </span>{" "}
              — {leave.user.name}
            </p>
            <p>{leave.user.email}</p>
          </>
        ) : (
          <p>-</p>
        )}
      </div>

      <div className="actions">
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
