// src/pages/auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from "lucide-react";
import { login } from "../../api/authApi"; // Named import
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (name, value) => {
    const newErrors = { ...errors };
    if (name === "email") {
      if (!value) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = "Invalid email address";
      else delete newErrors.email;
    }
    if (name === "password") {
      if (!value) newErrors.password = "Password is required";
      else if (value.length < 6) newErrors.password = "Password must be 6+ characters";
      else delete newErrors.password;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate("email", form.email) || !validate("password", form.password)) return;

    setIsSubmitting(true);
    try {
      const data = await login(form);
      // Save token and user info for ProtectedRoute
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ email: data.email, role: data.role }));
      navigate("/dashboard");
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Invalid credentials" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <User className="user-icon" />
          <h1>Welcome Back</h1>
          <p>Please sign in to your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {errors.submit && <div className="submit-error"><AlertCircle /> {errors.submit}</div>}

          <InputField label="Email Address" name="email" value={form.email} error={errors.email} onChange={handleChange} />
          <PasswordField
            label="Password"
            name="password"
            value={form.password}
            error={errors.password}
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
            onChange={handleChange}
          />

          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <button className="link-btn" onClick={() => navigate("/register")}>Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, error, onChange }) => (
  <div className="input-group">
    <label>{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} className={error ? "error" : ""} />
    {error && <span className="error-text">{error}</span>}
  </div>
);

const PasswordField = ({ label, name, value, error, show, toggle, onChange }) => (
  <div className="input-group">
    <label>{label}</label>
    <div className="password-wrapper">
      <input type={show ? "text" : "password"} name={name} value={value} onChange={onChange} className={error ? "error" : ""} />
      <span className="toggle-password" onClick={toggle}>{show ? <EyeOff /> : <Eye />}</span>
    </div>
    {error && <span className="error-text">{error}</span>}
  </div>
);

export default LoginPage;
