import axios from "axios";
const API_URL = process.env.REACT_APP_API_BASE_URL;

const login = (email, password) => axios.post(`${API_URL}/users/login`, { email, password });
const register = (data) => axios.post(`${API_URL}/users/register`, data);

export default { login, register };
