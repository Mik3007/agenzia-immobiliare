import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: process.env.ADMIN_EMAIL,
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

    res.json({ success: true });

  } catch (err) {
    console.error("Errore invio richiesta info:", err);
    res.status(500).json({ message: "Errore invio richiesta" });
  }
}