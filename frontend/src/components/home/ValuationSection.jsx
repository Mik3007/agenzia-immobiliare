import ValuationModal from "../ValuationModal";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

/**
 * =========================
 * VALUATION SECTION
 * =========================
 * Sezione CTA per richiedere la valutazione di un immobile.
 * 
 * Include:
 * - Titolo
 * - Descrizione
 * - Bottone apertura modal
 * - Modal esterno per il form
 */
export default function ValuationSection({
  valuationModalOpen,        // stato apertura modal
  setValuationModalOpen,     // setter apertura/chiusura modal
}) {
  return (
    <>
      {/* =========================
          SEZIONE PRINCIPALE
      ========================= */}
      <motion.section
        id="valuation" // anchor per scroll/navigation
        className="px-4 py-20 bg-transparent"
        initial={{ opacity: 0, y: 30 }} // animazione entrata
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Container centrato */}
        <div className="mx-auto max-w-4xl text-center">

          {/* =========================
              TITOLO
          ========================= */}
          <motion.h2
            className="text-3xl font-semibold text-[#f0f1eb]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Scopri quanto vale la tua casa
          </motion.h2>

          {/* =========================
              DESCRIZIONE
          ========================= */}
          <motion.p
            className="mt-4 text-sm text-[#f0f1eb]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Richiedi una valutazione gratuita e senza impegno.
          </motion.p>

          {/* =========================
              CTA BUTTON
          ========================= */}
          <motion.button
            onClick={() => setValuationModalOpen(true)} // apre il modal
            className="mt-8 rounded-2xl bg-[#f0f1eb] px-6 py-3 text-sm font-medium text-[#282828] hover:opacity-90 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Richiedi valutazione
          </motion.button>

        </div>
      </motion.section>

      {/* =========================
          MODAL VALUTAZIONE
      ========================= */}
      <ValuationModal
        open={valuationModalOpen} // controlla visibilità
        onClose={() => setValuationModalOpen(false)} // chiusura modal
      />
    </>
  );
}