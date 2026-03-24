import { sendEmail } from "./sendEmail.js";

/**
 * =========================
 * RICHIESTA VALUTAZIONE
 * =========================
 * POST /api/valuation
 *
 * Gestisce richiesta valutazione immobile:
 * - riceve dati dal form
 * - valida i dati obbligatori
 * - invia email all'admin
 */
export async function sendValuationRequest(req, res) {
  try {
    const {
      nome,
      cognome,
      telefono,
      email,
      city,
      address,
      type,
      sqm,
      rooms,
      bathrooms,
      floor,
      condition,
      estimatedPrice,
      message,
    } = req.body;

    /**
     * =========================
     * VALIDAZIONE BASE
     * =========================
     */
    if (!nome || !telefono || !email || !city) {
      return res.status(400).json({
        success: false,
        message: "Dati obbligatori mancanti",
      });
    }

    /**
     * =========================
     * INVIO EMAIL
     * =========================
     * L'admin riceve una mail completa con i dati
     * della richiesta di valutazione.
     */
    await sendEmail({
      subject: "Richiesta valutazione casa",
      html: `
        <h2>Nuova richiesta valutazione immobile</h2>

        <h3>Dati proprietario</h3>
        <p><strong>Nome:</strong> ${nome} ${cognome || ""}</p>
        <p><strong>Telefono:</strong> ${telefono}</p>
        <p><strong>Email:</strong> ${email}</p>

        <h3>Dati immobile</h3>
        <p><strong>Città:</strong> ${city}</p>
        <p><strong>Indirizzo:</strong> ${address || "-"}</p>
        <p><strong>Tipologia:</strong> ${type || "-"}</p>
        <p><strong>Metri quadri:</strong> ${sqm || "-"}</p>
        <p><strong>Locali:</strong> ${rooms || "-"}</p>
        <p><strong>Bagni:</strong> ${bathrooms || "-"}</p>
        <p><strong>Piano:</strong> ${floor || "-"}</p>
        <p><strong>Stato immobile:</strong> ${condition || "-"}</p>
        <p><strong>Valore stimato proprietario:</strong> ${estimatedPrice || "-"} €</p>

        <h3>Messaggio</h3>
        <p>${message || "-"}</p>
      `,
    });

    /**
     * =========================
     * RISPOSTA OK
     * =========================
     */
    return res.json({ success: true });
  } catch (err) {
    /**
     * =========================
     * ERRORE GENERALE
     * =========================
     */
    console.error("❌ ERRORE CONTROLLER VALUATION:", err);

    return res.status(500).json({
      success: false,
      message: "Errore invio richiesta valutazione",
    });
  }
}
