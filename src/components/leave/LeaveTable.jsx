import React, { useState, useMemo } from "react";
import { 
  Search, Filter, Eye, Edit, MoreHorizontal, Calendar,
  CheckCircle, XCircle, Clock, AlertCircle,
  ChevronDown, ChevronUp, Download
} from "lucide-react";
import "./LeaveTable.css"; // Import CSS

const LeaveTable = ({ leaves = [], onSelectLeave, onViewLeave, onEditLeave }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortField, setSortField] = useState("appliedDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedLeaves, setSelectedLeaves] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const getStatusIcon = (status) => ({
    approved: <CheckCircle className="icon-green" />,
    rejected: <XCircle className="icon-red" />,
    pending: <Clock className="icon-yellow" />
  })[status?.toLowerCase()] || <AlertCircle className="icon-gray" />;

  const getStatusBadge = (status) => `badge badge-${status?.toLowerCase() || "gray"}`;

  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { month:"short", day:"2-digit", year:"numeric" });
  const calculateDays = (start, end) => Math.ceil((new Date(end) - new Date(start)) / (1000*60*60*24)) + 1;

  const filteredAndSortedLeaves = useMemo(() => {
    let filtered = leaves.filter(l =>
      (l.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.leaveType?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || l.status === statusFilter) &&
      (typeFilter === "All" || l.leaveType === typeFilter)
    );

    filtered.sort((a, b) => {
      let aVal = sortField.includes("Date") ? new Date(a[sortField]) : a[sortField];
      let bVal = sortField.includes("Date") ? new Date(b[sortField]) : b[sortField];
      return sortDirection === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return filtered;
  }, [leaves, searchTerm, statusFilter, typeFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
  };

  const toggleSelectAll = (checked) => {
    setSelectedLeaves(checked ? new Set(filteredAndSortedLeaves.map(l => l.id)) : new Set());
  };

  const toggleSelectLeave = (id, checked) => {
    const newSet = new Set(selectedLeaves);
    checked ? newSet.add(id) : newSet.delete(id);
    setSelectedLeaves(newSet);
  };

  const uniqueStatuses = [...new Set(leaves.map(l => l.status))];
  const uniqueTypes = [...new Set(leaves.map(l => l.leaveType))];

  return (
    <div className="leave-table">
      <div className="header">
        <h2><Calendar /> Leave Requests</h2>
        <div>{filteredAndSortedLeaves.length} of {leaves.length} requests {selectedLeaves.size>0 && `• ${selectedLeaves.size} selected`}</div>
        <div className="header-actions">
          <button onClick={()=>setShowFilters(!showFilters)}><Filter /> Filters {showFilters ? <ChevronUp /> : <ChevronDown />}</button>
          <button><Download /> Export</button>
        </div>
      </div>

      <div className="search-filters">
        <div className="search">
          <Search /> <input placeholder="Search..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
        </div>
        {showFilters && (
          <div className="filters">
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              {uniqueStatuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
              <option value="All">All Types</option>
              {uniqueTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        )}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" checked={selectedLeaves.size===filteredAndSortedLeaves.length && filteredAndSortedLeaves.length>0} onChange={e=>toggleSelectAll(e.target.checked)} /></th>
              <th onClick={()=>handleSort('id')}>ID</th>
              <th onClick={()=>handleSort('employeeName')}>Employee</th>
              <th>Type</th>
              <th>Status</th>
              <th onClick={()=>handleSort('startDate')}>Duration</th>
              <th>Applied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedLeaves.length===0 ? (
              <tr><td colSpan="8" className="empty">No leave requests found</td></tr>
            ) : filteredAndSortedLeaves.map(leave => (
              <tr key={leave.id}>
                <td><input type="checkbox" checked={selectedLeaves.has(leave.id)} onChange={e=>toggleSelectLeave(leave.id, e.target.checked)} /></td>
                <td>{leave.id}</td>
                <td>{leave.employeeName}</td>
                <td>{leave.leaveType}</td>
                <td className={getStatusBadge(leave.status)}>{getStatusIcon(leave.status)} {leave.status}</td>
                <td>{formatDate(leave.startDate)} - {formatDate(leave.endDate)} ({calculateDays(leave.startDate, leave.endDate)} days)</td>
                <td>{formatDate(leave.appliedDate)}</td>
                <td className="actions">
                  <button onClick={()=>onViewLeave(leave)} title="View"><Eye /></button>
                  <button onClick={()=>onEditLeave(leave)} title="Edit"><Edit /></button>
                  <button onClick={()=>onSelectLeave(leave)} title="More"><MoreHorizontal /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLeaves.size>0 && (
        <div className="bulk-actions">
          <span>{selectedLeaves.size} selected</span>
          <button>Approve Selected</button>
          <button>Reject Selected</button>
        </div>
      )}
    </div>
  );
};

export default LeaveTable;
