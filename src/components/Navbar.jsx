import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { logout as logoutAuth } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    logoutAuth();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-brandGray shadow-md px-6 py-3 flex flex-col sm:flex-row sm:justify-center gap-2 sm:gap-6">
      <Link className="text-gray-700 hover:text-brandRed font-medium transition" to="/">
        Accueil
      </Link>

      {user ? (
        <>
          <Link className="text-gray-700 hover:text-brandRed font-medium transition" to="/profile">
            Mon profil
          </Link>
          <Link className="text-gray-700 hover:text-brandRed font-medium transition" to="/places/new">
            Créer un lieu
          </Link>
          <button
            onClick={handleLogout}
            className="bg-brandRed text-white px-3 py-1 rounded-md hover:bg-red-600 transition font-medium"
          >
            Déconnexion
          </button>
        </>
      ) : (
        <>
          <Link className="text-gray-700 hover:text-brandRed font-medium transition" to="/login">
            Se connecter
          </Link>
          <Link className="text-gray-700 hover:text-brandRed font-medium transition" to="/register">
            S’inscrire
          </Link>
        </>
      )}
    </nav>
  );
}
