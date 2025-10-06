import { jwtDecode } from "jwt-decode";

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}

export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      id: decoded.sub?.toString() || "",   // l’ID vient de `identity`
      username: decoded.username || "",    // injecté via `additional_claims`
      is_admin: !!decoded.is_admin,        // idem
    };
  } catch (err) {
    console.error("Erreur décodage JWT :", err);
    return null;
  }
}
