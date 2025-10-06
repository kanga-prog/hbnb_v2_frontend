// src/pages/ResetPasswordForm.jsx
import { useState } from "react";
import API from "../services/api";

export default function ResetPasswordForm({ mode = "forgot", userEmail = "", onCancel }) {
  const [email, setEmail] = useState(userEmail);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState("request"); // "request" → "reset"
  const [loading, setLoading] = useState(false);

  // Étape 1 : envoi du code
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setMessage("Email requis");

    try {
      setLoading(true);
      await API.post("/auth/forgot_password", { email });
      setMessage("Code envoyé à votre email");
      setStep("reset");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || "Erreur lors de la requête");
    } finally {
      setLoading(false);
    }
  };

  // Étape 2 : validation du code + changement de mot de passe
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code || !newPassword || !confirmPassword)
      return setMessage("Tous les champs sont requis");
    if (newPassword !== confirmPassword)
      return setMessage("Les mots de passe ne correspondent pas");

    try {
      setLoading(true);
      const res = await API.post("/auth/reset_password", {
        email,
        code,
        new_password: newPassword
      });
      setMessage(res.data.msg || "Mot de passe mis à jour avec succès");
      // Optionnel : reset formulaire ou retour login
      setStep("request");
      setEmail("");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || "Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={step === "request" ? handleForgotSubmit : handleResetSubmit}
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px"
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        {step === "request" ? "Mot de passe oublié" : "Réinitialiser le mot de passe"}
      </h2>

      {message && <p style={{ color: "red", textAlign: "center" }}>{message}</p>}

      {/* Étape 1 : email */}
      {step === "request" && (
        <>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </>
      )}

      {/* Étape 2 : code + nouveau mot de passe */}
      {step === "reset" && (
        <>
          <label>Code reçu par email</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Entrez le code reçu"
            required
          />

          <label>Nouveau mot de passe</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label>Confirmer mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{ marginTop: "1rem", width: "100%" }}
      >
        {loading
          ? "En cours..."
          : step === "request"
          ? "Envoyer le code"
          : "Réinitialiser le mot de passe"}
      </button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          style={{
            marginTop: "0.5rem",
            width: "100%",
            backgroundColor: "#ccc",
            color: "#000",
            padding: "0.5rem",
            borderRadius: "8px"
          }}
        >
          Retour à la connexion
        </button>
      )}
    </form>
  );
}
