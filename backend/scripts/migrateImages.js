import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "../src/models/Property.js";

/**
 * Carica variabili ambiente (.env)
 */
dotenv.config();

/**
 * =========================
 * UTILS: ESTRAZIONE PUBLIC_ID
 * =========================
 * Dato un URL Cloudinary, estrae il public_id
 * necessario per operazioni (delete, update)
 */
function extractPublicId(url) {
  try {
    const parts = url.split("/upload/")[1];

    // rimuove versione (es: v12345/)
    const withoutVersion = parts.replace(/v\d+\//, "");

    // rimuove estensione file (.jpg, .png, ecc.)
    return withoutVersion.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

/**
 * =========================
 * SCRIPT MIGRAZIONE IMMAGINI
 * =========================
 * Converte:
 * images: ["url1", "url2"]
 *
 * → in:
 * images: [{ url, public_id }]
 */
async function run() {
  try {
    /**
     * Connessione a MongoDB
     */
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connesso a Mongo");

    /**
     * Recupero tutti gli immobili
     */
    const properties = await Property.find({});

    let updatedCount = 0;

    for (const property of properties) {
      /**
       * Skip se non ha immagini
       */
      if (!property.images?.length) continue;

      /**
       * Controllo se è nel vecchio formato (array di stringhe)
       */
      const needsMigration = typeof property.images[0] === "string";

      if (!needsMigration) continue;

      /**
       * Conversione immagini in nuovo formato
       */
      const newImages = property.images
        .map((url) => {
          const public_id = extractPublicId(url);
          if (!public_id) return null;

          return { url, public_id };
        })
        .filter(Boolean);

      /**
       * Salvataggio nuovo formato
       */
      property.images = newImages;
      await property.save();

      updatedCount++;
    }

    console.log(
      `🎉 Migrazione completata. Aggiornati ${updatedCount} immobili.`
    );

    process.exit();
  } catch (err) {
    /**
     * Gestione errori script
     */
    console.error("❌ Errore migrazione:", err.message);
    process.exit(1);
  }
}

/**
 * Avvio script
 */
run();