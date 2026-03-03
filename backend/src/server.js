// backend/src/server.js
import "dotenv/config";
import dns from "dns";

// 👇 forziamo i DNS che supportano SRV
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

console.log("MONGO URI ->", process.env.MONGODB_URI);

await connectDB(process.env.MONGODB_URI);

app.listen(PORT, () => {
  console.log(`🚀 Backend attivo su http://localhost:${PORT}`);
});