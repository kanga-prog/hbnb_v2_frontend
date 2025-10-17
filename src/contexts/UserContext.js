// src/contexts/UserContext.js
import { createContext, useState, useEffect } from "react";
import API from "../services/api";
import { getCurrentUser } from "../utils/auth";

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

    API.get("/users/me")
      .then((res) => {
        const data = res.data;

        // 🌍 Force l’URL HTTPS production Render (aucune référence locale)
        if (data.avatar_url) {
          data.avatar_url = data.avatar_url.replace(
            /^http:\/\/127\.0\.0\.1:5000/,
            "https://hbnb-v2-backend.onrender.com"
          );
        }

        console.log("👤 Utilisateur récupéré :", data);
        setUser(data);
      })
      .catch((err) => {
        console.error("❌ Erreur récupération user :", err);
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
