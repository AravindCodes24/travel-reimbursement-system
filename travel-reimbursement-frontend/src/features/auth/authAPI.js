import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000/api/auth";

export const meApi = async () => {
  const res = await axios.get(`${BASE_URL}/me`);
  return res.data;
};
export const logoutApi = async () => {
  const res = await axios.post(`${BASE_URL}/logout`);
  return res.data;
};

export const loginApi = (credentials) => axios.post("/api/login", credentials);
export const registerApi = (userData) => axios.post("/api/register", userData);
