import React, { useState } from 'react';
import './CreateLeave.css';
import { LEAVE_TYPES } from '../../utils/constants';
import { formatDate, isPastDate } from '../../utils/helpers';
import { 
  Calendar, Clock, FileText, Send, ArrowLeft, 
  AlertCircle, CheckCircle, User, Briefcase 
} from 'lucide-react';

// Temporary mock data for user – replace with actual context/API call
const MOCK_USER = {
  name: "John Doe",
  employeeId: "EMP123",
  department: "Engineering",
  manager: "Jane Smith"
};

// Helper function to calculate leave days
const calculateDays = ({ startDate, endDate }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end - start;
  return diffTime >= 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 : 0;
};

// Basic validation
const validateForm = (form) => {
  const errors = {};
  if (!form.startDate) errors.startDate = "Start date is required";
  if (!form.endDate) errors.endDate = "End date is required";
  if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
    errors.endDate = "End date cannot be before start date";
  }
  if (!form.reason.trim()) errors.reason = "Reason is required";
  if (form.leaveType === 'Emergency Leave' && !form.emergencyContact.trim()) {
    errors.emergencyContact = "Emergency contact is required";
  }
  return errors;
};

const CreateLeave = () => {
  const [form, setForm] = useState({
    leaveType: LEAVE_TYPES[0],
    startDate: "",
    endDate: "",
    reason: "",
    halfDay: false,
    emergencyContact: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm(form);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 2000)); // Simulated API call
    setShowSuccess(true);

    setTimeout(() => {
      setForm({ leaveType: LEAVE_TYPES[0], startDate: "", endDate: "", reason: "", halfDay: false, emergencyContact: "" });
      setShowSuccess(false);
    }, 3000);

    setIsSubmitting(false);
  };

  if (showSuccess) {
    return (
      <div className="container">
        <div className="card text-center">
          <CheckCircle size={48} className="text-green-600 mx-auto" />
          <h2>Request Submitted Successfully!</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <button className="flex items-center mb-4" onClick={() => console.log("Back to dashboard")}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="card mb-6 flex items-center space-x-4">
        <User />
        <div>
          <h3>{MOCK_USER.name}</h3>
          <p>ID: {MOCK_USER.employeeId} • {MOCK_USER.department}</p>
          <p>Manager: {MOCK_USER.manager}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <label>Leave Type</label>
        <select name="leaveType" className="select" value={form.leaveType} onChange={handleChange}>
          {LEAVE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
        </select>

        <label>Start Date</label>
        <input 
          type="date" 
          name="startDate" 
          className={`input ${errors.startDate && 'error'}`} 
          value={form.startDate} 
          onChange={handleChange} 
        />
        {errors.startDate && <p className="error-text"><AlertCircle size={16} /> {errors.startDate}</p>}

        <label>End Date</label>
        <input 
          type="date" 
          name="endDate" 
          className={`input ${errors.endDate && 'error'}`} 
          value={form.endDate} 
          onChange={handleChange} 
        />
        {errors.endDate && <p className="error-text"><AlertCircle size={16} /> {errors.endDate}</p>}

        <label>Reason</label>
        <textarea 
          name="reason" 
          rows={4} 
          className={`textarea ${errors.reason && 'error'}`} 
          value={form.reason} 
          onChange={handleChange} 
        />
        {errors.reason && <p className="error-text"><AlertCircle size={16} /> {errors.reason}</p>}

        {form.leaveType === 'Emergency Leave' && (
          <>
            <label>Emergency Contact</label>
            <input 
              name="emergencyContact" 
              className={`input ${errors.emergencyContact && 'error'}`} 
              value={form.emergencyContact} 
              onChange={handleChange} 
            />
            {errors.emergencyContact && <p className="error-text"><AlertCircle size={16} /> {errors.emergencyContact}</p>}
          </>
        )}

        {form.startDate && form.endDate && (
          <div className="flex items-center my-2">
            <Clock size={20} /> Total Duration: {calculateDays(form)} day(s)
          </div>
        )}

        <div className="flex justify-end space-x-4">
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
