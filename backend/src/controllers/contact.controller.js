import { Resend } from "resend";

/**
 * Inizializzazione servizio email
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
 * - invia email all'admin
 */
export async function createMessage(req, res) {
  try {
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
     * Validazione base
     */
    if (!name || !email || !message) {
      res.status(400);
      throw new Error("Dati obbligatori mancanti");
    }

    /**
     * Invio email tramite Resend
     */
    await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: process.env.RESEND_TO,
      subject: "Richiesta informazioni immobile",
      html: `
        <h2>Nuova richiesta informazioni</h2>

        <h3>Dati cliente</h3>
        <p><b>Nome:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Telefono:</b> ${phone || "-"}</p>

        <h3>Messaggio</h3>
        <p>${message}</p>

        <h3>Immobile</h3>
        <p><b>Titolo:</b> ${propertyTitle}</p>
        <p><b>Città:</b> ${propertyCity}</p>
        <p><b>Prezzo:</b> € ${propertyPrice}</p>

        <p>
          <b>Link immobile:</b><br/>
          <a href="${propertyUrl}">
            ${propertyUrl}
          </a>
        </p>
      `,
    });

    /**
     * Risposta positiva
     */
    res.json({ success: true });
  } catch (err) {
    /**
     * Passaggio errore al middleware globale
     */
    throw err;
  }
}
