import axios from "axios";
import { getToken } from "../utils/storage";
const API_URL = process.env.REACT_APP_API_BASE_URL;

const getConfig = () => ({ headers: { Authorization: `Bearer ${getToken()?.token}` } });

const getAll = () => axios.get(`${API_URL}/leave-types`, getConfig());
const create = (data) => axios.post(`${API_URL}/leave-types`, data, getConfig());
const update = (id, data) => axios.put(`${API_URL}/leave-types/${id}`, data, getConfig());
const remove = (id) => axios.delete(`${API_URL}/leave-types/${id}`, getConfig());

export default { getAll, create, update, remove };
