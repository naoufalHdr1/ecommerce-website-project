// utils/api.js
import axios from "axios";
import { API_BASE_URL } from "./config";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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

export const uploadImages = async (images) => {
  const formData = new FormData();
  const imagesArray = Array.isArray(images) ? images : [images];

  imagesArray.forEach((image) => formData.append('images', image));

  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.images; // image URL
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};
