import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar, Clock, Users, FileText, Settings, Bell, LogOut, Menu, X,
  CheckCircle, BarChart3, Plus
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import "./Dashboard.css";

const Dashboard = () => {
  const { user: authUser, token, logout } = useAuth();
  const [role, setRole] = useState(authUser?.role?.toLowerCase() || "admin");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [page, setPage] = useState("overview");
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Memoized fetchStats to prevent useEffect warnings
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      if (role === "admin") {
        const leavesRes = await api.get("/leaves");
        const leaves = leavesRes.data || [];
        const pending = leaves.filter(l => l.status === "PENDING").length;
        const approvedToday = leaves.filter(l =>
          l.approvedDate && new Date(l.approvedDate).toDateString() === new Date().toDateString()
        ).length;
        const employeesRes = await api.get("/users");
        setStats({
          totalLeaves: leaves.length,
          pendingApprovals: pending,
          approvedToday,
          activeEmployees: employeesRes.data?.length || 0,
        });
      } else if (role === "manager") {
        const teamLeavesRes = await api.get(`/leaves/team/${authUser?.id}`);
        const teamLeaves = teamLeavesRes.data || [];
        const pending = teamLeaves.filter(l => l.status === "PENDING").length;
        const approvedThisWeek = teamLeaves.filter(l => {
          if (!l.approvedDate) return false;
          const approvedDate = new Date(l.approvedDate);
          const today = new Date();
          const weekAgo = new Date();
          weekAgo.setDate(today.getDate() - 7);
          return approvedDate >= weekAgo && approvedDate <= today && l.status === "APPROVED";
        }).length;
        const teamRes = await api.get(`/users/team/${authUser?.id}`);
        setStats({
          teamLeaves: teamLeaves.length,
          pendingApprovals: pending,
          approvedThisWeek,
          teamSize: teamRes.data?.length || 0,
        });
      } else if (role === "employee") {
        const myLeavesRes = await api.get(`/leaves/user/${authUser?.id}`);
        const myLeaves = myLeavesRes.data || [];
        const pendingRequests = myLeaves.filter(l => l.status === "PENDING").length;
        const usedLeaves = myLeaves.filter(l => l.status === "APPROVED").length;
        setStats({
          totalLeaves: myLeaves.length,
          usedLeaves,
          remainingLeaves: 20 - usedLeaves,
          pendingRequests,
        });
      }

      const notifRes = await api.get("/notifications");
      setNotifications(notifRes.data?.length || 0);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      alert("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, [role, authUser?.id, api]);

  // Fetch stats whenever role changes
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const navItems = {
    admin: [
      { icon: FileText, label: "All Leaves", path: "leaves" },
      { icon: Users, label: "Employees", path: "employees" },
      { icon: Settings, label: "Leave Types", path: "leave-types" },
      { icon: BarChart3, label: "Reports", path: "reports" }
    ],
    manager: [
      { icon: FileText, label: "Team Leaves", path: "team-leaves" },
      { icon: Users, label: "My Team", path: "team" },
      { icon: CheckCircle, label: "Approvals", path: "approvals" }
    ],
    employee: [
      { icon: FileText, label: "My Leaves", path: "my-leaves" },
      { icon: Plus, label: "Request Leave", path: "request-leave" }
    ]
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="stat-card">
      <div className={`stat-icon ${color}-bg`}><Icon className={`${color}-text`} /></div>
      <div>
        <p className="stat-title">{title}</p>
        <p className="stat-value">{loading ? "..." : value}</p>
        {subtitle && <p className="stat-sub">{subtitle}</p>}
      </div>
    </div>
  );

  const RoleContent = () => {
    if (page !== "overview") return <div className="page-placeholder">{page.toUpperCase()} PAGE</div>;

    if (role === "admin") {
      return (
        <div className="grid">
          <StatCard icon={FileText} title="Total Leave Requests" value={stats.totalLeaves} subtitle="This month" color="blue" />
          <StatCard icon={Clock} title="Pending Approvals" value={stats.pendingApprovals} subtitle="Requires action" color="yellow" />
          <StatCard icon={CheckCircle} title="Approved Today" value={stats.approvedToday} color="green" />
          <StatCard icon={Users} title="Active Employees" value={stats.activeEmployees} color="purple" />
        </div>
      );
    }

    if (role === "manager") {
      return (
        <div className="grid">
          <StatCard icon={Users} title="Team Size" value={stats.teamSize} color="blue" />
          <StatCard icon={FileText} title="Team Leaves" value={stats.teamLeaves} subtitle="This month" color="purple" />
          <StatCard icon={Clock} title="Pending Approvals" value={stats.pendingApprovals} subtitle="Requires action" color="yellow" />
          <StatCard icon={CheckCircle} title="Approved This Week" value={stats.approvedThisWeek} color="green" />
        </div>
      );
    }

    if (role === "employee") {
      return (
        <div className="grid">
          <StatCard icon={FileText} title="Total Leaves" value={stats.totalLeaves} subtitle="This year" color="blue" />
          <StatCard icon={CheckCircle} title="Used Leaves" value={stats.usedLeaves} color="green" />
          <StatCard icon={Calendar} title="Remaining" value={stats.remainingLeaves} color="purple" />
          <StatCard icon={Clock} title="Pending" value={stats.pendingRequests} color="yellow" />
        </div>
      );
    }
  };

  return (
    <div className="dashboard">
      <div className="role-switch">
        {["admin", "manager", "employee"].map(r => (
          <button key={r} onClick={() => { setRole(r); setPage("overview"); }} className={role === r ? "active" : ""}>
            {r}
          </button>
        ))}
      </div>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Calendar className="logo" /> LeaveHub
          <X onClick={() => setSidebarOpen(false)} className="close-btn" />
        </div>
        <nav>
          <button onClick={() => setPage("overview")} className={page === "overview" ? "active" : ""}>
            <BarChart3 /> Overview
          </button>
          {navItems[role]?.map(item => (
            <button key={item.path} onClick={() => setPage(item.path)} className={page === item.path ? "active" : ""}>
              <item.icon /> {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <img src={authUser?.avatar || ""} alt={authUser?.name || "User"} />
          <div>
            <p>{authUser?.name || "User"}</p>
            <small>{role.charAt(0).toUpperCase() + role.slice(1)}</small>
          </div>
          <button onClick={logout}><LogOut /> Logout</button>
        </div>
      </aside>

      <header>
        <Menu onClick={() => setSidebarOpen(true)} className="menu-icon" />
        <div className="header-right">
          <button className="notif-btn">
            <Bell />
            {notifications > 0 && <span>{notifications}</span>}
          </button>
          <img src={authUser?.avatar || ""} alt={authUser?.name || "User"} className="avatar" />
          <span>{authUser?.name || "User"}</span>
        </div>
      </header>

      <main>
        <RoleContent />
      </main>
    </div>
  );
};

export default Dashboard;
