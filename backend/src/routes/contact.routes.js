import express from "express";

/**
 * Controller gestione contatti
 */
import { createMessage } from "../controllers/contact.controller.js";

const router = express.Router();

/* ============================= */
/* CONTACT ROUTES */
/* ============================= */

/**
 * POST /api/contact
 *
 * Invio messaggio contatto:
 * - salva nel database
 * - opzionale: invio email (Resend / Nodemailer)
 */
router.post("/", createMessage);

export default router;