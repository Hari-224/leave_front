// src/pages/leaves/EditLeave.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Clock, CheckCircle, AlertCircle, Loader2, Save, X 
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import "./EditLeave.css";

const EditLeave = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    emergencyContact: "",
    halfDay: false
  });
  const [leaveTypes, setLeaveTypes] = useState([]);

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { Authorization: `Bearer ${token}` }
  });

  // Fetch leave types and leave details
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leave types
        const typesRes = await api.get("/leave-types");
        setLeaveTypes(typesRes.data);

        // Fetch leave details
        const leaveRes = await api.get(`/leave-applications/${id}`);
        setLeave(leaveRes.data);
        setFormData({
          leaveType: leaveRes.data.leaveType,
          startDate: leaveRes.data.startDate,
          endDate: leaveRes.data.endDate,
          reason: leaveRes.data.reason,
          emergencyContact: leaveRes.data.emergencyContact || "",
          halfDay: leaveRes.data.halfDay || false
        });
      } catch (err) {
        console.error("Failed to fetch leave data", err);
        alert("Failed to fetch leave details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errors.endDate = "End date cannot be before start date";
    }
    if (!formData.reason.trim()) errors.reason = "Reason is required";
    if (formData.leaveType.toLowerCase().includes("emergency") && !formData.emergencyContact.trim()) {
      errors.emergencyContact = "Emergency contact is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors).join("\n"));
      return;
    }
    setUpdating(true);
    try {
      await api.put(`/leave-applications/${id}`, formData);
      setShowSuccess(true);
      setTimeout(() => navigate("/leaves"), 2000);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update leave");
    } finally {
      setUpdating(false);
    }
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const diffTime = Math.abs(new Date(formData.endDate) - new Date(formData.startDate));
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return formData.halfDay ? days - 0.5 : days;
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved": return "status-approved";
      case "rejected": return "status-rejected";
      case "pending": return "status-pending";
      default: return "status-default";
    }
  };

  if (loading) return <div className="loading-screen"><Loader2 className="spin" /> Loading leave details...</div>;
  if (showSuccess) return (
    <div className="success-screen">
      <CheckCircle size={48} /> Leave Updated Successfully!
    </div>
  );

  return (
    <div className="edit-leave">
      {/* Header */}
      <div className="header">
        <button onClick={() => navigate("/leaves")} className="back-btn">
          <ArrowLeft size={18} /> Back to Leaves
        </button>
        <h1>Edit Leave Application</h1>
        <span className={`status-badge ${getStatusClass(leave?.status)}`}>
          {leave?.status}
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="leave-form">
        {/* Leave Type */}
        <label>Leave Type</label>
        <select
          value={formData.leaveType}
          onChange={(e) => handleChange("leaveType", e.target.value)}
          required
        >
          {leaveTypes.map(type => (
            <option key={type.id} value={type.name}>{type.name}</option>
          ))}
        </select>

        {/* Dates */}
        <label>Start Date</label>
        <input
          type="date"
          value={formData.startDate}
          onChange={(e) => handleChange("startDate", e.target.value)}
          required
        />
        <label>End Date</label>
        <input
          type="date"
          value={formData.endDate}
          onChange={(e) => handleChange("endDate", e.target.value)}
          required
        />

        {calculateDays() > 0 && (
          <div className="duration">
            <Clock size={18} /> Duration: {calculateDays()} day(s)
          </div>
        )}

        {/* Reason */}
        <label>Reason</label>
        <textarea
          value={formData.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder="Reason for leave"
          required
        />

        {/* Emergency Contact */}
        {formData.leaveType.toLowerCase().includes("emergency") && (
          <>
            <label>Emergency Contact</label>
            <input
              type="text"
              value={formData.emergencyContact}
              onChange={(e) => handleChange("emergencyContact", e.target.value)}
              required
            />
          </>
        )}

        {/* Half-Day */}
        <label>
          <input
            type="checkbox"
            checked={formData.halfDay}
            onChange={(e) => handleChange("halfDay", e.target.checked)}
          /> Half-Day
        </label>

        {/* Actions */}
        <div className="actions">
          <button type="submit" disabled={updating}>
            {updating ? <Loader2 className="spin" /> : <Save />} Update Leave
          </button>
          <button type="button" onClick={() => navigate("/leaves")} className="cancel-btn">
            <X /> Cancel
          </button>
        </div>
      </form>

      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Employee Info</h3>
        <p>Name: {leave?.employeeName}</p>
        <p>Applied: {new Date(leave?.appliedDate).toLocaleDateString()}</p>
        <p>ID: #{leave?.id}</p>
      </aside>
    </div>
  );
};

export default EditLeave;
