import { createContext, useState, useEffect } from "react";
import { getCurrentUser, getToken } from "../utils/auth";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const decodedUser = getCurrentUser();
    if (decodedUser) {
      // ⚡ On enrichit l’utilisateur depuis l’API
      axios.get("http://127.0.0.1:5000/api/users/me", {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
        .then(res => setUser(res.data))
        .catch(err => {
          console.error("Erreur récupération user:", err);
          setUser(decodedUser); // fallback minimal (id, username)
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};