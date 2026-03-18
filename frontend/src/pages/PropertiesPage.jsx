import { useEffect, useState } from "react";
import api from "../api/client";
import PropertyCard from "../components/PropertyCard";
import HeroSearch from "../components/HeroSearch";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import Loader from "../components/Loader";

/**
 * =========================
 * PROPERTIES PAGE
 * =========================
 * Pagina lista immobili con:
 * - filtro (HeroSearch)
 * - animazioni (framer motion)
 * - paginazione
 *
 * FIX:
 * - loader coerente
 * - sicurezza su items
 * - fallback pagination corretto
 */
export default function PropertiesPage() {
  const [items, setItems] = useState([]); // lista immobili
  const [loading, setLoading] = useState(true); // stato loading
  const [page, setPage] = useState(1); // pagina corrente
  const [sort] = useState("newest"); // ordinamento
  const [pagination, setPagination] = useState(null); // dati paginazione
  const [showFilter, setShowFilter] = useState(false); // toggle mobile filtro

  const navigate = useNavigate();

  /**
   * =========================
   * RESPONSIVE LIMIT
   * =========================
   * NOTA: non reattivo al resize (accettabile)
   */
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 768;

  const limit = isMobile ? 6 : 12;

  /**
   * =========================
   * LOAD IMMOBILI
   * =========================
   */
  async function load(params = {}) {
    setLoading(true);

    try {
      const res = await api.get("/api/properties", {
        params: { ...params, page, limit, sort },
      });

      // FIX: sicurezza dati
      setItems(res.data?.items || []);
      setPagination(res.data?.pagination || null);

    } catch (err) {
      console.error("Errore immobili:", err);

      // fallback sicurezza
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  /**
   * =========================
   * LOAD SU CAMBIO PAGINA / SORT
   * =========================
   */
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  /**
   * =========================
   * SCROLL TOP PAGINA
   * =========================
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <motion.section
      className="pt-20 pb-10 bg-[#f0f1eb]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mx-auto max-w-6xl px-4">

        {/* =========================
            HEADER
        ========================= */}
        <motion.div
          className="mb-6 text-center md:text-left"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-[#282828]">
            Tutti gli immobili
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Trova la soluzione perfetta per te
          </p>
        </motion.div>

        {/* =========================
            FILTRO MOBILE
        ========================= */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="w-full rounded-xl bg-[#282828] px-4 py-3 text-sm font-medium text-white"
          >
            {showFilter ? "Chiudi ricerca" : "Cerca un immobile"}
          </button>
        </div>

        {/* =========================
            FILTRO
        ========================= */}
        <motion.div
          className={`mb-8 rounded-2xl border bg-white p-6 shadow-sm ${
            showFilter ? "block" : "hidden md:block"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <HeroSearch
            compact
            onSearch={(params) => {
              setPage(1);
              load(params);
            }}
          />
        </motion.div>

        {/* =========================
            HEADER RISULTATI
        ========================= */}
        <div className="flex justify-between items-center my-10">
          <p className="text-sm font-medium">
            {/* FIX: total gestito correttamente */}
            {pagination?.total ?? items.length} immobili trovati
          </p>

          <button
            onClick={() => navigate("/")}
            className="text-sm underline hover:opacity-70 cursor-pointer"
          >
            ← Torna alla home
          </button>
        </div>

        {/* =========================
            GRID / LOADER
        ========================= */}
        {loading ? (
          /**
           * FIX: loader coerente con resto app
           */
          <div className="py-16">
            <Loader />
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            Nessun immobile trovato.
          </div>
        ) : (
          <motion.div
            className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
            key={page} // reset animazioni
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {(items || []).map((item) => (
              <motion.div
                key={item._id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
                whileHover={{
                  y: -6,
                  scale: 1.04,
                }}
              >
                <PropertyCard property={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* =========================
            PAGINAZIONE
        ========================= */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-12 flex flex-col items-center gap-4">

            {/* MOBILE */}
            <div className="flex items-center gap-4 md:hidden">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40"
              >
                ←
              </button>

              <span className="text-sm font-medium">
                Pagina {page} / {pagination.pages}
              </span>

              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
                disabled={page === pagination.pages}
                className="px-4 py-2 rounded-lg border bg-white disabled:opacity-40"
              >
                →
              </button>
            </div>

            {/* DESKTOP */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                ←
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => {
                const pageNumber = i + 1;

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`px-3 py-1 border rounded ${
                      pageNumber === page
                        ? "bg-[#282828] text-white"
                        : "hover:opacity-70"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
                disabled={page === pagination.pages}
                className="px-3 py-1 border rounded disabled:opacity-40"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}