import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL + "/api";

export const meApi = async () => {
  const res = await axios.get(`${BASE_URL}/auth/me`);
  return res.data;
};

export const logoutApi = async () => {
  const res = await axios.post(`${BASE_URL}/auth/logout`);
  return res.data;
};

export const loginApi = (credentials) => axios.post(`${BASE_URL}/login`, credentials);

export const registerApi = (userData) => axios.post(`${BASE_URL}/register`, userData);
