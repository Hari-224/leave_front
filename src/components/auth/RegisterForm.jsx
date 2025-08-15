import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Shield, Zap } from "lucide-react";
import "./RegisterForm.css";

// Mock API - replace with real API call
const authApi = {
  register: async ({ name, email, password }) => {
    await new Promise(r => setTimeout(r, 1500));
    if (email === "existing@example.com") throw new Error("Email already exists");
    return { success: true };
  }
};

const RegisterForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case "name":
        if (!value.trim()) newErrors.name = "Full name required";
        else if (value.trim().length < 2) newErrors.name = "At least 2 characters";
        else delete newErrors.name;
        break;
      case "email":
        if (!value) newErrors.email = "Email required";
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = "Invalid email";
        else delete newErrors.email;
        break;
      case "password":
        if (!value) newErrors.password = "Password required";
        else if (value.length < 8) newErrors.password = "Min 8 characters";
        else delete newErrors.password;
        setPasswordStrength(calculateStrength(value));
        if (form.confirmPassword && value !== form.confirmPassword) newErrors.confirmPassword = "Passwords must match";
        else delete newErrors.confirmPassword;
        break;
      case "confirmPassword":
        if (value !== form.password) newErrors.confirmPassword = "Passwords must match";
        else delete newErrors.confirmPassword;
        break;
      default: break;
    }
    setErrors(newErrors);
  };

  const calculateStrength = password => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;
    return Math.min(strength, 100);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "red";
    if (passwordStrength < 60) return "yellow";
    if (passwordStrength < 80) return "blue";
    return "green";
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (Object.keys(errors).length || !form.name || !form.email || !form.password || !form.confirmPassword) return;
    setIsSubmitting(true);
    try {
      await authApi.register(form);
      setSuccess("Registration successful!");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
      setErrors({});
      setPasswordStrength(0);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="icon-circle"><Shield className="icon" /></div>
          <h1>Create Account</h1>
          <p>Join us and start managing your leaves</p>
        </div>

        {success && <div className="success-msg"><CheckCircle /> {success}</div>}
        {errors.submit && <div className="error-msg"><AlertCircle /> {errors.submit}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <InputField 
            label="Full Name" 
            name="name" 
            value={form.name} 
            error={errors.name} 
            icon={User} 
            onChange={handleChange} 
          />
          <InputField 
            label="Email" 
            name="email" 
            value={form.email} 
            error={errors.email} 
            icon={Mail} 
            onChange={handleChange} 
          />
          <PasswordField 
            label="Password" 
            name="password" 
            value={form.password} 
            error={errors.password} 
            show={showPassword} 
            toggle={() => setShowPassword(!showPassword)} 
            onChange={handleChange} 
            strength={passwordStrength} 
          />
          <PasswordField 
            label="Confirm Password" 
            name="confirmPassword" 
            value={form.confirmPassword} 
            error={errors.confirmPassword} 
            show={showConfirmPassword} 
            toggle={() => setShowConfirmPassword(!showConfirmPassword)} 
            onChange={handleChange} 
          />

          <button type="submit" disabled={isSubmitting || Object.keys(errors).length > 0} className="submit-btn">
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="footer-text">
          Already have an account? <button className="link-btn">Sign in here</button>
        </p>
      </div>
    </div>
  );
};

// Reusable Input Field
const InputField = ({ label, name, value, error, icon: Icon, onChange }) => (
  <div className="input-group">
    <label>{label}</label>
    <div className="input-wrapper">
      <Icon className={`input-icon ${error ? "text-red" : ""}`} />
      <input name={name} value={value} onChange={onChange} />
      {value && !error && <CheckCircle className="check-icon" />}
    </div>
    {error && <p className="input-error"><AlertCircle /> {error}</p>}
  </div>
);

// Reusable Password Field
const PasswordField = ({ label, name, value, error, show, toggle, onChange, strength }) => (
  <div className="input-group">
    <label>{label}</label>
    <div className="input-wrapper">
      <Lock className={`input-icon ${error ? "text-red" : ""}`} />
      <input type={show ? "text" : "password"} name={name} value={value} onChange={onChange} />
      <button type="button" onClick={toggle} className="toggle-btn">{show ? <EyeOff /> : <Eye />}</button>
      {value && !error && <CheckCircle className="check-icon" />}
    </div>
    {strength !== undefined && value && (
      <div className="password-strength" style={{ width: `${strength}%`, backgroundColor: getStrengthColor(strength) }} />
    )}
    {error && <p className="input-error"><AlertCircle /> {error}</p>}
  </div>
);

export default RegisterForm;
