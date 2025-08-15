import React, { useState } from "react";
import { ChevronDown, ChevronUp, Calendar, User, Clock, CheckCircle, XCircle, AlertCircle, Loader2, MoreVertical } from "lucide-react";
import "./Card.css";

// Base Card Component
export const Card = ({ children, variant = "default", size = "md", hoverable = false, clickable = false, shadow = "md", border = true, className = "", onClick, ...props }) => {
  return (
    <div
      className={`card ${variant} ${size} ${shadow} ${hoverable ? "hoverable" : ""} ${clickable ? "clickable" : ""} ${border ? "bordered" : ""} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Card subcomponents
export const CardHeader = ({ title, subtitle, icon, actions, className = "" }) => (
  <div className={`card-header ${className}`}>
    <div className="header-left">
      {icon && <span className="icon">{icon}</span>}
      <div>
        {title && <h3>{title}</h3>}
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
    {actions && <div className="header-actions">{actions}</div>}
  </div>
);

export const CardBody = ({ children, className = "" }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

export const CardFooter = ({ children, separated = true, className = "" }) => (
  <div className={`card-footer ${separated ? "separated" : ""} ${className}`}>{children}</div>
);

// LeaveCard Component
export const LeaveCard = ({ leaveData, onApprove, onReject, showActions = true, compact = false }) => {
  const statusConfig = {
    pending: { color: "yellow", icon: AlertCircle, label: "Pending" },
    approved: { color: "green", icon: CheckCircle, label: "Approved" },
    rejected: { color: "red", icon: XCircle, label: "Rejected" },
    processing: { color: "blue", icon: Loader2, label: "Processing" }
  }[leaveData.status || "pending"];
  const StatusIcon = statusConfig.icon;

  return (
    <Card hoverable className="border-left-blue">
      <CardHeader
        icon={<Calendar />}
        title={compact ? leaveData.leaveType : `${leaveData.leaveType} - ${leaveData.employeeName}`}
        subtitle={compact ? leaveData.employeeName : `Applied on ${leaveData.appliedDate}`}
        actions={
          <div className="status-actions">
            <span className={`status-badge ${statusConfig.color}`}>
              <StatusIcon className="icon-small" /> {statusConfig.label}
            </span>
            {showActions && <button className="icon-btn"><MoreVertical /></button>}
          </div>
        }
      />
      <CardBody>
        <div className="grid">
          <div><span>Start:</span><p>{leaveData.startDate}</p></div>
          <div><span>End:</span><p>{leaveData.endDate}</p></div>
          <div><span>Duration:</span><p>{leaveData.days} days</p></div>
          <div><span>Applied:</span><p>{leaveData.appliedDate}</p></div>
        </div>
        {!compact && leaveData.reason && (
          <p className="reason"><strong>Reason:</strong> {leaveData.reason}</p>
        )}
      </CardBody>
      {showActions && leaveData.status === "pending" && (
        <CardFooter>
          {onReject && <button className="btn-reject" onClick={() => onReject(leaveData.id)}>Reject</button>}
          {onApprove && <button className="btn-approve" onClick={() => onApprove(leaveData.id)}>Approve</button>}
        </CardFooter>
      )}
    </Card>
  );
};

// ExpandableCard
export const ExpandableCard = ({ title, children, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <Card>
      <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
        <h3>{title}</h3>
        {expanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      {expanded && <CardBody>{children}</CardBody>}
    </Card>
  );
};

// ProfileCard
export const ProfileCard = ({ user, showContact = true, actions }) => (
  <Card variant="gradient" className="text-center">
    <div className="profile-avatar">{user.avatar || user.name.split(' ').map(n => n[0]).join('')}</div>
    <h3>{user.name}</h3>
    <p>{user.role}</p>
    <p>{user.department}</p>
    {showContact && <p>{user.email}</p>}
    {actions && <div className="profile-actions">{actions}</div>}
  </Card>
);
