import mongoose from "mongoose";

/**
 * =========================
 * MODELLO RECENSIONE (Review)
 * =========================
 * Rappresenta una recensione lasciata da un utente
 * con sistema di approvazione admin
 */
const reviewSchema = new mongoose.Schema(
  {
    /**
     * Nome autore recensione
     */
    name: {
      type: String,
      required: true,
    },

    /**
     * Valutazione (stelle)
     * - minimo 1
     * - massimo 5
     */
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    /**
     * Testo recensione
     */
    text: {
      type: String,
      required: true,
    },

    /**
     * Stato recensione:
     * - pending → in attesa approvazione
     * - approved → visibile sul sito
     * - rejected → rifiutata (opzionale, spesso eliminata)
     */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    /**
     * timestamps:
     * - createdAt → data inserimento
     * - updatedAt → ultima modifica
     */
    timestamps: true,
  }
);

/**
 * Export modello:
 * evita duplicazioni in ambiente dev (hot reload)
 */
export default mongoose.models.Review ||
  mongoose.model("Review", reviewSchema);