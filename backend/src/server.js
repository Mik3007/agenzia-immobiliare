// =========================
// CONFIG ENV
// =========================
import "dotenv/config";

// =========================
// DNS FIX (Mongo Atlas)
// =========================
import dns from "dns";

// Evita problemi SRV Mongo (alcuni ISP italiani)
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// =========================
// IMPORT APP + DB
// =========================
import app from "./app.js";
import { connectDB } from "./config/db.js";

// =========================
// PORTA SERVER
// =========================
const PORT = process.env.PORT || 5000;

// =========================
// START SERVER
// =========================
async function startServer() {
  try {
    // Connessione MongoDB
    await connectDB(process.env.MONGODB_URI);

    // Avvio server SOLO dopo connessione DB
    app.listen(PORT, () => {
      console.log(`🚀 Backend attivo su http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Errore avvio server:", error.message);
    process.exit(1);
  }
}

// Avvio app
startServer();