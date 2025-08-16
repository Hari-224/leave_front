// src/components/leaves/ApproveRejectModal.jsx
import React, { useState, useEffect } from "react";
import {
  X, ThumbsUp, ThumbsDown, AlertTriangle,
  Calendar, Clock, User, FileText
} from "lucide-react";
import { approveLeave, rejectLeave } from "../../api/leaveApi"; // real API helper
import "./ApproveRejectModal.css";

const ApproveRejectModal = ({ leave, onClose, isOpen = true, onUpdate }) => {
  const [reason, setReason] = useState("");
  const [action, setAction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen) resetState();
  }, [isOpen]);

  const resetState = () => {
    setReason("");
    setAction(null);
    setErrors({});
    setShowConfirmation(false);
    setIsSubmitting(false);
  };

  // Validate rejection reason
  const validateReason = () => {
    const err = {};
    if (action === "reject") {
      if (!reason.trim()) err.reason = "Please provide a reason";
      else if (reason.trim().length < 10) err.reason = "Reason must be at least 10 characters";
      else if (reason.trim().length > 500) err.reason = "Reason cannot exceed 500 characters";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAction = (type) => {
    setAction(type);
    setShowConfirmation(true);
    validateReason();
  };

  const handleConfirm = async () => {
    if (!validateReason()) return;
    setIsSubmitting(true);

    try {
      if (action === "approve") {
        await approveLeave(leave.id); // Call your real API
      } else {
        await rejectLeave(leave.id, reason.trim()); // Call your real API
      }

      onUpdate?.(); // Refresh parent leave list
      onClose?.();  // Close modal
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || err.message || "Something went wrong" });
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) return;
    setShowConfirmation(false);
    setAction(null);
    setErrors({});
  };

  if (!isOpen || !leave) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const daysCount = () =>
    Math.ceil(Math.abs(new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="arm-backdrop">
      <div className="arm-modal">
        {/* Header */}
        <div className="arm-header">
          <h2>Leave Application Review</h2>
          <button onClick={onClose} disabled={isSubmitting}><X /></button>
        </div>

        {/* Leave Info */}
        <div className="arm-content">
          <div className="arm-employee">
            <User /> <strong>{leave.employeeName}</strong> | {leave.department}
            <span className={`arm-status arm-status-${leave.status.toLowerCase()}`}>{leave.status}</span>
          </div>
          <div className="arm-dates">
            <Calendar /> <span>Start: {formatDate(leave.startDate)}</span>
            <Calendar /> <span>End: {formatDate(leave.endDate)}</span>
            <Clock /> <span>Duration: {daysCount()} days</span>
            <FileText /> <span className={`arm-leave-type arm-leave-type-${leave.leaveType.toLowerCase()}`}>{leave.leaveType}</span>
          </div>
          {leave.reason && <div className="arm-reason"><strong>Reason:</strong> {leave.reason}</div>}

          {errors.submit && <div className="arm-error"><AlertTriangle /> {errors.submit}</div>}

          {!showConfirmation ? (
            <div className="arm-actions">
              <textarea
                placeholder="Rejection reason (required if rejecting)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
                className={errors.reason ? "arm-input-error" : ""}
              />
              {errors.reason && <p className="arm-error-text">{errors.reason}</p>}
              <div className="arm-buttons">
                <button onClick={() => handleAction("approve")} disabled={isSubmitting}><ThumbsUp /> Approve</button>
                <button onClick={() => handleAction("reject")} disabled={isSubmitting}><ThumbsDown /> Reject</button>
              </div>
            </div>
          ) : (
            <div className={`arm-confirm ${action === "approve" ? "arm-confirm-approve" : "arm-confirm-reject"}`}>
              <p>Are you sure you want to {action} this leave?</p>
              {reason && <blockquote>"{reason}"</blockquote>}
              <div className="arm-buttons">
                <button onClick={handleConfirm} disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : `Yes, ${action}`}
                </button>
                <button onClick={handleCancel} disabled={isSubmitting}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveRejectModal;
