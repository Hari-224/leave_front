import axios from "axios";

const API_URL = "http://localhost:8080/api/users"; // Spring Boot backend URL
 // base path

export const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register`, userData);
  return res.data;
};

export const login = async (credentials) => {
  const res = await axios.post(`${API_URL}/login`, credentials);
  return res.data; // { token, role, email }
};

export const getAllUsers = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getUserById = async (id, token) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
