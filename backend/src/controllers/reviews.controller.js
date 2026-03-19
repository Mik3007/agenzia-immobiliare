import Review from "../models/Review.js";
import { Resend } from "resend";

// Inizializzazione servizio email (Resend)
const resend = new Resend(process.env.RESEND_API_KEY);

/* ============================= */
/* CREA RECENSIONE */
/* ============================= */
export async function createReview(req, res) {
  try {
    const { name, rating, text } = req.body;

    /**
     * Validazione base input
     */
    if (!name || !text) {
      res.status(400);
      throw new Error("Dati mancanti");
    }

    /**
     * Creazione recensione:
     * - status "pending" → approvazione manuale admin
     */
    const review = await Review.create({
      name,
      rating,
      text,
      status: "pending",
    });

    /**
     * Invio email admin (non blocca la richiesta)
     */
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: process.env.RESEND_TO,
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
      /**
       * NON blocchiamo il flusso se la mail fallisce
       * (scelta corretta lato UX)
       */
      console.error("⚠️ Errore invio email:", err.message);
    }

    res.json({ success: true, review });
  } catch (err) {
    /**
     * Passaggio errore al middleware globale
     */
    throw err;
  }
}

/* ============================= */
/* RECENSIONI APPROVATE PUBBLICHE */
/* ============================= */
export async function listApprovedReviews(req, res) {
  try {
    /**
     * Recupero solo recensioni approvate
     * ordinate per data (più recenti prima)
     */
    const items = await Review.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ items });
  } catch (err) {
    throw err;
  }
}

/* ============================= */
/* TUTTE LE RECENSIONI (ADMIN) */
/* ============================= */
export async function listAllReviews(req, res) {
  try {
    /**
     * Recupero completo per dashboard admin
     */
    const items = await Review.find().sort({ createdAt: -1 });

    res.json({ items });
  } catch (err) {
    throw err;
  }
}

/* ============================= */
/* APPROVA RECENSIONE */
/* ============================= */
export async function approveReview(req, res) {
  try {
    /**
     * Aggiornamento stato → approved
     */
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true },
    );

    /**
     * Controllo se esiste
     */
    if (!review) {
      res.status(404);
      throw new Error("Recensione non trovata");
    }

    res.json(review);
  } catch (err) {
    throw err;
  }
}

/* ============================= */
/* RIFIUTA RECENSIONE */
/* ============================= */
export async function rejectReview(req, res) {
  try {
    /**
     * Eliminazione diretta (scelta progettuale)
     */
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error("Recensione non trovata");
    }

    res.json({ success: true });
  } catch (err) {
    throw err;
  }
}

/* ============================= */
/* ELIMINA RECENSIONE */
/* ============================= */
export async function deleteReview(req, res) {
  try {
    /**
     * Eliminazione manuale da admin
     */
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error("Recensione non trovata");
    }

    res.json({ success: true });
  } catch (err) {
    throw err;
  }
}
