import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.ADMIN_EMAIL,
      subject: "Richiesta valutazione casa",
      html: `
        <h2>Nuova richiesta valutazione immobile</h2>

        <h3>Dati proprietario</h3>
        <p><b>Nome:</b> ${nome} ${cognome}</p>
        <p><b>Telefono:</b> ${telefono}</p>
        <p><b>Email:</b> ${email}</p>

        <h3>Dati immobile</h3>
        <p><b>Città:</b> ${city}</p>
        <p><b>Indirizzo:</b> ${address}</p>
        <p><b>Tipologia:</b> ${type}</p>
        <p><b>Metri quadri:</b> ${sqm}</p>
        <p><b>Locali:</b> ${rooms}</p>
        <p><b>Bagni:</b> ${bathrooms}</p>
        <p><b>Piano:</b> ${floor}</p>
        <p><b>Stato immobile:</b> ${condition}</p>
        <p><b>Valore stimato proprietario:</b> ${estimatedPrice} €</p>

        <h3>Messaggio</h3>
        <p>${message || "-"}</p>
      `,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Errore invio valutazione:", err);
    res.status(500).json({ message: "Errore invio richiesta valutazione" });
  }
}