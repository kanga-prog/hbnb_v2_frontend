import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function VerifyCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const pendingEmail = localStorage.getItem("pendingEmail");
    if (!pendingEmail) {
      setMessage("Session expirée, veuillez vous reconnecter.");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setEmail(pendingEmail);
      setMessage("2FA code sent to your email");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) return;

    try {
      const response = await API.post("/auth/verify-2fa", { email, code });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.removeItem("pendingEmail");
        setMessage("Connexion réussie !");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(response.data.message || "Code invalide.");
      }
    } catch (error) {
      console.error("Erreur :", error.response?.data || error.message);
      setMessage("Impossible de contacter le serveur.");
    }
  };

  if (!email) return <p className="text-center text-red-500">{message}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-xl bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Vérification du code</h2>
      {message && <p className="mb-4 text-center text-blue-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Entrez le code reçu par email"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="w-full p-2 border rounded"
          autoComplete="one-time-code"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Vérifier
        </button>
      </form>
    </div>
  );
}

export default VerifyCode;
