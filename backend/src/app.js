/**
 * Import principali
 */
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

/**
 * Import routes (ogni modulo gestisce una parte dell'API)
 */
import reviewsRoutes from "./routes/reviews.routes.js";
import authRoutes from "./routes/auth.routes.js";
import propertiesRoutes from "./routes/properties.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import valuationRoutes from "./routes/valuation.routes.js";

/**
 * Middleware gestione errori
 */
import { notFound, errorHandler } from "./middleware/error.js";

// Inizializzazione app Express
const app = express();

/**
 * =========================
 * CORS CONFIGURATION
 * =========================
 * Permette richieste solo dal frontend autorizzato.
 * In produzione: usa dominio Vercel del cliente.
 */
app.use(
  cors({
    origin: (origin, callback) => {
      // permette richieste server-side / postman
      if (!origin) return callback(null, true);

      const allowed = process.env.CLIENT_URL?.replace(/\/$/, "");

      const requestOrigin = origin.replace(/\/$/, "");

      if (requestOrigin === allowed) {
        return callback(null, true);
      }

      return callback(new Error("CORS non autorizzato: " + origin));
    },
    credentials: true,
  })
);

/**
 * =========================
 * BODY PARSER
 * =========================
 * Limite 2mb per sicurezza (upload JSON, form, ecc.)
 */
app.use(express.json({ limit: "2mb" }));

/**
 * =========================
 * LOGGER (solo sviluppo)
 * =========================
 * Morgan mostra le richieste in console
 */
app.use(morgan("dev"));

/**
 * =========================
 * STATIC FILES
 * =========================
 * Espone le immagini caricate in locale
 * URL finale:
 * http://localhost:5000/uploads/<filename>
 */
app.use("/uploads", express.static(path.resolve("src/uploads")));

/**
 * =========================
 * API ROUTES
 * =========================
 * Ogni rotta è separata per dominio logico
 */
app.use("/api/reviews", reviewsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/valuation", valuationRoutes);

/**
 * =========================
 * ERROR HANDLING
 * =========================
 * - notFound → route inesistenti
 * - errorHandler → gestione centralizzata errori
 */
app.use(notFound);
app.use(errorHandler);

export default app;