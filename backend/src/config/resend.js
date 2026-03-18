import { Resend } from "resend";

/**
 * =========================
 * CONFIGURAZIONE RESEND
 * =========================
 * Servizio per invio email:
 * - recensioni
 * - contatti
 * - valutazioni
 *
 * Usa API KEY da variabili ambiente
 */
export const resend = new Resend(process.env.RESEND_API_KEY);