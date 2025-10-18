import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
// import { fixUrl } from "../utils/scripts"; // Décommenter si besoin pour les images

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/auth/login", formData);

      // Message et stockage de l'email pour 2FA
      setMessage("Un code de vérification a été envoyé à votre email.");
      localStorage.setItem("pendingEmail", formData.email);

      // Redirection immédiate vers le formulaire 2FA
      navigate("/verify-code");
    } catch (error) {
      console.error("Erreur :", error);
      setMessage(
        error.response?.data?.message || "Email ou mot de passe incorrect."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-xl bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Se connecter</h2>
      {message && <p className="mb-4 text-center text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Adresse e-mail"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Se connecter
        </button>
      </form>
      <p className="mt-2 text-center">
        Pas encore inscrit ?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-600 cursor-pointer"
        >
          Créer un compte
        </span>
      </p>
    </div>
  );
}
