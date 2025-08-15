import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, X, CheckCircle, AlertCircle } from "lucide-react";
import "./Input.css";

const Input = ({
  value, onChange, placeholder, type = "text", name,
  label, error, success, helperText, required = false,
  disabled = false, readOnly = false, autoFocus = false,
  variant = "default", size = "md", fullWidth = false,
  leftIcon, rightIcon, validation, showValidation = false,
  clearable = false, showPasswordToggle = false,
  maxLength, minLength,
  onFocus, onBlur, onClear,
  className = "", inputClassName = "",
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validState, setValidState] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => { if (autoFocus) inputRef.current?.focus(); }, [autoFocus]);
  useEffect(() => {
    if (validation && value && showValidation) setValidState(validation(value));
    else setValidState(null);
  }, [value, validation, showValidation]);

  const handleChange = (e) => onChange?.(e);
  const handleFocus = (e) => { setFocused(true); onFocus?.(e); };
  const handleBlur = (e) => { setFocused(false); onBlur?.(e); };
  const handleClear = () => {
    if (onClear) onClear();
    else handleChange({ target: { value: "", name } });
  };

  const getInputType = () => (type === "password" && showPasswordToggle ? (showPassword ? "text" : "password") : type);
  const getRightIcon = () => {
    if (type === "password" && showPasswordToggle)
      return <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff /> : <Eye />}</button>;
    if (clearable && value && !disabled && !readOnly)
      return <button type="button" onClick={handleClear}><X /></button>;
    if (validState === true || success) return <CheckCircle className="success-icon" />;
    if (validState === false || error) return <AlertCircle className="error-icon" />;
    if (rightIcon) return React.cloneElement(rightIcon, { className: "icon" });
    return null;
  };

  const inputClasses = [
    "input-base",
    variant,
    size,
    (leftIcon ? "pl-10" : ""),
    (getRightIcon() || rightIcon ? "pr-10" : ""),
    fullWidth ? "w-full" : "",
    inputClassName,
    (error || validState === false ? "error" : ""),
    (success || validState === true ? "success" : "")
  ].filter(Boolean).join(" ");

  return (
    <div className={`input-container ${fullWidth ? "w-full" : ""} ${className}`}>
      {label && <label className="input-label">{label}{required && <span className="required">*</span>}</label>}
      <div className="input-wrapper">
        {leftIcon && <div className="icon-left">{React.cloneElement(leftIcon, { className: "icon" })}</div>}
        <input
          ref={inputRef}
          type={getInputType()}
          value={value || ""}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          name={name}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          minLength={minLength}
          className={inputClasses}
          {...props}
        />
        {getRightIcon() && <div className="icon-right">{getRightIcon()}</div>}
      </div>
      <div className="input-helper">
        {error && <p className="error-text">{error}</p>}
        {success && !error && <p className="success-text">{success}</p>}
        {helperText && !error && !success && <p className="helper-text">{helperText}</p>}
        {maxLength && <p className="char-count">{(value || "").length}/{maxLength}</p>}
      </div>
    </div>
  );
};

export default Input;
