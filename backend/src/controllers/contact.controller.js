import ContactMessage from "../models/ContactMessage.js";

export async function createMessage(req, res, next) {
  try {
    const created = await ContactMessage.create(req.body);

    // Qui puoi integrare Nodemailer / Sendgrid ecc. per inviare email all'agenzia.
    // Per ora salviamo a DB (più semplice e affidabile come prima versione).

    res.status(201).json({ ok: true, id: created._id });
  } catch (err) {
    next(err);
  }
}