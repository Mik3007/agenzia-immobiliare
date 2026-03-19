import express from "express";
import multer from "multer";
import path from "path";

/**
 * Middleware autenticazione (route admin)
 */
import { requireAuth } from "../middleware/auth.js";

/**
 * Controllers
 */
import {
  createProperty,
  deleteProperty,
  getFeatured,
  getPropertyById,
  listProperties,
  updateProperty,
  uploadImages,
  getLatest,
  deleteImage,
} from "../controllers/properties.controller.js";

const router = express.Router();

/* ============================= */
/* CONFIGURAZIONE MULTER */
/* ============================= */
/**
 * Gestione upload file locali temporanei:
 * - salviamo in /src/uploads
 * - rinominiamo file per evitare collisioni
 */
const storage = multer.memoryStorage();

/**
 * Config multer:
 * - limite 15MB per file
 */
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

/* ============================= */
/* ROUTE PUBBLICHE */
/* ============================= */

/**
 * GET /api/properties
 * Lista immobili con filtri
 */
router.get("/", listProperties);

/**
 * GET /api/properties/featured
 * Immobili in evidenza
 */
router.get("/featured", getFeatured);

/**
 * GET /api/properties/latest
 * Ultimi immobili inseriti
 * ⚠️ deve stare prima di /:id
 */
router.get("/latest", getLatest);

/**
 * GET /api/properties/:id
 * Dettaglio immobile
 */
router.get("/:id", getPropertyById);

/* ============================= */
/* ROUTE PROTETTE (ADMIN) */
/* ============================= */

/**
 * POST /api/properties
 * Creazione immobile
 */
router.post("/", requireAuth, createProperty);

/**
 * PUT /api/properties/:id
 * Modifica immobile
 */
router.put("/:id", requireAuth, updateProperty);

/**
 * DELETE /api/properties/:id
 * Eliminazione immobile + immagini Cloudinary
 */
router.delete("/:id", requireAuth, deleteProperty);

/* ============================= */
/* UPLOAD IMMAGINI */
/* ============================= */

/**
 * POST /api/properties/upload/images
 * Upload multiplo immagini
 */
router.post(
  "/upload/images",
  requireAuth,
  upload.array("images", 30),
  uploadImages
);

/**
 * DELETE /api/properties/upload/image
 * Eliminazione singola immagine Cloudinary
 */
router.delete("/upload/image", requireAuth, deleteImage);

export default router;
