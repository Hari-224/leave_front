import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import leaveApi from "../../api/leaveApi"; // import the default object
import { LEAVE_STATUS } from "../../utils/constants";
import "./LeaveList.css";

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await leaveApi.getAll(); // call getAll from default export
        setLeaves(res.data);
      } catch (error) {
        console.error("Error fetching leave applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="leave-list-container">
      <h1>Leave Applications</h1>
      {leaves.length === 0 ? (
        <p>No leave applications found.</p>
      ) : (
        <table className="leave-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Requested By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.id}</td>
                <td>{leave.type}</td>
                <td>
                  <span className={`badge ${leave.status.toLowerCase()}`}>
                    {leave.status}
                  </span>
                </td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.requestedBy?.name || "N/A"}</td>
                <td>
                  <Link to={`/leave/${leave.id}`} className="view-btn">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveList;
