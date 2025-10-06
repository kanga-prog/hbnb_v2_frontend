// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    country: "",
    town: ""
  });

  const [message, setMessage] = useState("");

  // Mise à jour des champs du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Envoi au backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // ✅ Utilisation de notre instance API
      const response = await API.post("/auth/register", formData);

      if (response.status === 201 || response.status === 200) {
        setMessage("Inscription réussie ! Vous pouvez vous connecter.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(response.data.message || "Erreur lors de l’inscription.");
      }
    } catch (error) {
      console.error("Erreur :", error.response?.data || error.message);

      // Gestion des erreurs spécifiques
      if (error.response) {
        // Le backend a renvoyé une réponse avec un statut
        switch (error.response.status) {
          case 400:
            setMessage("Certains champs sont manquants ou invalides.");
            break;
          case 409:
            setMessage(
              error.response.data.message || "Conflit : email, username ou téléphone déjà utilisé."
            );
            break;
          case 500:
            setMessage("Erreur serveur. Merci de réessayer plus tard.");
            break;
          default:
            setMessage(error.response.data.message || "Erreur lors de l’inscription.");
        }
      } else {
        // Pas de réponse du serveur
        setMessage("Impossible de contacter le serveur. Vérifiez votre connexion.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-xl bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Créer un compte</h2>
      {message && (
        <p className="mb-4 text-center text-red-500">{message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Nom d’utilisateur"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
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
        <input
          type="text"
          name="phone_number"
          placeholder="Numéro de téléphone"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="country"
          placeholder="Pays"
          value={formData.country}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="town"
          placeholder="Ville"
          value={formData.town}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          S’inscrire
        </button>
      </form>
      <p className="mt-4 text-center">
        Déjà inscrit ?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-blue-600 cursor-pointer"
        >
          Se connecter
        </span>
      </p>
    </div>
  );
}

export default RegisterPage;
