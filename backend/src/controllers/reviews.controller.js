import Review from "../models/Review.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* ============================= */
/* CREA RECENSIONE */
/* ============================= */
export async function createReview(req, res) {
  try {
    const { name, rating, text } = req.body;

    if (!name || !text) {
      return res.status(400).json({ message: "Dati mancanti" });
    }

    const review = await Review.create({
      name,
      rating,
      text,
      status: "pending",
    });

    /* invio mail admin */
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: process.env.ADMIN_EMAIL,
        subject: "Nuova recensione ricevuta",
        html: `
          <h2>Nuova recensione dal sito</h2>
          <p><b>Nome:</b> ${name}</p>
          <p><b>Valutazione:</b> ${rating} ⭐</p>
          <p><b>Testo:</b></p>
          <p>${text}</p>
        `,
      });
    } catch (err) {
      console.log("Errore invio email:", err.message);
    }

    res.json({ success: true, review });
  } catch (err) {
    console.error("Errore createReview:", err);
    res.status(500).json({ message: "Errore creazione recensione" });
  }
}

/* ============================= */
/* RECENSIONI APPROVATE PUBBLICHE */
/* ============================= */
export async function listApprovedReviews(req, res) {
  try {
    const items = await Review.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ items });
  } catch (err) {
    console.error("Errore listApprovedReviews:", err);
    res.status(500).json({ message: "Errore caricamento recensioni" });
  }
}

/* ============================= */
/* TUTTE LE RECENSIONI (ADMIN) */
/* ============================= */
export async function listAllReviews(req, res) {
  try {
    const items = await Review.find().sort({ createdAt: -1 });

    res.json({ items });
  } catch (err) {
    console.error("Errore listAllReviews:", err);
    res.status(500).json({ message: "Errore caricamento recensioni admin" });
  }
}

/* ============================= */
/* APPROVA RECENSIONE */
/* ============================= */
export async function approveReview(req, res) {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    res.json(review);
  } catch (err) {
    console.error("Errore approveReview:", err);
    res.status(500).json({ message: "Errore approvazione recensione" });
  }
}

/* ============================= */
/* RIFIUTA RECENSIONE */
/* (la cancelliamo direttamente) */
/* ============================= */
export async function rejectReview(req, res) {
  try {
    await Review.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    console.error("Errore rejectReview:", err);
    res.status(500).json({ message: "Errore rifiuto recensione" });
  }
}

/* ============================= */
/* ELIMINA RECENSIONE */
/* ============================= */
export async function deleteReview(req, res) {
  try {
    await Review.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    console.error("Errore deleteReview:", err);
    res.status(500).json({ message: "Errore eliminazione recensione" });
  }
}