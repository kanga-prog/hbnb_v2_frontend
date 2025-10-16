// src/contexts/UserContext.js
import { createContext, useState, useEffect } from "react";
import API from "../services/api"; // ✅ utilise axios avec JWT
import { getCurrentUser } from "../utils/auth"; // ⚡ décodage token

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

    // ✅ Requête API sécurisée via instance axios centralisée
    API.get("/users/me")
      .then(res => {
        console.log("👤 Utilisateur récupéré :", res.data);
        setUser(res.data);
      })
      .catch(err => {
        console.error("❌ Erreur récupération user :", err);
        setUser(decodedUser); // fallback minimal
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
