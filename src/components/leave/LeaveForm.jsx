import React, { useState, useEffect } from "react";
import { Calendar, Clock, User, FileText, Send, AlertCircle, CheckCircle } from "lucide-react";
import "./LeaveForm.css";

const LEAVE_TYPES = [
  "Annual Leave",
  "Sick Leave",
  "Personal Leave",
  "Maternity/Paternity Leave",
  "Emergency Leave",
  "Unpaid Leave"
];

const LeaveForm = ({ onSubmit = (data) => console.log(data), initialData = {} }) => {
  const [form, setForm] = useState({
    leaveType: initialData.leaveType || LEAVE_TYPES[0],
    startDate: initialData.startDate || "",
    endDate: initialData.endDate || "",
    reason: initialData.reason || "",
    emergencyContact: initialData.emergencyContact || "",
    handoverNotes: initialData.handoverNotes || ""
  });

  const [errors, setErrors] = useState({});
  const [totalDays, setTotalDays] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (form.startDate && form.endDate) {
      const diff = Math.ceil((new Date(form.endDate) - new Date(form.startDate)) / (1000*60*60*24)) + 1;
      setTotalDays(diff > 0 ? diff : 0);
    } else setTotalDays(0);
  }, [form.startDate, form.endDate]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    if (!form.reason.trim()) newErrors.reason = "Reason is required";
    if (form.startDate && form.endDate) {
      if (new Date(form.startDate) > new Date(form.endDate)) newErrors.endDate = "End date must be after start date";
      if (new Date(form.startDate) < new Date().setHours(0,0,0,0)) newErrors.startDate = "Start date cannot be in the past";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({ ...form, totalDays, submittedAt: new Date().toISOString() });
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({
          leaveType: LEAVE_TYPES[0],
          startDate: "",
          endDate: "",
          reason: "",
          emergencyContact: "",
          handoverNotes: ""
        });
        setTotalDays(0);
      }, 2000);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="leave-form-container submitted">
        <div className="success-icon"><CheckCircle className="icon" /></div>
        <h3>Request Submitted!</h3>
        <p>Your leave request has been submitted successfully and is pending approval.</p>
      </div>
    );
  }

  return (
    <form className="leave-form-container" onSubmit={handleSubmit}>
      <h2 className="form-title"><Calendar className="icon" /> Leave Request Form</h2>

      <div className="form-group">
        <label><User className="icon-small" /> Leave Type *</label>
        <select name="leaveType" value={form.leaveType} onChange={handleChange}>
          {LEAVE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      <div className="date-grid">
        <div className="form-group">
          <label><Calendar className="icon-small" /> Start Date *</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={errors.startDate ? 'error' : ''} />
          {errors.startDate && <p className="error-text"><AlertCircle className="icon-small" /> {errors.startDate}</p>}
        </div>

        <div className="form-group">
          <label><Calendar className="icon-small" /> End Date *</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className={errors.endDate ? 'error' : ''} />
          {errors.endDate && <p className="error-text"><AlertCircle className="icon-small" /> {errors.endDate}</p>}
        </div>
      </div>

      {totalDays > 0 && (
        <div className="total-days"><Clock className="icon-small" /> Total Duration: {totalDays} day{totalDays !== 1 ? 's' : ''}</div>
      )}

      <div className="form-group">
        <label><FileText className="icon-small" /> Reason for Leave *</label>
        <textarea name="reason" value={form.reason} onChange={handleChange} rows="3" className={errors.reason ? 'error' : ''}></textarea>
        {errors.reason && <p className="error-text"><AlertCircle className="icon-small" /> {errors.reason}</p>}
      </div>

      <div className="form-group">
        <label>Emergency Contact (Optional)</label>
        <input type="text" name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Name and phone number" />
      </div>

      <div className="form-group">
        <label>Work Handover Notes (Optional)</label>
        <textarea name="handoverNotes" value={form.handoverNotes} onChange={handleChange} rows="3" placeholder="Information for colleagues covering your responsibilities..."></textarea>
      </div>

      <button type="submit" disabled={isSubmitting} className="submit-btn">
        {isSubmitting ? <div className="spinner"></div> : <Send className="icon-small" />} Submit Leave Request
      </button>
    </form>
  );
};

export default LeaveForm;
