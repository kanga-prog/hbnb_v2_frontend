import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import PlaceForm from "../components/place/PlaceForm";

export default function EditPlace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/places/${id}/`)
      .then((res) => setPlace(res.data))
      .catch((err) => {
        console.error(err);
        alert("Impossible de charger le lieu.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      // Étape 1 : update JSON
      const payload = {
        name: data.name,
        description: data.description,
        price_by_night: Number(data.price_by_night),
        location: data.location,
        country: data.country,
        town: data.town,
        latitude: data.latitude ? Number(data.latitude) : null,
        longitude: data.longitude ? Number(data.longitude) : null,
        amenity_ids: data.amenities || [],
      };

      await API.put(`/places/${id}/`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      // Étape 2 : upload des nouvelles images
      if (data.images && data.images.length > 0) {
        for (const file of data.images) {
          const formData = new FormData();
          formData.append("file", file);
          await API.post(`/places/${id}/images`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      alert("Lieu mis à jour !");
      navigate(`/places/${id}`);
    } catch (err) {
      console.error("Erreur mise à jour :", err);
      alert(err.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!place) return <p>Lieu introuvable.</p>;

  return <PlaceForm onSubmit={handleUpdate} initialData={place} />;
}
