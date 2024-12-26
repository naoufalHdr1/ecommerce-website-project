// utils/api.js
import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (email, password) => {
  try {
    const res = await api.post('/login', { email, password });
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || "Something went wrong. Please try again.";
  }
};

export default api;
