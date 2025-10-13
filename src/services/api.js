// src/services/api.js
import axios from "axios";

// ===============================
// 🔧 CONFIGURATION DE L’API
// ===============================
const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://hbnb-v2-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// 🔐 INTERCEPTEUR JWT
// (Ajoute automatiquement le token aux requêtes)
// ===============================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// 🏠 CRÉATION D’UN LIEU (PLACE)
// ===============================
export const createPlace = async (placeData) => {
  try {
    const response = await API.post("/places", placeData);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erreur création du lieu :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ===============================
// 👤 UPLOAD AVATAR UTILISATEUR
// ===============================
export const uploadAvatar = async (userId, file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await API.post(`/users/${userId}/avatar`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error(
      "❌ Erreur upload avatar :",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default API;
