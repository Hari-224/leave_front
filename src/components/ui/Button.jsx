import React from "react";
import { Loader2 } from "lucide-react";
import "./Button.css"; // Import the CSS

const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) onClick(e);
  };

  const renderIcon = (position) => {
    if (loading && position === "left") return <Loader2 className="spinner mr-2" />;
    if (icon && iconPosition === position)
      return React.cloneElement(icon, { className: `icon ${position === "left" ? "mr-2" : "ml-2"}` });
    return null;
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`btn ${variant} ${size} ${fullWidth ? "full" : ""} ${className}`}
      {...props}
    >
      {renderIcon("left")}
      <span className={loading ? "opacity-70" : ""}>{children}</span>
      {renderIcon("right")}
    </button>
  );
};

// Specialized variants
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const LinkButton = (props) => <Button variant="link" {...props} />;
export const GradientButton = (props) => <Button variant="gradient" {...props} />;

// Button group
export const ButtonGroup = ({ children, className = "", orientation = "horizontal" }) => {
  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) return child;
    const isFirst = index === 0;
    const isLast = index === React.Children.count(children) - 1;
    let additionalClass = "";
    if (orientation === "horizontal") additionalClass = !isFirst ? "-ml-px" : "";
    else additionalClass = !isFirst ? "-mt-px" : "";
    return React.cloneElement(child, { className: `${child.props.className || ""} ${additionalClass}`.trim() });
  });

  return <div className={`btn-group ${orientation} ${className}`}>{childrenWithProps}</div>;
};

export default Button;
