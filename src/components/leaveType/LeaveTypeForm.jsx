import React, { useState, useEffect } from "react";
import { Save, X, AlertTriangle, Info, Settings, Plus, Calendar } from "lucide-react";
import "./LeaveTypeForm.css";

const LeaveTypeForm = ({ onSubmit, onCancel, initialData = {}, mode = "create", loading = false }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    maxDaysPerYear: initialData.maxDaysPerYear || "",
    color: initialData.color || "#3b82f6",
    isActive: initialData.isActive ?? true,
    requiresApproval: initialData.requiresApproval ?? true,
    carryForward: initialData.carryForward ?? false,
    category: initialData.category || "general",
    priority: initialData.priority || "medium"
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    { value: "general", label: "General Leave", icon: "📋" },
    { value: "medical", label: "Medical Leave", icon: "🏥" },
    { value: "vacation", label: "Vacation Leave", icon: "🏖️" },
    { value: "personal", label: "Personal Leave", icon: "👤" },
    { value: "emergency", label: "Emergency Leave", icon: "🚨" },
    { value: "maternity", label: "Maternity Leave", icon: "👶" },
    { value: "paternity", label: "Paternity Leave", icon: "👨‍👶" }
  ];

  const colorOptions = ["#3b82f6","#ef4444","#10b981","#f59e0b","#8b5cf6","#ec4899","#06b6d4","#84cc16","#f97316","#6366f1","#14b8a6","#f43f5e"];
  const priorityOptions = [{value:"high",label:"High Priority"},{value:"medium",label:"Medium Priority"},{value:"low",label:"Low Priority"}];

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) setFormData(prev => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Leave type name is required";
    else if (formData.name.length < 2) newErrors.name = "Name must be at least 2 characters";
    else if (formData.name.length > 50) newErrors.name = "Name must be less than 50 characters";

    if (formData.description.length > 500) newErrors.description = "Description must be less than 500 characters";

    if (formData.maxDaysPerYear) {
      const max = parseInt(formData.maxDaysPerYear);
      if (isNaN(max) || max < 1 || max > 365) newErrors.maxDaysPerYear = "Max days must be 1–365";
    }

    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, maxDaysPerYear: formData.maxDaysPerYear ? parseInt(formData.maxDaysPerYear) : null });
    } catch {
      setErrors({ submit: "Failed to save leave type. Try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => setFormData({
    name: "", description: "", maxDaysPerYear: "", color: "#3b82f6",
    isActive: true, requiresApproval: true, carryForward: false,
    category: "general", priority: "medium"
  });

  const selectedCategory = categories.find(c => c.value === formData.category);

  return (
    <div className="leave-form">
      <div className="header">
        <div className="title">
          <Plus /> {mode === "create" ? "Create New Leave Type" : "Edit Leave Type"}
        </div>
        {onCancel && <button className="cancel-btn" onClick={onCancel}><X /></button>}
      </div>

      <form className="form-body" onSubmit={handleSubmit}>
        {errors.submit && <div className="error-banner"><AlertTriangle />{errors.submit}</div>}

        <div className="main-grid">
          <div className="left-column">
            <div className="section">
              <h3><Info /> Basic Info</h3>

              <label>Name *</label>
              <input type="text" value={formData.name} onChange={e => handleChange("name", e.target.value)} />
              {errors.name && <p className="error">{errors.name}</p>}

              <label>Category</label>
              <select value={formData.category} onChange={e => handleChange("category", e.target.value)}>
                {categories.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
              </select>

              <label>Priority</label>
              <select value={formData.priority} onChange={e => handleChange("priority", e.target.value)}>
                {priorityOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>

              <label>Max Days Per Year <Calendar /></label>
              <input type="number" value={formData.maxDaysPerYear} onChange={e => handleChange("maxDaysPerYear", e.target.value)} min="1" max="365" />
              {errors.maxDaysPerYear && <p className="error">{errors.maxDaysPerYear}</p>}

              <label>Color</label>
              <input type="color" value={formData.color} onChange={e => handleChange("color", e.target.value)} />
              <div className="color-options">
                {colorOptions.map(c => (
                  <button key={c} type="button" style={{ backgroundColor: c }} className={formData.color===c?"selected":""} onClick={() => handleChange("color", c)} />
                ))}
              </div>

              <label>Description</label>
              <textarea value={formData.description} onChange={e => handleChange("description", e.target.value)} />
              {errors.description && <p className="error">{errors.description}</p>}
            </div>

            <div className="section">
              <button type="button" className="advanced-btn" onClick={() => setShowAdvanced(!showAdvanced)}><Settings /> Advanced Settings</button>
              {showAdvanced && (
                <div className="advanced-options">
                  <label><input type="checkbox" checked={formData.requiresApproval} onChange={e => handleChange("requiresApproval", e.target.checked)} /> Requires Approval</label>
                  <label><input type="checkbox" checked={formData.carryForward} onChange={e => handleChange("carryForward", e.target.checked)} /> Allow Carry Forward</label>
                  <label><input type="checkbox" checked={formData.isActive} onChange={e => handleChange("isActive", e.target.checked)} /> Active</label>
                </div>
              )}
            </div>
          </div>

          <div className="right-column">
            <div className="preview">
              <h3>Preview</h3>
              <div className="card">
                <div className="card-header"><div className="color-dot" style={{ backgroundColor: formData.color }} />{formData.name || "Leave Name"}</div>
                <p>{selectedCategory?.icon} {selectedCategory?.label}</p>
                {formData.description && <p>{formData.description}</p>}
                <div>Max Days: {formData.maxDaysPerYear || "Unlimited"}</div>
                <div>Priority: {formData.priority}</div>
                <div>Approval: {formData.requiresApproval?"Required":"Not Required"}</div>
                <div>Status: {formData.isActive?"Active":"Inactive"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          {mode==="edit" && <button type="button" onClick={resetForm}>Reset Changes</button>}
          {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
          <button type="submit" disabled={isSubmitting || loading}>{isSubmitting ? (mode==="create"?"Creating...":"Updating...") : (mode==="create"?"Create Leave Type":"Update Leave Type")}</button>
        </div>
      </form>
    </div>
  );
};

export default LeaveTypeForm;
