// backend/src/models/User.js

import mongoose from "mongoose";

/**
 * =========================
 * MODELLO UTENTE (User)
 * =========================
 * Gestisce autenticazione admin
 */
const userSchema = new mongoose.Schema(
  {
    /**
     * Email utente (univoca)
     */
    email: {
      type: String,
      required: true,
      unique: true,
    },

    /**
     * Password hashata (bcrypt)
     * NON salvare mai password in chiaro
     */
    passwordHash: {
      type: String,
      required: true,
    },

    /**
     * Ruolo utente
     * - attualmente: admin
     * - estendibile in futuro (es. editor, agent, ecc.)
     */
    role: {
      type: String,
      default: "admin",
    },
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

/**
 * Export modello:
 * evita duplicazioni in dev (hot reload)
 */
export default mongoose.models.User ||
  mongoose.model("User", userSchema);