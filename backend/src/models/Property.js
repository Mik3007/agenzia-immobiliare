import mongoose from "mongoose";

/**
 * =========================
 * MODELLO IMMOBILE (Property)
 * =========================
 * Rappresenta un immobile gestito dall'agenzia
 */
const propertySchema = new mongoose.Schema(
  {
    /**
     * Titolo annuncio (es. "Villa con giardino a Caserta")
     */
    title: { type: String, required: true },

    /**
     * Città (usata anche nei filtri)
     */
    city: { type: String, required: true },

    /**
     * Indirizzo completo (opzionale)
     */
    address: { type: String, default: "" },

    /**
     * Prezzo immobile
     */
    price: { type: Number, required: true },

    /**
     * CAP (utile per geocoding più preciso)
     */
    cap: String,

    /**
     * Tipologia immobile
     */
    type: {
      type: String,
      enum: ["appartamento", "villa", "ufficio", "negozio", "terreno", "altro"],
      default: "appartamento",
    },

    /**
     * Tipo contratto
     */
    contract: {
      type: String,
      enum: ["vendita", "affitto"],
      default: "vendita",
    },

    /**
     * Dati principali immobile
     */
    rooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    areaMq: { type: Number, default: 0 },

    /**
     * Descrizione completa
     */
    description: { type: String, default: "" },

    /**
     * Coordinate geografiche (per mappa)
     */
    location: {
      lat: Number,
      lng: Number,
    },

    /**
     * Immagini principali (Cloudinary)
     */
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    /**
     * Planimetrie (stessa logica delle immagini)
     */
    planimetries: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    /**
     * Flag per evidenza homepage
     */
    featured: { type: Boolean, default: false },
  },
  {
    /**
     * timestamps:
     * - createdAt
     * - updatedAt
     */
    timestamps: true,
  }
);

/* ============================= */
/* INDICE GEO (MAPPA) */
/* ============================= */
/**
 * Migliora performance query su coordinate
 * (utile per mappe tipo Airbnb)
 */
propertySchema.index({ "location.lat": 1, "location.lng": 1 });

/**
 * Export modello:
 * - evita duplicazione modelli in ambiente dev (hot reload)
 */
export default mongoose.models.Property ||
  mongoose.model("Property", propertySchema);