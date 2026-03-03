// backend/src/routes/properties.routes.js
import express from "express";
import multer from "multer";
import path from "path";
import { requireAuth } from "../middleware/auth.js";
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

/* ---------------- MULTER ---------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "src/uploads"),
  filename: (req, file, cb) => {
    const safeExt = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

/* ---------------- ROUTE PUBBLICHE ---------------- */

router.get("/", listProperties);
router.get("/featured", getFeatured);
router.get("/latest", getLatest); // ✅ prima della dinamica
router.get("/:id", getPropertyById);

/* ---------------- ROUTE PROTETTE ---------------- */

router.post("/", requireAuth, createProperty);
router.put("/:id", requireAuth, updateProperty);
router.delete("/:id", requireAuth, deleteProperty);

/* ---------------- UPLOAD IMMAGINI ---------------- */

router.post(
  "/upload/images",
  requireAuth,
  upload.array("images", 30),
  uploadImages,
);
router.delete("/upload/image", requireAuth, deleteImage);

export default router;
