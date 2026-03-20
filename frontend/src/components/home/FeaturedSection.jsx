import PropertyCard from "../PropertyCard";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

/**
 * =========================
 * FEATURED SECTION
 * =========================
 * Sezione che mostra gli ultimi immobili inseriti
 * sotto forma di slider orizzontale.
 * 
 * Include:
 * - Header con titolo + CTA
 * - Slider con scroll orizzontale
 * - Fade laterali dinamici
 * - Frecce di navigazione
 * - Animazioni con Framer Motion
 */
export default function FeaturedSection({
  properties,                   // Array immobili da mostrare
  loading,                      // Stato loading (true/false)
  scroll,                       // Funzione per scrollare lo slider (left/right)
  featuredRef,                  // Ref del container scrollabile
  featuredShowLeftFade,         // Boolean → mostra fade sinistro
  featuredShowRightFade,        // Boolean → mostra fade destro
  setFeaturedShowLeftFade,      // Setter fade sinistro
  setFeaturedShowRightFade,     // Setter fade destro
}) {
  const nav = useNavigate(); // Hook per navigazione tra pagine

  return (
    <motion.section
      id="featured"
      className="py-16 bg-white group"
      initial={{ opacity: 0, y: 40 }} // animazione iniziale
      whileInView={{ opacity: 1, y: 0 }} // animazione in viewport
      viewport={{ once: true }} // esegue animazione una sola volta
      transition={{ duration: 0.6 }}
    >
      {/* =========================
          HEADER
      ========================= */}
      <div className="mx-3 max-w-6xl mb-8 flex items-center justify-center gap-4 md:justify-start">
        
        {/* Titolo sezione */}
        <h2 className="text-2xl font-semibold text-[#282828] pb-2.5">
          Ultimi immobili inseriti
        </h2>

        {/* Bottone navigazione pagina immobili */}
        <button
          onClick={() => nav("/immobili")}
          className="text-sm font-medium text-[#44442c] transition md:opacity-0 md:group-hover:opacity-100 hover:text-blue-600"
        >
          Guarda tutti →
        </button>
      </div>

      {/* =========================
          CONTENUTO SLIDER
      ========================= */}
      {loading ? (
        // Loader durante caricamento dati
        <Loader />
      ) : (
        <div className="relative -ml-6 pl-6">
          
          {/* =========================
              FADE SINISTRO
              Compare quando lo slider è scrollato verso destra
          ========================= */}
          {featuredShowLeftFade && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10" />
          )}

          {/* =========================
              FADE DESTRO
              Compare quando ci sono ancora elementi da scrollare
          ========================= */}
          {featuredShowRightFade && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10" />
          )}

          {/* =========================
              FRECCIA SINISTRA
              Scroll manuale verso sinistra
          ========================= */}
          <button
            onClick={() => scroll(featuredRef, "left")}
            className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 text-5xl"
          >
            ‹
          </button>

          {/* =========================
              LISTA IMMOBILI
          ========================= */}
          <motion.div
            ref={featuredRef} // ref usata per scroll programmatico
            onScroll={(e) => {
              const el = e.target;

              // Mostra fade sinistro se siamo scrollati
              setFeaturedShowLeftFade(el.scrollLeft > 10);

              // Mostra fade destro se non siamo alla fine
              setFeaturedShowRightFade(
                el.scrollLeft + el.clientWidth < el.scrollWidth - 10
              );
            }}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pl-6 pr-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08, // animazione a cascata delle card
                },
              },
            }}
          >
            {[...properties]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // 🔥 più recenti prima
              .map((p) => (
              <motion.div
                key={p._id} // chiave univoca per React
                className="min-w-65 sm:min-w-75 lg:min-w-85 snap-start transition-all duration-300 lg:group-hover:brightness-50 lg:hover:brightness-100 lg:hover:min-w-95 lg:hover:shadow-2xl"
                variants={{
                  hidden: { opacity: 0, y: 30 }, // stato iniziale
                  show: { opacity: 1, y: 0 },    // stato visibile
                }}
                transition={{ duration: 0.4 }}
              >
                {/* Card singolo immobile */}
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </motion.div>

          {/* =========================
              FRECCIA DESTRA
              Scroll manuale verso destra
          ========================= */}
          <button
            onClick={() => scroll(featuredRef, "right")}
            className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 text-5xl"
          >
            ›
          </button>
        </div>
      )}
    </motion.section>
  );
}
