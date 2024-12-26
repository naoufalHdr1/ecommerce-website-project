// utils/api.js
import axios from "axios";
import { API_BASE_URL } from "./config";

export const api = axios.create({
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
    throw err.response?.data?.error || "Login failed. Please try again.";
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const res = await api.post("/register", { name, email, password });
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || "Registration failed: Please try again.";
  }
};
