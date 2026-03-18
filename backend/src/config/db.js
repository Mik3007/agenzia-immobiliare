import mongoose from "mongoose";

/**
 * Funzione per connettersi a MongoDB
 * @param {string} uri - stringa di connessione (MongoDB Atlas o locale)
 */
export async function connectDB(uri) {
  try {
    /**
     * Impostazione mongoose:
     * - evita warning su query non dichiarate nello schema
     * - comportamento più prevedibile
     */
    mongoose.set("strictQuery", true);

    /**
     * Connessione al database
     * - mongoose gestisce automaticamente pool e retry
     */
    await mongoose.connect(uri);

    // Log di successo (utile in fase di deploy/debug)
    console.log("✅ MongoDB connesso");
  } catch (err) {
    /**
     * Se la connessione fallisce:
     * - logghiamo errore pulito
     * - terminiamo il processo (server inutile senza DB)
     */
    console.error("❌ Errore connessione MongoDB:", err.message);
    process.exit(1);
  }
}
