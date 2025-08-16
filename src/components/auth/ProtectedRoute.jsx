// src/components/auth/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { AlertCircle, Loader2, UserX } from "lucide-react";
import { getToken, removeToken } from "../../utils/storage";
import { jwtDecode } from "jwt-decode"; // ✅ named import
import "./ProtectedRoute.css";

// Loading Screen
const AuthLoading = () => (
  <div className="protected-loading">
    <div className="card">
      <Loader2 className="icon-spin" />
      <h2>Authenticating</h2>
      <p>Please wait while we verify your access...</p>
    </div>
  </div>
);

// Unauthorized Access Screen
const Unauthorized = ({ requiredRole, userRole, onRetry }) => (
  <div className="protected-unauthorized">
    <div className="card">
      <UserX className="icon-large" />
      <h2>Access Denied</h2>
      <p>You don't have permission to access this resource.</p>
      {requiredRole && userRole && (
        <div className="role-info">
          <p>Required: <strong>{requiredRole}</strong></p>
          <p>Your role: <strong>{userRole}</strong></p>
        </div>
      )}
      <button className="btn-primary" onClick={onRetry}>Try Again</button>
      <button className="btn-secondary" onClick={() => window.history.back()}>Go Back</button>
      <button
        className="btn-danger"
        onClick={() => {
          removeToken();
          window.location.href = "/login";
        }}
      >
        Sign Out
      </button>
    </div>
  </div>
);

// Session Expiry Warning
const SessionWarning = ({ onExtend, onLogout, timeLeft }) => (
  <div className="session-warning">
    <div className="card">
      <AlertCircle className="icon-medium" />
      <h3>Session Expiring</h3>
      <p>Your session will expire in <strong>{timeLeft}</strong> seconds.</p>
      <button className="btn-primary" onClick={onExtend}>Extend Session</button>
      <button className="btn-secondary" onClick={onLogout}>Logout Now</button>
    </div>
  </div>
);

const ProtectedRoute = ({
  children,
  requiredRole = null,
  fallbackPath = "/login",
  sessionTimeoutMinutes = 30,
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const tokenData = getToken();
  const token = tokenData?.token;

  const redirect = (path) => (window.location.href = path);

  // Decode JWT to get user info
  useEffect(() => {
    if (!token) {
      redirect(fallbackPath);
      return;
    }

    try {
      const decoded = jwtDecode(token); // ✅ named import usage
      setUser({ email: decoded.email, role: decoded.role });
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Invalid token:", err);
      removeToken();
      redirect(fallbackPath);
    } finally {
      setLoading(false);
    }
  }, [token, fallbackPath]);

  // Track user activity
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    ["mousedown", "keydown", "scroll", "touchstart"].forEach(evt =>
      document.addEventListener(evt, updateActivity)
    );
    return () => {
      ["mousedown", "keydown", "scroll", "touchstart"].forEach(evt =>
        document.removeEventListener(evt, updateActivity)
      );
    };
  }, []);

  // Session timeout
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const sessionDuration = sessionTimeoutMinutes * 60 * 1000;
      const remaining = sessionDuration - (Date.now() - lastActivity);

      if (remaining <= 30000 && remaining > 0) setSessionWarning(true);
      else if (remaining <= 0) logout();

      setTimeLeft(Math.floor(Math.max(remaining / 1000, 0)));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity, isAuthenticated, sessionTimeoutMinutes]);

  // Role check
  const hasRole = (userRole, required) => {
    if (!required) return true;
    if (userRole === required) return true;
    const hierarchy = ["EMPLOYEE", "MANAGER", "ADMIN"];
    return hierarchy.indexOf(userRole) > hierarchy.indexOf(required);
  };

  const handleRetry = () => window.location.reload();

  const extendSession = () => {
    setLastActivity(Date.now());
    setSessionWarning(false);
  };

  const logout = () => {
    removeToken();
    redirect("/login");
  };

  if (loading) return <AuthLoading />;

  if (!isAuthenticated || !user) {
    redirect(fallbackPath);
    return <AuthLoading />;
  }

  if (requiredRole && !hasRole(user.role, requiredRole)) {
    return (
      <Unauthorized
        requiredRole={requiredRole}
        userRole={user.role}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <>
      {children}
      {sessionWarning && (
        <SessionWarning
          onExtend={extendSession}
          onLogout={logout}
          timeLeft={timeLeft}
        />
      )}
    </>
  );
};

export default ProtectedRoute;
