// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://hbnb-v2-backend.onrender.com/api",
  headers: { "Content-Type": "application/json" },
});

// 🔐 Intercepteur JWT + gestion FormData
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) delete config.headers["Content-Type"];
  return config;
});

// 🏠 Création d’un lieu
export const createPlace = async (placeData) => {
  const response = await API.post("/places", placeData);
  return response.data;
};

// 📸 Upload image de lieu
export const uploadPlaceImage = async (placeId, file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await API.post(`/places/${placeId}/images`, formData);
  return res.data;
};

// 👤 Upload avatar utilisateur
export const uploadAvatar = async (userId, file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const res = await API.post(`/users/${userId}/avatar`, formData);
  return res.data;
};

export default API;
