// src/api/leaveApi.js
import axios from "axios";
import { getToken } from "../utils/storage";

// Base URL for leave-related endpoints
const API_URL = "/api/leave-applications";

// Helper to get Authorization headers
const getAuthHeaders = () => {
  const token = getToken()?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

/**
 * Fetch all leave applications (Admin/Manager view)
 */
export const getAllLeaves = async () => {
  const res = await axios.get(API_URL, getAuthHeaders());
  return res.data;
};

/**
 * Fetch leave by ID
 * @param {string|number} id - Leave ID
 */
export const getLeaveById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return res.data;
};

/**
 * Create a new leave application (Employee)
 * @param {object} leaveData - { leaveType, startDate, endDate, reason, ... }
 */
export const createLeave = async (leaveData) => {
  const res = await axios.post(API_URL, leaveData, getAuthHeaders());
  return res.data;
};

/**
 * Update leave application (Admin)
 * @param {string|number} id - Leave ID
 * @param {object} leaveData - Updated leave data
 */
export const updateLeave = async (id, leaveData) => {
  const res = await axios.put(`${API_URL}/${id}`, leaveData, getAuthHeaders());
  return res.data;
};

/**
 * Delete leave application (Admin)
 * @param {string|number} id - Leave ID
 */
export const deleteLeave = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return res.data;
};

/**
 * Approve a leave application (Manager/Admin)
 * @param {string|number} leaveId
 */
export const approveLeave = async (leaveId) => {
  const res = await axios.put(`${API_URL}/${leaveId}/approve`, {}, getAuthHeaders());
  return res.data;
};

/**
 * Reject a leave application (Manager/Admin)
 * @param {string|number} leaveId
 * @param {string} reason - Reason for rejection
 */
export const rejectLeave = async (leaveId, reason) => {
  const res = await axios.put(`${API_URL}/${leaveId}/reject`, { reason }, getAuthHeaders());
  return res.data;
};

/**
 * Fetch leaves by user ID (Employee)
 * @param {string|number} userId
 */
export const getLeavesByUser = async (userId) => {
  const res = await axios.get(`${API_URL}/user/${userId}`, getAuthHeaders());
  return res.data;
};

/**
 * Fetch leaves by manager ID (Manager view)
 * @param {string|number} managerId
 */
export const getLeavesByManager = async (managerId) => {
  const res = await axios.get(`${API_URL}/manager/${managerId}`, getAuthHeaders());
  return res.data;
};

// Default export for convenience (optional)
export default {
  getAllLeaves,
  getLeaveById,
  createLeave,
  updateLeave,
  deleteLeave,
  approveLeave,
  rejectLeave,
  getLeavesByUser,
  getLeavesByManager,
};
