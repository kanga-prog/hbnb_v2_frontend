import { useState, useEffect } from "react";
import API from "../../services/api";

export default function PlaceForm({ onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    price_by_night: "",
    location: "",
    country: "",
    town: "",
    latitude: "",
    longitude: "",
    amenities: [],
  });

  const [existingImages, setExistingImages] = useState([]); // images backend
  const [newImages, setNewImages] = useState([]); // nouvelles images
  const [error, setError] = useState("");

  useEffect(() => {
    if (!initialData || !initialData.id) return;

    setFormData({
      id: initialData.id || null,
      name: initialData.name || "",
      description: initialData.description || "",
      price_by_night: initialData.price_by_night || "",
      location: initialData.location || "",
      country: initialData.country || "",
      town: initialData.town || "",
      latitude: initialData.latitude || "",
      longitude: initialData.longitude || "",
      amenities: initialData.amenities?.map((a) => a.id) || [],
    });

    setExistingImages(initialData.images || []);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    const id = Number(value);
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, id]
        : prev.amenities.filter((a) => a !== id),
    }));
  };

  const handleFileChange = (e) => {
    setNewImages([...newImages, ...e.target.files]);
  };

  const handleDeleteExisting = async (imageId) => {
    if (!window.confirm("Voulez-vous supprimer cette image ?")) return;
    try {
      await API.delete(`/places/${formData.id}/images/${imageId}`);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer cette image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Le nom est obligatoire.");
    if (!formData.price_by_night || isNaN(Number(formData.price_by_night)))
      return setError("Le prix doit être un nombre.");

    try {
      await onSubmit({
        ...formData,
        price_by_night: Number(formData.price_by_night),
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        existingImages,
        images: newImages,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>{formData.id ? "Modifier un lieu" : "Créer un lieu"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Champs classiques */}
      <label>Nom *</label>
      <input type="text" name="name" value={formData.name} onChange={handleChange} required />

      <label>Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} rows="4" />

      <label>Prix *</label>
      <input type="number" name="price_by_night" value={formData.price_by_night} onChange={handleChange} required />

      <label>Adresse</label>
      <input type="text" name="location" value={formData.location} onChange={handleChange} />

      <label>Pays</label>
      <input type="text" name="country" value={formData.country} onChange={handleChange} />

      <label>Ville</label>
      <input type="text" name="town" value={formData.town} onChange={handleChange} />

      <label>Latitude</label>
      <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} />

      <label>Longitude</label>
      <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} />

      <fieldset style={{ marginTop: "1rem" }}>
        <legend>Amenities</legend>
        {[{ id: 1, name: "wifi" }, { id: 2, name: "parking" }, { id: 3, name: "piscine" }].map((a) => (
          <label key={a.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              value={a.id}
              checked={formData.amenities.includes(a.id)}
              onChange={handleAmenityChange}
            />
            {a.name.charAt(0).toUpperCase() + a.name.slice(1)}
          </label>
        ))}
      </fieldset>

      {/* Anciennes images */}
      {existingImages.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Images existantes :</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {existingImages.map((img) => (
              <div key={img.id} style={{ position: "relative" }}>
                <img
                  src={img.url}
                  alt="place"
                  style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteExisting(img.id)}
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nouvelles images */}
      <label>Ajouter des images</label>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      {newImages.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Aperçu nouvelles images :</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {Array.from(newImages).map((file, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(file)}
                alt="preview"
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
              />
            ))}
          </div>
        </div>
      )}

      <button type="submit" style={{ marginTop: "1rem" }}>
        {formData.id ? "Mettre à jour" : "Créer"}
      </button>
    </form>
  );
}
