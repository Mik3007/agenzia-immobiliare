import Review from "../models/Review.js";
import { sendEmail } from "./sendEmail.js";

/* ============================= */
/* CREA RECENSIONE */
/* ============================= */
/**
 * POST /api/reviews
 *
 * Crea una nuova recensione:
 * - valida input base
 * - salva la recensione con stato "pending"
 * - invia mail all'admin
 */
export async function createReview(req, res) {
  try {
    const { name, rating, text } = req.body;

    /**
     * =========================
     * VALIDAZIONE BASE
     * =========================
     */
    if (!name || !text) {
      return res.status(400).json({
        success: false,
        message: "Dati mancanti",
      });
    }

    /**
     * =========================
     * CREAZIONE RECENSIONE
     * =========================
     * La recensione viene salvata come "pending"
     * così l'admin può approvarla manualmente.
     */
    const review = await Review.create({
      name,
      rating,
      text,
      status: "pending",
    });

    /**
     * =========================
     * INVIO EMAIL ADMIN
     * =========================
     * La mail avvisa l'admin che è arrivata
     * una nuova recensione dal sito.
     */
    await sendEmail({
      subject: "Nuova recensione ricevuta",
      html: `
        <h2>Nuova recensione dal sito</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Valutazione:</strong> ${rating || "N/A"} ⭐</p>
        <p><strong>Testo:</strong></p>
        <p>${text}</p>
      `,
    });

    /**
     * =========================
     * RISPOSTA OK
     * =========================
     */
    return res.json({ success: true, review });
  } catch (err) {
    /**
     * =========================
     * ERRORE GENERALE
     * =========================
     */
    console.error("❌ ERRORE CONTROLLER REVIEWS:", err);

    return res.status(500).json({
      success: false,
      message: "Errore creazione recensione",
    });
  }
}

/* ============================= */
/* RECENSIONI APPROVATE PUBBLICHE */
/* ============================= */
/**
 * Recupera solo le recensioni approvate
 * ordinate dalla più recente alla meno recente.
 */
export async function listApprovedReviews(req, res) {
  try {
    const items = await Review.find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json({ items });
  } catch (err) {
    console.error("❌ ERRORE LIST APPROVED REVIEWS:", err);

    return res.status(500).json({
      success: false,
      message: "Errore recupero recensioni approvate",
    });
  }
}

/* ============================= */
/* TUTTE LE RECENSIONI (ADMIN) */
/* ============================= */
/**
 * Recupera tutte le recensioni per dashboard admin.
 */
export async function listAllReviews(req, res) {
  try {
    const items = await Review.find().sort({ createdAt: -1 });

    return res.json({ items });
  } catch (err) {
    console.error("❌ ERRORE LIST ALL REVIEWS:", err);

    return res.status(500).json({
      success: false,
      message: "Errore recupero recensioni",
    });
  }
}

/* ============================= */
/* APPROVA RECENSIONE */
/* ============================= */
/**
 * Aggiorna lo stato della recensione in "approved".
 */
export async function approveReview(req, res) {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Recensione non trovata",
      });
    }

    return res.json(review);
  } catch (err) {
    console.error("❌ ERRORE APPROVE REVIEW:", err);

    return res.status(500).json({
      success: false,
      message: "Errore approvazione recensione",
    });
  }
}

/* ============================= */
/* RIFIUTA RECENSIONE */
/* ============================= */
/**
 * Elimina direttamente la recensione rifiutata.
 */
export async function rejectReview(req, res) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Recensione non trovata",
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("❌ ERRORE REJECT REVIEW:", err);

    return res.status(500).json({
      success: false,
      message: "Errore rifiuto recensione",
    });
  }
}

/* ============================= */
/* ELIMINA RECENSIONE */
/* ============================= */
/**
 * Eliminazione manuale recensione dalla dashboard admin.
 */
export async function deleteReview(req, res) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Recensione non trovata",
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("❌ ERRORE DELETE REVIEW:", err);

    return res.status(500).json({
      success: false,
      message: "Errore eliminazione recensione",
    });
  }
}
