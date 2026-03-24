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
try {
  console.log("🚀 Invio email con Resend...");

  const response = await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: process.env.RESEND_TO,
    subject: `Nuova richiesta immobile: ${propertyTitle}`,
    html: `
      <h2>Nuova richiesta contatto</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefono:</strong> ${phone}</p>
      <p><strong>Messaggio:</strong> ${message}</p>
      <hr />
      <p><strong>Immobile:</strong> ${propertyTitle}</p>
      <p><strong>Città:</strong> ${propertyCity}</p>
      <p><strong>Prezzo:</strong> €${propertyPrice}</p>
    `,
  });

  console.log("✅ RESEND RESPONSE:", response);

  res.status(200).json({ success: true });
} catch (error) {
  console.error("❌ ERRORE RESEND:", error);

  res.status(500).json({
    success: false,
    message: "Errore invio email",
  });
}
