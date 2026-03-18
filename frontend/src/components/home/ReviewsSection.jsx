import { useState } from "react";
import AddReviewModal from "../AddReviewModal";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

/**
 * =========================
 * REVIEWS SECTION
 * =========================
 * Sezione recensioni clienti.
 * 
 * Include:
 * - Lista recensioni paginata
 * - Bottone aggiunta recensione
 * - Modal inserimento recensione
 * - Modal lettura completa recensione
 * - Animazioni con Framer Motion
 */
export default function ReviewsSection({
  reviews,                 // tutte le recensioni
  paginatedReviews,        // recensioni filtrate per pagina
  page,                    // pagina corrente
  setPage,                 // setter pagina
  end,                     // indice fine slice
  reviewModalOpen,         // stato modal aggiunta
  setReviewModalOpen,      // setter modal aggiunta
  loadReviews,             // reload recensioni dopo submit
  formatDate,              // funzione format data
}) {
  // recensione selezionata per modal "continua a leggere"
  const [selectedReview, setSelectedReview] = useState(null);

  return (
    <motion.section
      id="reviews"
      className="px-4 py-16 bg-transparent"
      initial={{ opacity: 0, y: 40 }} // animazione entrata
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* =========================
          CONTAINER PRINCIPALE
      ========================= */}
      <div className="mx-auto max-w-6xl bg-[#ecede7] p-20 rounded-4xl">
        
        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
          
          {/* Titolo */}
          <h2 className="text-2xl font-semibold text-[#282828] text-center md:text-left">
            Dicono di noi
          </h2>

          {/* Bottone apertura modal recensione */}
          <button
            onClick={() => setReviewModalOpen(true)}
            className="rounded-xl px-4 py-2 text-sm font-medium bg-[#44442c] text-[#f0f1eb] hover:bg-[#5a5a3a] transition"
          >
            Aggiungi recensione
          </button>
        </div>

        {/* =========================
            LISTA RECENSIONI
        ========================= */}
        {reviews.length === 0 ? (
          // fallback se non ci sono recensioni
          <p className="text-sm text-[#99997b]">Nessuna recensione ancora.</p>
        ) : (
          <motion.div
            key={page + "-" + paginatedReviews.length} // forza re-render per animazioni
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.12, // animazione a cascata
                },
              },
            }}
          >
            {paginatedReviews.map((r) => {
              // verifica se il testo è lungo (per bottone "continua")
              const isLong = r.text.length > 120;

              return (
                <motion.div
                  key={r._id} // chiave univoca
                  className="rounded-3xl bg-white p-6 shadow-sm flex flex-col justify-between h-60 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.98 },
                    show: { opacity: 1, y: 0, scale: 1 },
                  }}
                >
                  <div>
                    {/* =========================
                        NOME
                    ========================= */}
                    <p className="mb-2 text-sm font-semibold text-[#282828]">
                      {r.name}
                    </p>

                    {/* =========================
                        TESTO (TRONCATO)
                    ========================= */}
                    <p className="text-sm text-[#99997b] line-clamp-3">
                      "{r.text}"
                    </p>

                    {/* =========================
                        CONTINUA A LEGGERE
                    ========================= */}
                    {isLong && (
                      <button
                        onClick={() => setSelectedReview(r)}
                        className="mt-2 text-xs text-[#44442c] font-medium hover:underline"
                      >
                        Continua a leggere
                      </button>
                    )}

                    {/* =========================
                        STELLE RATING
                    ========================= */}
                    <div className="flex gap-1 mt-2 text-yellow-500 text-sm">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>

                  {/* =========================
                      DATA RECENSIONE
                  ========================= */}
                  <p className="mt-4 text-xs text-gray-400">
                    {formatDate(r.createdAt)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* =========================
          PAGINAZIONE
      ========================= */}
      <div className="flex justify-center gap-4 mt-8">
        
        {/* PREV */}
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 rounded-lg bg-[#44442c] text-white disabled:opacity-40"
        >
          ←
        </button>

        {/* NEXT */}
        <button
          disabled={end >= reviews.length}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 rounded-lg bg-[#44442c] text-white disabled:opacity-40"
        >
          →
        </button>
      </div>

      {/* =========================
          MODAL AGGIUNTA RECENSIONE
      ========================= */}
      <AddReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSuccess={loadReviews} // ricarica lista dopo submit
      />

      {/* =========================
          MODAL LETTURA COMPLETA
      ========================= */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReview(null)} // chiusura clic fuori
          >
            <motion.div
              className="max-w-lg w-full rounded-2xl bg-white p-6"
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()} // evita chiusura clic interno
            >
              {/* Nome */}
              <p className="text-lg font-semibold text-[#282828]">
                {selectedReview.name}
              </p>

              {/* Testo completo */}
              <p className="mt-4 text-sm text-[#555] leading-relaxed">
                "{selectedReview.text}"
              </p>

              {/* Stelle */}
              <div className="flex gap-1 mt-3 text-yellow-500">
                {Array.from({ length: selectedReview.rating }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>

              {/* Data */}
              <p className="mt-4 text-xs text-gray-400">
                {formatDate(selectedReview.createdAt)}
              </p>

              {/* Bottone chiusura */}
              <button
                onClick={() => setSelectedReview(null)}
                className="mt-6 w-full rounded-xl px-4 py-2 bg-[#44442c] text-white hover:bg-[#5a5a3a] transition"
              >
                Chiudi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}