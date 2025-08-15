import React, { useState } from "react";
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, MessageSquare, ArrowLeft, MoreVertical, Edit, Trash2, Share2, Download, AlertCircle } from "lucide-react";
import './LeaveDetails.css';

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="info-row">
    {Icon && <Icon className="info-icon" />}
    <span className="info-label">{label}</span>
    <span className="info-value">{value}</span>
  </div>
);

const Badge = ({ text, colorClass, Icon }) => (
  <div className={`badge ${colorClass}`}>
    {Icon && <Icon className="w-4 h-4" />}
    <span>{text}</span>
  </div>
);

const LeaveDetails = ({ leave, currentUser, onEdit, onDelete, onApprove, onReject, onBack, showActions = true }) => {
  const [showMenu, setShowMenu] = useState(false);

  if (!leave) return <div className="empty-state">No leave selected</div>;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  const calculateDuration = () => {
    if (!leave.startDate || !leave.endDate) return 'Unknown';
    const diff = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    return diff === 1 ? '1 day' : `${diff} days`;
  };

  const canEdit = () => currentUser?.role === 'ADMIN' || (currentUser?.id === leave.employeeId && leave.status === 'PENDING');
  const canDelete = () => currentUser?.role === 'ADMIN';
  const canApprove = () => ['ADMIN', 'MANAGER'].includes(currentUser?.role) && leave.status === 'PENDING';

  const statusConfig = {
    PENDING: { color: 'badge-yellow', icon: AlertCircle },
    APPROVED: { color: 'badge-green', icon: CheckCircle },
    REJECTED: { color: 'badge-red', icon: XCircle }
  }[leave.status] || { color: 'badge-gray', icon: AlertCircle };

  const typeConfig = {
    SICK: 'badge-red', VACATION: 'badge-blue', PERSONAL: 'badge-purple', EMERGENCY: 'badge-orange'
  }[leave.leaveType] || 'badge-gray';

  return (
    <div className="leave-details">
      {/* Header */}
      <div className="header">
        {onBack && <button className="back-btn" onClick={onBack}><ArrowLeft /></button>}
        <div className="header-title">
          <FileText className="header-icon" />
          <div>
            <h1>Leave Application</h1>
            <p>Application #{leave.id}</p>
          </div>
        </div>
        {showActions && (
          <div className="header-actions">
            <button><Share2 /></button>
            <button><Download /></button>
            <div className="menu-wrapper">
              <button onClick={() => setShowMenu(!showMenu)}><MoreVertical /></button>
              {showMenu && (
                <div className="menu">
                  {canEdit() && <button onClick={() => { onEdit?.(leave); setShowMenu(false); }}><Edit />Edit</button>}
                  {canDelete() && <button onClick={() => { onDelete?.(leave.id); setShowMenu(false); }}><Trash2 />Delete</button>}
                </div>
              )}
            </div>
          </div>
        )}
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
            <div className="avatar">{leave.employeeName?.charAt(0) || 'N'}</div>
            <div>
              <p>{leave.employeeName || 'Unknown'}</p>
              <p>{leave.department || 'Not specified'}</p>
            </div>
          </div>
          <div className="contact-info">
            {leave.employeeEmail && <InfoRow label="Email" value={leave.employeeEmail} icon={null} />}
            {leave.employeePhone && <InfoRow label="Phone" value={leave.employeePhone} icon={null} />}
            {leave.position && <InfoRow label="Position" value={leave.position} icon={null} />}
          </div>
        </div>
      </div>

      {/* Leave Period & Duration */}
      <div className="grid two-columns">
        <div className="card">
          <h3><Calendar /> Leave Period</h3>
          <InfoRow label="Start Date" value={formatDate(leave.startDate)} />
          <InfoRow label="End Date" value={formatDate(leave.endDate)} />
          <InfoRow label="Duration" value={calculateDuration()} icon={Clock} />
        </div>

        {/* Application Details */}
        <div className="card">
          <h3>Application Details</h3>
          <InfoRow label="Application ID" value={`#${leave.id}`} />
          <InfoRow label="Applied Date" value={formatDate(leave.appliedDate)} />
          {leave.approvedBy && <InfoRow label="Approved By" value={leave.approvedBy} />}
          {leave.approvedDate && <InfoRow label="Decision Date" value={formatDate(leave.approvedDate)} />}
          <InfoRow label="Leave Balance" value={leave.remainingLeaves !== undefined ? `${leave.remainingLeaves} days` : 'N/A'} />
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
          <button className="approve-btn" onClick={() => onApprove?.(leave.id)}><CheckCircle /> Approve Leave</button>
          <button className="reject-btn" onClick={() => onReject?.(leave.id)}><XCircle /> Reject Leave</button>
        </div>
      )}
    </div>
  );
};

export default LeaveDetails;
