// backend/src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import reviewsRoutes from "./routes/reviews.routes.js";
import authRoutes from "./routes/auth.routes.js";
import propertiesRoutes from "./routes/properties.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import { notFound, errorHandler } from "./middleware/error.js";
import valuationRoutes from "./routes/valuation.routes.js";

const app = express();

/**
 * CORS: limita le richieste al frontend.
 * Se deployi, aggiorna origin con il dominio reale.
 */
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" })); // body JSON (per form e payload)
app.use(morgan("dev")); // log richieste in dev
app.use("/api/reviews", reviewsRoutes);

/**
 * Static per immagini caricate:
 * - quando carichi un'immagine, la salviamo in /src/uploads
 * - la esponiamo come URL pubblico: http://localhost:5000/uploads/<file>
 */
app.use("/uploads", express.static(path.resolve("src/uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertiesRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/valuation", valuationRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
