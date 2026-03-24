import { sendEmail } from "./sendEmail.js";

/**
 * =========================
 * CREA MESSAGGIO CONTATTO
 * =========================
 * POST /api/contact
 *
 * Gestisce richiesta informazioni immobile:
 * - riceve dati dal form frontend
 * - valida i dati obbligatori
 * - invia email all'admin tramite Resend
 */
export async function createMessage(req, res) {
  try {
    /**
     * =========================
     * ESTRAZIONE DATI DAL BODY
     * =========================
     */
    const {
      name,
      email,
      phone,
      message,
      propertyTitle,
      propertyCity,
      propertyPrice,
      propertyUrl,
    } = req.body;

    /**
     * =========================
     * VALIDAZIONE BASE
     * =========================
     * Controlliamo i campi minimi indispensabili
     * per evitare invii incompleti.
     */
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Dati obbligatori mancanti",
      });
    }

    /**
     * =========================
     * INVIO EMAIL
     * =========================
     * L'admin riceve una mail con tutti i dati del contatto
     * e i riferimenti dell'immobile richiesto.
     */
    await sendEmail({
      subject: `Nuova richiesta immobile: ${propertyTitle || "N/A"}`,
      html: `
        <h2>Nuova richiesta contatto</h2>

        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${phone || "N/A"}</p>
        <p><strong>Messaggio:</strong> ${message}</p>

        <hr />

        <p><strong>Immobile:</strong> ${propertyTitle || "N/A"}</p>
        <p><strong>Città:</strong> ${propertyCity || "N/A"}</p>
        <p><strong>Prezzo:</strong> €${propertyPrice || "N/A"}</p>
        <p><strong>Link:</strong> ${propertyUrl || "N/A"}</p>
      `,
    });

    /**
     * =========================
     * RISPOSTA OK
     * =========================
     */
    return res.status(200).json({
      success: true,
      message: "Email inviata con successo",
    });
  } catch (error) {
    /**
     * =========================
     * ERRORE GENERALE
     * =========================
     */
    console.error("❌ ERRORE CONTROLLER CONTACT:", error);

    return res.status(500).json({
      success: false,
      message: "Errore invio email",
    });
  }
}
