// src/pages/Profile.jsx
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { uploadAvatar } from "../services/api";

export default function Profile() {
  const { user, setUser } = useContext(UserContext);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file || !user) return;

    try {
      const res = await uploadAvatar(user.id, file);

      // Mettre à jour l'avatar dans le contexte utilisateur
      setUser(res);
      setFile(null);
    } catch (err) {
      console.error("Erreur lors de l'upload de l'avatar :", err);
    }
  };

  if (!user) return <p>Chargement...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md rounded-xl bg-white text-center">
      <h2 className="text-2xl font-bold mb-4">Mon profil</h2>

      {user.avatar && (
        <img
          src={`http://127.0.0.1:5000${user.avatar}`}
          alt="Avatar"
          width={150}
          className="mx-auto mb-4 rounded-full shadow"
        />
      )}

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 w-full p-2 border rounded"
      />
      <button
        onClick={handleUpload}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Uploader
      </button>
    </div>
  );
}
