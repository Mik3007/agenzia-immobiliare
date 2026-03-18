import express from "express";

/**
 * Controller autenticazione
 */
import { login } from "../controllers/auth.controller.js";

const router = express.Router();

/* ============================= */
/* AUTH ROUTES */
/* ============================= */

/**
 * POST /api/auth/login
 *
 * Login admin:
 * - verifica credenziali
 * - restituisce JWT
 */
router.post("/login", login);

export default router;