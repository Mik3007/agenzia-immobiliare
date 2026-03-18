// Carica automaticamente le variabili d'ambiente da .env
import "dotenv/config";

// Modulo DNS di Node.js
import dns from "dns";

/**
 * Forziamo l'utilizzo di DNS pubblici (Google + Cloudflare)
 * per evitare problemi con MongoDB Atlas (SRV record)
 * soprattutto su alcune reti / provider italiani
 */
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Import dell'app Express già configurata
import app from "./app.js";

// Funzione per connettersi al database MongoDB
import { connectDB } from "./config/db.js";

// Porta del server (Render fornirà PORT in produzione)
const PORT = process.env.PORT || 5000;

/**
 * Avvio asincrono del server:
 * - Connessione al DB
 * - Avvio Express SOLO dopo connessione riuscita
 */
async function startServer() {
  try {
    // Connessione a MongoDB
    await connectDB(process.env.MONGODB_URI);

    // Avvio server
    app.listen(PORT, () => {
      console.log(`🚀 Backend attivo su http://localhost:${PORT}`);
    });
  } catch (error) {
    /**
     * Se il DB non si connette:
     * - logghiamo errore
     * - blocchiamo il server (process.exit)
     */
    console.error("❌ Errore avvio server:", error.message);
    process.exit(1);
  }
}

// Avvio applicazione
startServer();