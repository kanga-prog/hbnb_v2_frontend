import React from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>Mot de passe oublié</h1>
      <ResetPasswordForm mode="forgot" />
    </div>
  );
}