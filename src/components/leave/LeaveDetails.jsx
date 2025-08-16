// src/components/leaves/LeaveDetails.jsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowLeft,
  MoreVertical,
  Edit,
  Trash2,
  Share2,
  Download,
  AlertCircle,
  Loader2
} from "lucide-react";
import {
  getLeaveById,
  approveLeave,
  rejectLeave,
  deleteLeaveById
} from "../../api/leaveApi";
import "./LeaveDetails.css";

// Reusable Info Row
const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="info-row">
    {Icon && <Icon className="info-icon" />}
    <span className="info-label">{label}</span>
    <span className="info-value">{value}</span>
  </div>
);

// Badge component
const Badge = ({ text, colorClass, Icon }) => (
  <div className={`badge ${colorClass}`}>
    {Icon && <Icon className="w-4 h-4" />}
    <span>{text}</span>
  </div>
);

const LeaveDetails = ({ leaveId, currentUser, onBack, showActions = true }) => {
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Fetch leave details on mount or leaveId change
  useEffect(() => {
    fetchLeave();
  }, [leaveId]);

  const fetchLeave = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getLeaveById(leaveId); // Real API call
      setLeave(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch leave details");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!leave) return;
    setProcessing(true);
    try {
      await approveLeave(leave.id); // Real API call
      await fetchLeave();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to approve leave");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!leave) return;
    const reason = prompt("Enter rejection reason (min 10 characters):");
    if (!reason || reason.trim().length < 10) return alert("Rejection reason must be at least 10 characters");
    setProcessing(true);
    try {
      await rejectLeave(leave.id, reason.trim()); // Real API call
      await fetchLeave();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to reject leave");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!leave) return;
    if (!window.confirm("Are you sure you want to delete this leave?")) return;
    setProcessing(true);
    try {
      await deleteLeaveById(leave.id); // Real API call
      alert("Leave deleted successfully");
      onBack?.();
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Failed to delete leave");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A";

  const calculateDuration = () => {
    if (!leave?.startDate || !leave?.endDate) return "Unknown";
    const diff = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    return diff === 1 ? "1 day" : `${diff} days`;
  };

  const canEdit = () =>
    currentUser?.role === "ADMIN" || (currentUser?.id === leave?.employeeId && leave?.status === "PENDING");
  const canDelete = () => currentUser?.role === "ADMIN";
  const canApprove = () => ["ADMIN", "MANAGER"].includes(currentUser?.role) && leave?.status === "PENDING";

  const statusConfig = {
    PENDING: { color: "badge-yellow", icon: AlertCircle },
    APPROVED: { color: "badge-green", icon: CheckCircle },
    REJECTED: { color: "badge-red", icon: XCircle }
  }[leave?.status] || { color: "badge-gray", icon: AlertCircle };

  const typeConfig = {
    SICK: "badge-red",
    VACATION: "badge-blue",
    PERSONAL: "badge-purple",
    EMERGENCY: "badge-orange"
  }[leave?.leaveType] || "badge-gray";

  if (loading) return (
    <div className="loading-state">
      <Loader2 className="animate-spin" /> Loading leave details...
    </div>
  );

  if (error) return <div className="error-state">{error}</div>;
  if (!leave) return <div className="empty-state">Leave not found</div>;

  return (
    <div className="leave-details">
      {/* Header */}
      <div className="header">
        {onBack && (
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft />
          </button>
        )}
        <div className="header-title">
          <FileText className="header-icon" />
          <div>
            <h1>Leave Application</h1>
            <p>Application #{leave.id}</p>
          </div>
        </div>
        <div className="header-actions">
          <button><Share2 /></button>
          <button><Download /></button>
          <div className="menu-wrapper">
            <button onClick={() => setMenuOpen(!menuOpen)}><MoreVertical /></button>
            {menuOpen && (
              <div className="menu">
                {canEdit() && <button onClick={() => alert("Edit feature coming soon")}> <Edit /> Edit</button>}
                {canDelete() && <button onClick={handleDelete}><Trash2 /> Delete</button>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status & Type */}
      <div className="badges">
        <Badge text={leave.status} colorClass={statusConfig.color} Icon={statusConfig.icon} />
        <Badge text={`${leave.leaveType} Leave`} colorClass={typeConfig} Icon={FileText} />
      </div>

      {/* Employee Info */}
      <div className="card">
        <h2><User /> Employee Information</h2>
        <div className="grid">
          <div className="employee">
            <div className="avatar">{leave.employeeName?.charAt(0) || "N"}</div>
            <div>
              <p>{leave.employeeName || "Unknown"}</p>
              <p>{leave.department || "Not specified"}</p>
            </div>
          </div>
          <div className="contact-info">
            {leave.employeeEmail && <InfoRow label="Email" value={leave.employeeEmail} />}
            {leave.employeePhone && <InfoRow label="Phone" value={leave.employeePhone} />}
            {leave.position && <InfoRow label="Position" value={leave.position} />}
          </div>
        </div>
      </div>

      {/* Leave Period & Application Details */}
      <div className="grid two-columns">
        <div className="card">
          <h3><Calendar /> Leave Period</h3>
          <InfoRow label="Start Date" value={formatDate(leave.startDate)} />
          <InfoRow label="End Date" value={formatDate(leave.endDate)} />
          <InfoRow label="Duration" value={calculateDuration()} icon={Clock} />
        </div>

        <div className="card">
          <h3>Application Details</h3>
          <InfoRow label="Application ID" value={`#${leave.id}`} />
          <InfoRow label="Applied Date" value={formatDate(leave.appliedDate)} />
          {leave.approvedBy && <InfoRow label="Approved By" value={leave.approvedBy} />}
          {leave.approvedDate && <InfoRow label="Decision Date" value={formatDate(leave.approvedDate)} />}
          <InfoRow label="Leave Balance" value={leave.remainingLeaves !== undefined ? `${leave.remainingLeaves} days` : "N/A"} />
        </div>
      </div>

      {/* Reason */}
      {leave.reason && (
        <div className="card">
          <h3><MessageSquare /> Leave Reason</h3>
          <p>{leave.reason}</p>
        </div>
      )}

      {/* Action Buttons */}
      {showActions && canApprove() && (
        <div className="actions">
          <button className="approve-btn" onClick={handleApprove} disabled={processing}><CheckCircle /> Approve Leave</button>
          <button className="reject-btn" onClick={handleReject} disabled={processing}><XCircle /> Reject Leave</button>
        </div>
      )}
    </div>
  );
};

export default LeaveDetails;
