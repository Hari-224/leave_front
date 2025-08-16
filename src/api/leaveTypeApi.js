// src/api/leaveTypeApi.js
import axios from "axios";
import { getToken } from "../utils/storage";

// Base URL for leave type endpoints
const API_URL = "/api/leave-types";

/**
 * Helper to get Authorization headers with JWT
 */
const getAuthHeaders = () => {
  const token = getToken()?.token;
  return { headers: { Authorization: `Bearer ${token}` } };
};

/**
 * Fetch all leave types
 */
export const getAllLeaveTypes = async () => {
  const res = await axios.get(API_URL, getAuthHeaders());
  return res.data;
};

/**
 * Fetch leave type by ID
 * @param {string|number} id - Leave type ID
 */
export const getLeaveTypeById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return res.data;
};

/**
 * Create a new leave type
 * @param {object} leaveType - { name: string, count?: number }
 */
export const createLeaveType = async (leaveType) => {
  const res = await axios.post(API_URL, leaveType, getAuthHeaders());
  return res.data;
};

/**
 * Update leave type by ID
 * @param {string|number} id - Leave type ID
 * @param {object} leaveType - Updated leave type data
 */
export const updateLeaveType = async (id, leaveType) => {
  const res = await axios.put(`${API_URL}/${id}`, leaveType, getAuthHeaders());
  return res.data;
};

/**
 * Delete leave type by ID
 * @param {string|number} id - Leave type ID
 */
export const deleteLeaveType = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return res.data;
};

/**
 * Default export for convenience
 */
export default {
  getAllLeaveTypes,
  getLeaveTypeById,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
};
