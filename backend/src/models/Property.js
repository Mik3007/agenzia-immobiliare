import mongoose from "mongoose";

/**
 * Modello "Property" (immobile).
 */
const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, default: "" },
    price: { type: Number, required: true },
    cap: String,

    type: {
      type: String,
      enum: ["appartamento", "villa", "ufficio", "negozio", "terreno", "altro"],
      default: "appartamento",
    },

    contract: {
      type: String,
      enum: ["vendita", "affitto"],
      default: "vendita",
    },

    rooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    areaMq: { type: Number, default: 0 },
    description: { type: String, default: "" },

    location: {
      lat: Number,
      lng: Number,
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ============================= */
/* INDICE PER GEOLOCATION MAPPA */
/* ============================= */

propertySchema.index({ "location.lat": 1, "location.lng": 1 });

export default mongoose.models.Property ||
  mongoose.model("Property", propertySchema);