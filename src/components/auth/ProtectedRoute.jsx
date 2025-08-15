import React, { useState, useEffect } from "react";
import { Shield, Lock, AlertCircle, Loader2, UserX } from "lucide-react";
import "./ProtectedRoute.css";

// Mock auth hook - replace with your actual AuthContext
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const userData = localStorage.getItem('user_info');
        if (token && userData) {
          await new Promise(res => setTimeout(res, 800));
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (e) {
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return { user, loading, isAuthenticated };
};

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
      <button className="btn-danger" onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Sign Out</button>
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
  const { user, loading, isAuthenticated } = useAuth();
  const [unauthorized, setUnauthorized] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const redirect = (path) => window.location.href = path;

  // Track user activity
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    ["mousedown", "keydown", "scroll", "touchstart"].forEach(event =>
      document.addEventListener(event, updateActivity)
    );
    return () => {
      ["mousedown", "keydown", "scroll", "touchstart"].forEach(event =>
        document.removeEventListener(event, updateActivity)
      );
    };
  }, []);

  // Session timeout
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      const sessionDuration = sessionTimeoutMinutes * 60 * 1000;
      const timeRemaining = sessionDuration - (Date.now() - lastActivity);
      if (timeRemaining <= 30000 && timeRemaining > 0) setSessionWarning(true);
      else if (timeRemaining <= 0) logout();
      setTimeLeft(Math.floor(timeRemaining / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastActivity, isAuthenticated]);

  const hasRole = (userRole, required) => !required || userRole === required;

  const handleRetry = () => { setUnauthorized(false); window.location.reload(); };
  const extendSession = () => { setLastActivity(Date.now()); setSessionWarning(false); };
  const logout = () => { localStorage.clear(); redirect("/login"); };

  if (loading) return <AuthLoading />;
  if (!isAuthenticated || !user) { redirect(fallbackPath); return <AuthLoading />; }
  if (requiredRole && !hasRole(user.role, requiredRole)) return <Unauthorized requiredRole={requiredRole} userRole={user.role} onRetry={handleRetry} />;

  return (
    <>
      {children}
      {sessionWarning && <SessionWarning onExtend={extendSession} onLogout={logout} timeLeft={timeLeft} />}
    </>
  );
};

export default ProtectedRoute;
