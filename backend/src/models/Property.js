import mongoose from "mongoose";

/**
 * Modello "Property" (immobile).
 * Qui decidi i campi che vuoi mostrare nel sito.
 * Se vuoi aggiungere: classe energetica, metratura, ecc. -> aggiungili qui.
 */
const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // es. "Trilocale in centro"
    city: { type: String, required: true }, // es. "Milano"
    address: { type: String, default: "" }, // opzionale
    price: { type: Number, required: true }, // es. 250000
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

    // immagini: salviamo array di URL relative, es. "/uploads/abc.jpg"
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    // evidenziazione in home (vetrina)
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Property ||
  mongoose.model("Property", propertySchema);
