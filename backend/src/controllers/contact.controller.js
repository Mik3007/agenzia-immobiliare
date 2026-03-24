import { Resend } from "resend";

/**
 * =========================
 * INIZIALIZZAZIONE RESEND
 * =========================
 * Usa la API key dalle variabili ambiente (Render)
 */
const resend = new Resend(process.env.RESEND_API_KEY);

/* ============================= */
/* CREA MESSAGGIO CONTATTO */
/* ============================= */
/**
 * POST /api/contact
 *
 * Gestisce richiesta informazioni immobile:
 * - riceve dati dal form frontend
 * - valida i dati
 * - invia email all'admin tramite Resend
 */
export async function createMessage(req, res) {
  try {
    /**
     * =========================
     * ESTRAZIONE DATI
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
     */
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Dati obbligatori mancanti",
      });
    }

    /**
     * =========================
     * INVIO EMAIL CON RESEND
     * =========================
     */
    try {
      console.log("🚀 Invio email con Resend...");

      const response = await resend.emails.send({
        from: process.env.RESEND_FROM, // es: info@biscardimmobiliare.it
        to: process.env.RESEND_TO,     // es: biscardimmobiliare@libero.it
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
       * Log risposta Resend (debug)
       */
      console.log("✅ RESEND RESPONSE:", response);

      /**
       * Risposta successo frontend
       */
      return res.status(200).json({
        success: true,
        message: "Email inviata con successo",
      });

    } catch (error) {
      /**
       * Errore specifico Resend
       */
      console.error("❌ ERRORE RESEND:", error);

      return res.status(500).json({
        success: false,
        message: "Errore invio email",
      });
    }

  } catch (error) {
    /**
     * Errore generale controller
     */
    console.error("❌ ERRORE CONTROLLER:", error);

    return res.status(500).json({
      success: false,
      message: "Errore server",
    });
  }
}
