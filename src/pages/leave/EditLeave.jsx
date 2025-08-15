import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, FileText, User, CheckCircle, AlertCircle, Loader2, Save, X } from "lucide-react";
import leaveApi from "../../api/leaveApi";
import "./EditLeave.css";

const leaveTypes = [
  { value: "vacation", label: "Vacation", color: "bg-blue-100 text-blue-800", icon: "🏖️" },
  { value: "sick", label: "Sick Leave", color: "bg-red-100 text-red-800", icon: "🏥" },
  { value: "personal", label: "Personal", color: "bg-purple-100 text-purple-800", icon: "👤" },
  { value: "emergency", label: "Emergency", color: "bg-orange-100 text-orange-800", icon: "🚨" },
  { value: "maternity", label: "Maternity", color: "bg-pink-100 text-pink-800", icon: "🍼" },
  { value: "paternity", label: "Paternity", color: "bg-green-100 text-green-800", icon: "👶" }
];

export default function EditLeave() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  // Fetch leave by ID
  useEffect(() => {
    (async () => {
      try {
        const res = await leaveApi.getById(id);
        setLeave(res.data);
        setFormData({
          leaveType: res.data.leaveType,
          startDate: res.data.startDate,
          endDate: res.data.endDate,
          reason: res.data.reason
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await leaveApi.update(id, formData);
      setShowSuccess(true);
      setTimeout(() => navigate("/leaves"), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const diffTime = Math.abs(new Date(formData.endDate) - new Date(formData.startDate));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "approved": return "status-approved";
      case "rejected": return "status-rejected";
      case "pending": return "status-pending";
      default: return "status-default";
    }
  };

  if (loading) return <div className="loading-screen">Loading leave details...</div>;
  if (showSuccess) return <div className="success-screen">Leave Updated Successfully!</div>;

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

      <form onSubmit={handleSubmit} className="leave-form">
        {/* Leave Type */}
        <div className="leave-type-section">
          {leaveTypes.map((type) => (
            <button
              type="button"
              key={type.value}
              onClick={() => handleChange("leaveType", type.value)}
              className={`leave-type-btn ${formData.leaveType === type.value ? "active" : ""}`}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>

        {/* Dates */}
        <div className="date-section">
          <label>Start Date</label>
          <input type="date" value={formData.startDate} onChange={(e) => handleChange("startDate", e.target.value)} required />
          <label>End Date</label>
          <input type="date" value={formData.endDate} onChange={(e) => handleChange("endDate", e.target.value)} required />
        </div>

        {calculateDays() > 0 && (
          <div className="duration">
            <Clock size={18} /> Duration: {calculateDays()} days
          </div>
        )}

        {/* Reason */}
        <textarea
          value={formData.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          placeholder="Reason for leave"
          required
        />

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
}
