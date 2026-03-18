import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

/**
 * =========================
 * SCRIPT CREAZIONE ADMIN
 * =========================
 * Crea un utente admin iniziale se non esiste
 *
 * Usa variabili ambiente:
 * - ADMIN_EMAIL
 * - ADMIN_PASSWORD
 */

/**
 * Avvio script asincrono
 */
async function run() {
  try {
    /**
     * Connessione database
     */
    await connectDB(process.env.MONGODB_URI);

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    /**
     * Controllo variabili ambiente
     */
    if (!email || !password) {
      console.error("❌ ADMIN_EMAIL o ADMIN_PASSWORD mancanti");
      process.exit(1);
    }

    /**
     * Verifica se admin già esistente
     */
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("ℹ️ Admin già esistente:", email);
      process.exit(0);
    }

    /**
     * Hash password (bcrypt)
     */
    const passwordHash = await bcrypt.hash(password, 10);

    /**
     * Creazione utente admin
     */
    await User.create({
      email,
      passwordHash,
      role: "admin",
    });

    console.log("✅ Admin creato:", email);

    process.exit(0);
  } catch (err) {
    /**
     * Gestione errori script
     */
    console.error("❌ Errore creazione admin:", err.message);
    process.exit(1);
  }
}

/**
 * Avvio script
 */
run();
