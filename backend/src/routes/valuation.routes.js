import express from "express";

/**
 * Controller valutazione immobile
 */
import { sendValuationRequest } from "../controllers/valuation.controller.js";

const router = express.Router();

/* ============================= */
/* VALUATION ROUTES */
/* ============================= */

/**
 * POST /api/valuation
 *
 * Richiesta valutazione immobile:
 * - invio dati dal form frontend
 * - gestione lato backend (email / salvataggio)
 */
router.post("/", sendValuationRequest);

export default router;