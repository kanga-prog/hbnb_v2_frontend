import React from "react";
import { useNavigate } from "react-router-dom";
import PlaceForm from "../components/place/PlaceForm";
import API, { createPlace } from "../services/api";
// ✅ Import de fixUrl depuis utils/scripts.js
import { fixUrl } from "../utils/scripts";

const CreatePlace = () => {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      // 1️⃣ Construire un payload propre pour le backend
      const payload = {
        name: data.name,
        price_by_night: parseInt(data.price_by_night, 10),
      };

      // Champs optionnels : on n'envoie que ceux qui existent
      if (data.description !== undefined) payload.description = data.description;
      if (data.location !== undefined) payload.location = data.location;
      if (data.country !== undefined) payload.country = data.country;
      if (data.town !== undefined) payload.town = data.town;
      if (data.latitude !== undefined) payload.latitude = Number(data.latitude);
      if (data.longitude !== undefined) payload.longitude = Number(data.longitude);
      if (data.amenities && data.amenities.length > 0) {
        payload.amenity_ids = data.amenities.map((id) => parseInt(id, 10));
      }
      console.log("Payload envoyé au backend :", payload);
      
      // 2️⃣ CRÉATION DU LIEU
      const response = await createPlace(payload);
      console.log("PLACE CRÉÉE :", response);
      const placeId = response.id;

      // 3️⃣ UPLOAD DES IMAGES SI ELLES EXISTENT
      if (data.images && data.images.length > 0) {
        await Promise.all(
          data.images.map((img) => {
            if (img instanceof File) {
              const formData = new FormData();
              formData.append("file", img);
              return API.post(`/places/${placeId}/images`, formData);
            } else if (typeof img === "string") {
              // ✅ On corrige l'URL existante avant de l'envoyer
              const fixedUrl = fixUrl(img);
              return API.post(`/places/${placeId}/images`, { url: fixedUrl });
            }
            return Promise.resolve(null);
          })
        );
        console.log("IMAGES CRÉÉES ET LIÉES À LA PLACE !");
      }

      // 4️⃣ REDIRECTION VERS LE DÉTAIL DU LIEU
      navigate(`/places/${placeId}`);
    } catch (err) {
      console.error("ERREUR LORS DE LA CRÉATION :", err);
      alert(err.response?.data?.message || "ERREUR LORS DE LA CRÉATION DU LIEU");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>CRÉER UN NOUVEAU LIEU</h1>
      <PlaceForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreatePlace;
