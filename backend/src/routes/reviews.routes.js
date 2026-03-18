import express from "express";

/**
 * Controllers (logica business)
 */
import {
  createReview,
  listApprovedReviews,
  listAllReviews,
  approveReview,
  rejectReview,
  deleteReview,
} from "../controllers/reviews.controller.js";

/**
 * Middleware autenticazione admin
 */
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/* ============================= */
/* PUBLIC ROUTES */
/* ============================= */

/**
 * POST /api/reviews
 * - Creazione recensione (utente pubblico)
 */
router.post("/", createReview);

/**
 * GET /api/reviews
 * - Recupero recensioni APPROVATE (visibili sul sito)
 */
router.get("/", listApprovedReviews);

/* ============================= */
/* ADMIN ROUTES (PROTETTE) */
/* ============================= */

/**
 * GET /api/reviews/admin
 * - Tutte le recensioni (dashboard admin)
 */
router.get("/admin", requireAuth, listAllReviews);

/**
 * ⚠️ DUPLICATO (lo lasciamo per non rompere nulla)
 * GET /api/reviews/admin/all
 * - stessa cosa di sopra
 */
router.get("/admin/all", requireAuth, listAllReviews);

/**
 * PATCH /api/reviews/:id/approve
 * - Approva recensione
 */
router.patch("/:id/approve", requireAuth, approveReview);

/**
 * PATCH /api/reviews/:id/reject
 * - Rifiuta (elimina) recensione
 */
router.patch("/:id/reject", requireAuth, rejectReview);

/**
 * DELETE /api/reviews/:id
 * - Eliminazione manuale admin
 */
router.delete("/:id", requireAuth, deleteReview);

export default router;