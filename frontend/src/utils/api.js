// utils/api.js
import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;

// Example usage:
// api.post('/login', { email, password });

