// src/hooks/useLeave.js
import { useContext, useState } from "react";
import { LeaveContext } from "../context/LeaveContext";
import leaveApi from "../api/leaveApi";

export const useLeave = () => {
  const { leaves, setAllLeaves } = useContext(LeaveContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeaves = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await leaveApi.getAll();
      setAllLeaves(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch leaves");
      setLoading(false);
      return [];
    }
  };

  const createLeave = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await leaveApi.create(data);
      await fetchLeaves();
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create leave");
      setLoading(false);
      throw err;
    }
  };

  const updateLeave = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await leaveApi.update(id, data);
      await fetchLeaves();
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update leave");
      setLoading(false);
      throw err;
    }
  };

  const deleteLeave = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await leaveApi.remove(id);
      await fetchLeaves();
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete leave");
      setLoading(false);
      throw err;
    }
  };

  const approveLeave = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await leaveApi.approve(id);
      await fetchLeaves();
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve leave");
      setLoading(false);
      throw err;
    }
  };

  const rejectLeave = async (id, reason) => {
    setLoading(true);
    setError(null);
    try {
      const res = await leaveApi.reject(id, reason);
      await fetchLeaves();
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject leave");
      setLoading(false);
      throw err;
    }
  };

  return {
    leaves,
    fetchLeaves,
    createLeave,
    updateLeave,
    deleteLeave,
    approveLeave,
    rejectLeave,
    loading,
    error,
  };
};
