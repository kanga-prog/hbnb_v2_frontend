// src/pages/PlaceDetail.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import ReviewForm from "../components/place/ReviewForm";
import ReviewList from "../components/place/ReviewList";
import ReservationForm from "../components/place/ReservationForm";
import { getCurrentUser } from "../utils/auth";

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const reviewListRef = useRef(null);

  // 🔄 Charger les réservations
  const loadReservations = useCallback(() => {
    API.get(`/reservations/place/${id}`)
      .then((res) => setReservations(res.data || []))
      .catch((err) => {
        console.error("Erreur chargement réservations:", err);
        setReservations([]);
      });
  }, [id]);

  // 🔄 Charger le lieu et ses données associées
  useEffect(() => {
    setCurrentUser(getCurrentUser());

    API.get(`/places/${id}/`)
      .then((res) => {
        setPlace(res.data);
        if (res.data.images) setImages(res.data.images);
      })
      .catch((err) => console.error("Erreur chargement lieu:", err));

    API.get(`/places/${id}/amenities`)
      .then((res) => {
        const cleanAmenities = Array.isArray(res.data)
          ? res.data.map((a) => (typeof a === "string" ? a : a.name || String(a)))
          : [];
        setAmenities(cleanAmenities);
      })
      .catch((err) => console.error("Erreur chargement équipements:", err));

    loadReservations();
  }, [id, loadReservations]);

  // 🗑️ Supprimer un lieu
  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce lieu ?")) return;
    try {
      await API.delete(`/places/${id}/`);
      alert("Lieu supprimé avec succès !");
      navigate("/");
    } catch (err) {
      console.error("Erreur suppression lieu:", err);
      alert("Impossible de supprimer ce lieu.");
    }
  };

  // ✏️ Modifier un lieu
  const handleEdit = () => navigate(`/places/${id}/edit`);

  // 🗑️ Supprimer une image
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Supprimer cette image ?")) return;
    try {
      await API.delete(`/places/${id}/images/${imageId}`);
      setImages(images.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("Erreur suppression image:", err);
      alert("Impossible de supprimer l'image.");
    }
  };

  if (!place) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
      <Link to="/" className="text-blue-600 hover:underline">← Retour</Link>
      <h1 className="text-3xl font-bold mt-2">{place.name}</h1>
      <p className="mt-2">{place.description}</p>
      <p className="mt-2 font-semibold">Prix : {place.price_by_night} €/nuit</p>

      {/* Images */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4 my-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={img.url || img}
                alt={`${place.name} - ${idx + 1}`}
                onClick={() => setSelectedImage(idx)}
                className={`w-48 h-36 object-cover rounded-lg cursor-pointer transition 
                  ${selectedImage === idx ? "ring-4 ring-red-500" : "ring-2 ring-transparent"}`}
              />
              {currentUser?.id === place.owner_id && (
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload image */}
      {currentUser?.id === place.owner_id && (
        <div className="my-4">
          <input
            type="file"
            onChange={async (e) => {
              if (!e.target.files[0]) return;
              const formData = new FormData();
              formData.append("file", e.target.files[0]);
              try {
                const res = await API.post(`/places/${id}/images`, formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });
                setImages([...images, res.data]);
              } catch (err) {
                console.error("Erreur upload image:", err);
                alert("Impossible d'uploader l'image.");
              }
            }}
          />
        </div>
      )}

      {/* Équipements */}
      <h3 className="text-xl font-semibold mt-6">Équipements :</h3>
      {amenities.length > 0 ? (
        <ul className="list-disc list-inside">
          {amenities.map((name, idx) => <li key={idx}>{name}</li>)}
        </ul>
      ) : (
        <p>Aucun équipement disponible.</p>
      )}

      {/* Réservations */}
      <h3 className="text-xl font-semibold mt-6">Réservations :</h3>
      {reservations.length > 0 ? (
        <ul>
          {reservations.map((r) => (
            <li key={r.id}>
              {new Date(r.start_datetime).toLocaleString()} →{" "}
              {new Date(r.end_datetime).toLocaleString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune réservation pour ce lieu.</p>
      )}

      <ReservationForm place_Id={parseInt(id, 10)} onReservationAdded={loadReservations} />

      {/* Avis */}
      <ReviewList ref={reviewListRef} place_Id={parseInt(id, 10)} />
      <ReviewForm place_Id={parseInt(id, 10)} onReviewAdded={() => reviewListRef.current?.refreshReviews()} />

      {/* Actions propriétaire */}
      {currentUser?.id === place.owner_id && (
        <div className="flex gap-4 mt-6">
          <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded">Modifier</button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Supprimer</button>
        </div>
      )}
    </div>
  );
}
