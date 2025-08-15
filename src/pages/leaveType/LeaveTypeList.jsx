import React, { useEffect, useState } from "react";
import { Plus, Trash2, Calendar, CheckCircle, AlertCircle, X } from "lucide-react";
import "./LeaveTypeList.css";

const leaveTypeApi = {
  getAll: () => Promise.resolve({ data: [
    { id: 1, name: "Annual Leave", count: 12 },
    { id: 2, name: "Sick Leave", count: 8 },
    { id: 3, name: "Personal Leave", count: 3 }
  ]}),
  create: (data) => Promise.resolve({ data: { id: Date.now(), ...data, count: 0 } }),
  remove: () => Promise.resolve({ success: true })
};

const Notification = ({ message, type, onClose }) => (
  <div className={`notification ${type}`}>
    {type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="close-notification"><X className="w-4 h-4" /></button>
  </div>
);

const LeaveTypeList = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNote = (msg, type = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    leaveTypeApi.getAll()
      .then(res => setLeaveTypes(res.data))
      .catch(() => showNote("Failed to fetch leave types", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    const name = newType.trim();
    if (!name) return showNote("Please enter a leave type name", "error");
    if (leaveTypes.some(t => t.name.toLowerCase() === name.toLowerCase()))
      return showNote("This leave type already exists", "error");

    setAdding(true);
    try {
      const res = await leaveTypeApi.create({ name });
      setLeaveTypes([...leaveTypes, res.data]);
      setNewType("");
      showNote(`"${name}" added successfully!`);
    } catch {
      showNote("Failed to add leave type", "error");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id, name) => {
    setDeletingId(id);
    try {
      await leaveTypeApi.remove(id);
      setLeaveTypes(leaveTypes.filter(t => t.id !== id));
      showNote(`"${name}" deleted successfully!`);
    } catch {
      showNote("Failed to delete leave type", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="leave-type-page">
      {notification && <Notification {...notification} onClose={() => setNotification(null)} />}

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="header-icon"><Calendar className="w-6 h-6 text-white" /></div>
            <h1 className="title-gradient">Leave Type Manager</h1>
          </div>
          <p className="text-gray-600 text-lg">Manage your organization's leave types with ease</p>
        </header>

        <div className="add-card">
          <h3 className="card-title"><Plus className="w-5 h-5 text-indigo-600" /> Add New Leave Type</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter leave type name..."
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="leave-input"
              disabled={adding}
            />
            <button onClick={handleAdd} disabled={adding || !newType.trim()} className="add-btn">
              {adding ? <div className="loading-spinner" /> : <Plus className="w-5 h-5" />}
              {adding ? "Adding..." : "Add Type"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" /> Current Leave Types
            <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {leaveTypes.length} types
            </span>
          </h3>

          {loading ? (
            <div className="flex flex-col items-center py-16">
              <div className="loader-large"></div>
              <p className="text-gray-500 font-medium">Loading leave types...</p>
            </div>
          ) : leaveTypes.length === 0 ? (
            <div className="text-center py-16">
              <div className="empty-icon"><Calendar className="w-8 h-8 text-gray-400" /></div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No Leave Types Yet</h4>
              <p className="text-gray-500">Add your first leave type to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {leaveTypes.map((type, i) => (
                <div key={type.id} className="leave-card" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{type.name}</h4>
                      {type.count !== undefined && <p className="text-sm text-gray-500 mt-1">{type.count} days allocated</p>}
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">ID: {type.id}</span>
                    <button onClick={() => handleDelete(type.id, type.name)} disabled={deletingId === type.id} className="delete-btn">
                      {deletingId === type.id ? <div className="delete-spinner" /> : <Trash2 className="w-4 h-4" />}
                      {deletingId === type.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveTypeList;
