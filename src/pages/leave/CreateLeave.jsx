// src/pages/leaves/CreateLeave.jsx
import React, { useState, useEffect } from 'react';
import './CreateLeave.css';
import { 
  Calendar, Clock, FileText, Send, ArrowLeft, 
  AlertCircle, CheckCircle, User 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';

// Helper to calculate leave days
const calculateDays = ({ startDate, endDate, halfDay }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  if (diffTime < 0) return 0;
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return halfDay ? days - 0.5 : days;
};

const CreateLeave = () => {
  const { user, token } = useAuth();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    halfDay: false,
    emergencyContact: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch leave types from backend
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const res = await api.get("/leave-types");
        setLeaveTypes(res.data);
        setForm(prev => ({ ...prev, leaveType: res.data[0]?.name || "" }));
      } catch (err) {
        console.error("Failed to fetch leave types", err);
        alert("Failed to load leave types");
      }
    };
    fetchLeaveTypes();
  }, []);

  const validateForm = () => {
    const errs = {};
    if (!form.startDate) errs.startDate = "Start date is required";
    if (!form.endDate) errs.endDate = "End date is required";
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
      errs.endDate = "End date cannot be before start date";
    }
    if (!form.reason.trim()) errs.reason = "Reason is required";
    if (form.leaveType.toLowerCase().includes("emergency") && !form.emergencyContact.trim()) {
      errs.emergencyContact = "Emergency contact is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await api.post("/leave-applications", {
        userId: user.id,
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
        halfDay: form.halfDay,
        emergencyContact: form.emergencyContact || null
      });
      setShowSuccess(true);
      setTimeout(() => {
        setForm({
          leaveType: leaveTypes[0]?.name || "",
          startDate: "",
          endDate: "",
          reason: "",
          halfDay: false,
          emergencyContact: ""
        });
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Leave submission error:", err);
      alert(err.response?.data?.message || "Failed to submit leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="container">
        <div className="card text-center success-card">
          <CheckCircle size={48} className="text-green-600 mx-auto" />
          <h2>Leave Request Submitted Successfully!</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="back-btn" onClick={() => console.log("Back to dashboard")}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="card user-card flex items-center space-x-4 mb-6">
        <User size={32} />
        <div>
          <h3>{user.name}</h3>
          <p>ID: {user.employeeId} • {user.department}</p>
          <p>Manager: {user.manager}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card leave-form">
        <label>Leave Type</label>
        <select name="leaveType" value={form.leaveType} onChange={handleChange} className="select">
          {leaveTypes.map(type => (
            <option key={type.id} value={type.name}>{type.name}</option>
          ))}
        </select>

        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className={`input ${errors.startDate ? "error" : ""}`}
        />
        {errors.startDate && <p className="error-text"><AlertCircle size={16} /> {errors.startDate}</p>}

        <label>End Date</label>
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className={`input ${errors.endDate ? "error" : ""}`}
        />
        {errors.endDate && <p className="error-text"><AlertCircle size={16} /> {errors.endDate}</p>}

        <label>Reason</label>
        <textarea
          name="reason"
          rows={4}
          value={form.reason}
          onChange={handleChange}
          className={`textarea ${errors.reason ? "error" : ""}`}
        />
        {errors.reason && <p className="error-text"><AlertCircle size={16} /> {errors.reason}</p>}

        {form.leaveType.toLowerCase().includes("emergency") && (
          <>
            <label>Emergency Contact</label>
            <input
              name="emergencyContact"
              value={form.emergencyContact}
              onChange={handleChange}
              className={`input ${errors.emergencyContact ? "error" : ""}`}
            />
            {errors.emergencyContact && <p className="error-text"><AlertCircle size={16} /> {errors.emergencyContact}</p>}
          </>
        )}

        {form.startDate && form.endDate && (
          <div className="duration">
            <Clock size={20} /> Total Duration: {calculateDays(form)} day(s)
          </div>
        )}

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => console.log("Cancel")}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLeave;
