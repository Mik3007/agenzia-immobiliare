import { useState } from "react";
import api from "../api/client";

/**
 * =========================
 * ADD REVIEW MODAL
 * =========================
 * Modal per l'invio di una nuova recensione.
 *
 * Funzioni principali:
 * - apertura/chiusura controllata dal parent
 * - inserimento nome, testo e valutazione
 * - submit verso API backend
 * - refresh recensioni dopo invio
 */
export default function AddReviewModal({ open, onClose, onSuccess }) {
  const [name, setName] = useState(""); // nome utente
  const [text, setText] = useState(""); // testo recensione
  const [rating, setRating] = useState(0); // voto selezionato
  const [hover, setHover] = useState(0); // stato hover stelle
  const [loading, setLoading] = useState(false); // loading submit

  // Se il modal non è aperto, non renderizza nulla
  if (!open) return null;

  /**
   * Gestisce invio recensione
   */
  async function handleSubmit(e) {
    e.preventDefault();

    // Controllo valutazione selezionata
    if (rating === 0) {
      alert("Seleziona una valutazione");
      return;
    }

    try {
      setLoading(true);

      // Invio recensione al backend
      await api.post("/api/reviews", {
        name,
        text,
        rating,
      });

      // Reset campi dopo invio
      setName("");
      setText("");
      setRating(0);
      setHover(0);

      // Callback opzionale per refresh dati nel parent
      onSuccess?.();

      // Chiusura modal
      onClose();

      // Feedback utente
      alert("Recensione inviata! Sarà pubblicata dopo approvazione.");
    } catch (err) {
      console.error(err);
      alert("Errore invio recensione");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        {/* =========================
            HEADER
        ========================= */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#282828]">
            Lascia una recensione
          </h3>

          {/* Bottone chiusura */}
          <button onClick={onClose} className="text-sm text-gray-500">
            ✕
          </button>
        </div>

        {/* =========================
            FORM
        ========================= */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* NOME */}
          <input
            required
            placeholder="Il tuo nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 text-sm"
            style={{ borderColor: "rgba(40,40,40,0.12)" }}
          />

          {/* STELLE / VALUTAZIONE */}
          <div>
            <p className="text-sm mb-1 text-[#99997b]">Valutazione</p>

            <div
              className="flex gap-1 text-2xl cursor-pointer"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                // Stella attiva se hover o rating corrente >= n
                const active = n <= (hover || rating);

                return (
                  <span
                    key={n}
                    onMouseEnter={() => setHover(n)}
                    onClick={() => setRating(n)}
                    className={`transition-transform duration-150 ${
                      active ? "text-yellow-500 scale-110" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                );
              })}
            </div>
          </div>

          {/* TESTO RECENSIONE */}
          <textarea
            required
            placeholder="Scrivi la tua esperienza..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows="4"
            className="w-full rounded-xl border px-4 py-3 text-sm resize-none"
            style={{ borderColor: "rgba(40,40,40,0.12)" }}
          />

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="w-full rounded-xl px-4 py-3 text-sm font-medium"
            style={{
              backgroundColor: "#44442c",
              color: "#f0f1eb",
            }}
          >
            {loading ? "Invio..." : "Invia recensione"}
          </button>
        </form>
      </div>
    </div>
  );
}
