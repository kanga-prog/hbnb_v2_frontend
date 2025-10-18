// URL de production du backend
const PROD_BASE_URL = "https://hbnb-v2-backend.onrender.com";

/**
 * Corrige automatiquement les URLs locales ou relatives
 * en URL HTTPS complètes vers Render.
 */
function fixUrl(url) {
  if (!url) return null;
  if (url.startsWith("http://127.0.0.1:5000")) {
    return url.replace("http://127.0.0.1:5000", PROD_BASE_URL);
  } else if (url.startsWith("/uploads")) {
    return `${PROD_BASE_URL}${url}`;
  }
  return url;
}

// Exemple d'utilisation
avatars.forEach((imgEl) => {
  imgEl.src = fixUrl(imgEl.src);
});
