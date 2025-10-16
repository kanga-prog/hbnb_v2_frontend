import React, { createContext, useState, useEffect } from "react";
import API from "../services/api"; // ✅ On réutilise ton instance axios avec JWT
import { getCurrentUser, getToken } from "../utils/auth"; // ou adapte selon ton projet

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

    // ✅ Appel à l'API REST /users/me via ton backend Render (avec JWT auto)
    API.get("/users/me")
      .then((res) => {
        console.log("👤 Utilisateur récupéré :", res.data);
        setUser(res.data);
      })
      .catch((err) => {
        console.error("❌ Erreur récupération user :", err);
        // fallback minimal en cas d’erreur (données du token décodé)
        setUser(decodedUser);
      })
      .finally(() => setLoading(false));
  }, []);

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
