import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react";
import "./LoginForm.css";

const LoginForm = () => {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const validate = (name, value) => {
    const newErrors = { ...errors };
    if (name === "email") {
      if (!value) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = "Invalid email address";
      else delete newErrors.email;
    }
    if (name === "password") {
      if (!value) newErrors.password = "Password is required";
      else if (value.length < 6) newErrors.password = "Password must be 6+ chars";
      else delete newErrors.password;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (touched[name]) validate(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const emailValid = validate("email", form.email);
    const passwordValid = validate("password", form.password);
    if (!emailValid || !passwordValid) return setIsSubmitting(false);

    try {
      await login(form.email, form.password);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Invalid credentials" });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (errors.submit && (form.email || form.password)) {
      setErrors((prev) => ({ ...prev, submit: null }));
    }
  }, [form, errors.submit]);

  const isFormValid = form.email && form.password && Object.keys(errors).length === 0;

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-icon">
            <User className="user-icon" />
          </div>
          <h1>Welcome Back</h1>
          <p>Please sign in to your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {errors.submit && <div className="submit-error"><AlertCircle />{errors.submit}</div>}

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail className={`input-icon ${errors.email ? "error" : ""}`} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                disabled={isSubmitting || loading}
              />
              {form.email && !errors.email && <CheckCircle className="success-icon" />}
            </div>
            {errors.email && <p className="error-text"><AlertCircle /> {errors.email}</p>}
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock className={`input-icon ${errors.password ? "error" : ""}`} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                disabled={isSubmitting || loading}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="show-pass">
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <p className="error-text"><AlertCircle /> {errors.password}</p>}
          </div>

          <button type="submit" disabled={!isFormValid || isSubmitting || loading} className="submit-btn">
            {isSubmitting || loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <button className="link-btn">Sign up</button></p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
