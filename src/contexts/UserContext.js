// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import API from "../services/api"; // ✅ Instance axios configurée
import { getCurrentUser } from "../utils/auth"; // ✅ Décodage du token JWT

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const decodedUser = getCurrentUser();

    if (!decodedUser) {
      setLoading(false);
      return;
    }

    // ✅ Appel API pour enrichir les données utilisateur depuis ton backend
    API.get("/users/me")
      .then((res) => {
        console.log("👤 Utilisateur récupéré :", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("❌ Erreur récupération user :", err);
        // Fallback : garde au moins les infos du token
        setUser(decodedUser);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ Déconnexion : supprime le token et reset user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
