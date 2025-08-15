import axios from "axios";
import { getToken } from "../utils/storage";
const API_URL = process.env.REACT_APP_API_BASE_URL;

const getConfig = () => ({ headers: { Authorization: `Bearer ${getToken()?.token}` } });

const getAll = () => axios.get(`${API_URL}/leave-applications`, getConfig());
const getById = (id) => axios.get(`${API_URL}/leave-applications/${id}`, getConfig());
const create = (data) => axios.post(`${API_URL}/leave-applications`, data, getConfig());
const update = (id, data) => axios.put(`${API_URL}/leave-applications/${id}`, data, getConfig());
const remove = (id) => axios.delete(`${API_URL}/leave-applications/${id}`, getConfig());
const approve = (id) => axios.put(`${API_URL}/leave-applications/${id}/approve`, {}, getConfig());
const reject = (id, reason) => axios.put(`${API_URL}/leave-applications/${id}/reject?reason=${reason}`, {}, getConfig());

export default { getAll, getById, create, update, remove, approve, reject };
