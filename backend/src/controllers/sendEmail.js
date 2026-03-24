import { Resend } from "resend";

/**
 * =========================
 * INIZIALIZZAZIONE RESEND
 * =========================
 * Crea una singola istanza del client Resend
 * usando la chiave presente nelle variabili ambiente.
 */
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * =========================
 * FUNZIONE GENERICA INVIO EMAIL
 * =========================
 * Serve per centralizzare l'invio email:
 * - richieste contatto immobile
 * - recensioni
 * - richieste valutazione casa
 *
 * In questo modo evitiamo di duplicare lo stesso codice
 * in più controller.
 *
 * @param {Object} params
 * @param {string} params.subject - Oggetto della mail
 * @param {string} params.html - Corpo HTML della mail
 * @returns {Promise<Object>} risposta di Resend
 */
export async function sendEmail({ subject, html }) {
  try {
    console.log("📩 Invio email con Resend...");

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.RESEND_TO,
      subject,
      html,
    });

    console.log("✅ RESEND RESPONSE:", response);

    return response;
  } catch (error) {
    console.error("❌ ERRORE INVIO EMAIL:", error);
    throw error;
  }
}
