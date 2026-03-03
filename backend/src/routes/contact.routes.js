import express from "express";
import { createMessage } from "../controllers/contact.controller.js";

const router = express.Router();

// Pubblica: salva messaggio (poi puoi inviarlo via email con nodemailer se vuoi)
router.post("/", createMessage);

export default router;