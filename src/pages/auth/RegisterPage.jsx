// src/pages/auth/RegisterPage.jsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/authApi"; // your API call
import "./RegisterPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getStrengthColor = () =>
    passwordStrength < 50 ? "red" : passwordStrength < 75 ? "orange" : "green";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") setPasswordStrength(calculatePasswordStrength(value));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (form.confirmPassword !== form.password) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: "EMPLOYEE", // send default role
      });

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed";
      setErrors({ submit: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {errors.submit && <p className="submit-error">{errors.submit}</p>}

        <InputField
          label="Name"
          name="name"
          value={form.name}
          error={errors.name}
          onChange={handleChange}
        />
        <InputField
          label="Email"
          name="email"
          value={form.email}
          error={errors.email}
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
          getStrengthColor={getStrengthColor}
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

        <button type="submit" className="btn-register" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

// Reusable input field
const InputField = ({ label, name, value, error, onChange }) => (
  <div className="input-group">
    <label>{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className={error ? "error" : ""}
    />
    {error && <span className="error-message">{error}</span>}
  </div>
);

// Reusable password field
const PasswordField = ({ label, name, value, error, show, toggle, onChange, strength, getStrengthColor }) => (
  <div className="input-group">
    <label>{label}</label>
    <div className="password-wrapper">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={error ? "error" : ""}
      />
      <span className="toggle-password" onClick={toggle}>
        {show ? <EyeOff /> : <Eye />}
      </span>
    </div>
    {strength !== undefined && value && (
      <div
        className="password-strength"
        style={{ width: `${strength}%`, backgroundColor: getStrengthColor() }}
      />
    )}
    {error && <span className="error-message">{error}</span>}
  </div>
);

export default RegisterPage;
