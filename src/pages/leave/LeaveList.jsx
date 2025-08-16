// src/pages/leaves/LeaveList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // JWT hook
import axios from "axios";
import { LEAVE_STATUS } from "../../utils/constants";
import { Loader2 } from "lucide-react";
import "./LeaveList.css";

const LeaveList = () => {
  const { token } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch all leave applications
  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await api.get("/leave-applications");
        setLeaves(res.data);
      } catch (err) {
        console.error("Error fetching leave applications:", err);
        setError(err.response?.data?.message || "Failed to fetch leaves");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, [token]);

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
        <Loader2 className="spin" /> Loading leave applications...
      </div>
    );

  if (error)
    return (
      <div className="error-screen">
        <p>{error}</p>
      </div>
    );

  return (
    <div className="leave-list-container">
      <h1>Leave Applications</h1>
      {leaves.length === 0 ? (
        <p>No leave applications found.</p>
      ) : (
        <table className="leave-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Requested By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.id}</td>
                <td>{leave.leaveType || leave.type || "-"}</td>
                <td>
                  <span className={getStatusClass(leave.status)}>
                    {leave.status || "-"}
                  </span>
                </td>
                <td>{formatDate(leave.startDate)}</td>
                <td>{formatDate(leave.endDate)}</td>
                <td>{leave.user?.name || leave.requestedBy?.name || "N/A"}</td>
                <td>
                  <Link to={`/leave/${leave.id}`} className="view-btn">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveList;
