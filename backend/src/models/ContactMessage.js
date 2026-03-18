import mongoose from "mongoose";

/**
 * =========================
 * MODELLO MESSAGGIO CONTATTO
 * =========================
 * Rappresenta una richiesta inviata dal form contatti
 * (eventualmente collegata a un immobile specifico)
 */
const contactMessageSchema = new mongoose.Schema(
  {
    /**
     * Nome cliente
     */
    name: {
      type: String,
      required: true,
    },

    /**
     * Email cliente
     */
    email: {
      type: String,
      required: true,
    },

    /**
     * Telefono (opzionale)
     */
    phone: {
      type: String,
      default: "",
    },

    /**
     * Messaggio inviato
     */
    message: {
      type: String,
      required: true,
    },

    /**
     * Riferimento immobile (opzionale)
     * - utile se il contatto riguarda un annuncio specifico
     */
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      default: null,
    },
  },
  {
    /**
     * timestamps:
     * - createdAt → data invio
     * - updatedAt → eventuali modifiche
     */
    timestamps: true,
  },
);

/**
 * Export modello:
 * evita duplicazioni in ambiente dev (hot reload)
 */
export default mongoose.models.ContactMessage ||
  mongoose.model("ContactMessage", contactMessageSchema);
