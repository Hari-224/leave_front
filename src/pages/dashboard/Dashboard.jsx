import React, { useState } from 'react';
import './Dashboard.css';
import {
  Calendar, Clock, Users, FileText, Settings, Bell, User, LogOut,
  Menu, X, CheckCircle, XCircle, AlertCircle, Plus, BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const [role, setRole] = useState('admin');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [page, setPage] = useState('overview');

  const user = {
    name: 'John Doe',
    email: 'john@company.com',
    role: role.charAt(0).toUpperCase() + role.slice(1),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
  };

  const stats = {
    admin: { totalLeaves: 156, pendingApprovals: 23, approvedToday: 8, rejectedToday: 2, activeEmployees: 45 },
    manager: { teamLeaves: 24, pendingApprovals: 7, teamSize: 12, approvedThisWeek: 5 },
    employee: { totalLeaves: 12, usedLeaves: 8, remainingLeaves: 4, pendingRequests: 1 }
  };

  const navItems = {
    admin: [
      { icon: FileText, label: 'All Leaves', path: 'leaves' },
      { icon: Users, label: 'Employees', path: 'employees' },
      { icon: Settings, label: 'Leave Types', path: 'leave-types' },
      { icon: BarChart3, label: 'Reports', path: 'reports' }
    ],
    manager: [
      { icon: FileText, label: 'Team Leaves', path: 'team-leaves' },
      { icon: Users, label: 'My Team', path: 'team' },
      { icon: CheckCircle, label: 'Approvals', path: 'approvals' }
    ],
    employee: [
      { icon: FileText, label: 'My Leaves', path: 'my-leaves' },
      { icon: Plus, label: 'Request Leave', path: 'request-leave' }
    ]
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="stat-card">
      <div className={`stat-icon ${color}-bg`}>
        <Icon className={`${color}-text`} />
      </div>
      <div>
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
        {subtitle && <p className="stat-sub">{subtitle}</p>}
      </div>
    </div>
  );

  const RoleContent = () => {
    if (page !== 'overview') return <div className="page-placeholder">{page.toUpperCase()} PAGE</div>;
    if (role === 'admin') {
      return (
        <div className="grid">
          <StatCard icon={FileText} title="Total Leave Requests" value={stats.admin.totalLeaves} subtitle="This month" color="blue" />
          <StatCard icon={Clock} title="Pending Approvals" value={stats.admin.pendingApprovals} subtitle="Requires action" color="yellow" />
          <StatCard icon={CheckCircle} title="Approved Today" value={stats.admin.approvedToday} color="green" />
          <StatCard icon={Users} title="Active Employees" value={stats.admin.activeEmployees} color="purple" />
        </div>
      );
    }
    if (role === 'manager') {
      return (
        <div className="grid">
          <StatCard icon={Users} title="Team Size" value={stats.manager.teamSize} color="blue" />
          <StatCard icon={FileText} title="Team Leaves" value={stats.manager.teamLeaves} subtitle="This month" color="purple" />
          <StatCard icon={Clock} title="Pending Approvals" value={stats.manager.pendingApprovals} subtitle="Requires action" color="yellow" />
          <StatCard icon={CheckCircle} title="Approved This Week" value={stats.manager.approvedThisWeek} color="green" />
        </div>
      );
    }
    if (role === 'employee') {
      return (
        <div className="grid">
          <StatCard icon={FileText} title="Total Leaves" value={stats.employee.totalLeaves} subtitle="This year" color="blue" />
          <StatCard icon={CheckCircle} title="Used Leaves" value={stats.employee.usedLeaves} color="green" />
          <StatCard icon={Calendar} title="Remaining" value={stats.employee.remainingLeaves} color="purple" />
          <StatCard icon={Clock} title="Pending" value={stats.employee.pendingRequests} color="yellow" />
        </div>
      );
    }
  };

  return (
    <div className="dashboard">
      <div className="role-switch">
        {['admin', 'manager', 'employee'].map(r => (
          <button key={r} onClick={() => { setRole(r); setPage('overview'); }} className={role === r ? 'active' : ''}>
            {r}
          </button>
        ))}
      </div>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Calendar className="logo" /> LeaveHub
          <X onClick={() => setSidebarOpen(false)} className="close-btn" />
        </div>
        <nav>
          <button onClick={() => setPage('overview')} className={page === 'overview' ? 'active' : ''}>
            <BarChart3 /> Overview
          </button>
          {navItems[role].map(item => (
            <button key={item.path} onClick={() => setPage(item.path)} className={page === item.path ? 'active' : ''}>
              <item.icon /> {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <img src={user.avatar} alt={user.name} />
          <div>
            <p>{user.name}</p>
            <small>{user.role}</small>
          </div>
          <button onClick={() => alert('Logout')}><LogOut /> Logout</button>
        </div>
      </aside>

      <header>
        <Menu onClick={() => setSidebarOpen(true)} className="menu-icon" />
        <div className="header-right">
          <button className="notif-btn">
            <Bell />
            {notifications > 0 && <span>{notifications}</span>}
          </button>
          <img src={user.avatar} alt={user.name} className="avatar" />
          <span>{user.name}</span>
        </div>
      </header>

      <main>
        <RoleContent />
      </main>
    </div>
  );
};

export default Dashboard;
