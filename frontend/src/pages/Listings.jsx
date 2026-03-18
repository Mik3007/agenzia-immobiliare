import { useEffect, useState } from "react";
import api from "../api/client";
import PropertyCard from "../components/PropertyCard";
import Filters from "../components/Filters";
import Loader from "../components/Loader"; // loader per UX

/**
 * =========================
 * LISTINGS PAGE
 * =========================
 * Pagina elenco immobili con:
 * - filtri
 * - paginazione
 * - grid card
 *
 * FIX:
 * - gestione errori API (try/catch)
 * - loading state (UX)
 * - sicurezza su dati (no crash)
 */
export default function Listings() {
  /* =========================
     FILTRI
  ========================= */
  const [filters, setFilters] = useState({
    city: "",
    contract: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  /* =========================
     DATI
  ========================= */
  const [items, setItems] = useState([]); // immobili
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
  });

  /* =========================
     LOADING
  ========================= */
  const [loading, setLoading] = useState(false);

  /**
   * =========================
   * LOAD IMMOBILI
   * =========================
   * - costruisce query
   * - pulisce parametri vuoti
   * - chiama API
   */
  async function load(page = 1) {
    try {
      setLoading(true); // start loader

      const params = {
        ...filters,
        page,
        limit: 12,
      };

      /**
       * RIMUOVE PARAMETRI VUOTI
       * evita query tipo ?city=&type=
       */
      Object.keys(params).forEach((k) => {
        if (params[k] === "") delete params[k];
      });

      // chiamata API
      const res = await api.get("/api/properties", { params });

      /**
       * FIX: sicurezza dati
       * evita crash se API cambia struttura
       */
      setItems(res.data?.items || []);
      setPagination(res.data?.pagination || { page: 1, pages: 1 });
    } catch (err) {
      console.error("Errore caricamento immobili:", err);

      // fallback sicurezza
      setItems([]);
    } finally {
      setLoading(false); // stop loader
    }
  }

  /**
   * =========================
   * LOAD INIZIALE
   * =========================
   */
  useEffect(() => {
    load(1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* =========================
          HEADER
      ========================= */}
      <h1 className="text-2xl font-semibold">Immobili</h1>

      <p className="mt-2 text-sm text-gray-600">
        Personalizza filtri, card e layout per renderlo simile al tuo
        riferimento.
      </p>

      {/* =========================
          FILTRI
      ========================= */}
      <div className="mt-6">
        <Filters
          filters={filters}
          onChange={setFilters}
          onSubmit={() => load(1)} // reset pagina su nuova ricerca
        />
      </div>

      {/* =========================
          GRID / LOADER
      ========================= */}
      <div className="mt-6">
        {loading ? (
          /**
           * LOADER DURANTE FETCH
           */
          <Loader />
        ) : (
          /**
           * FIX: sicurezza su items
           * evita crash se undefined
           */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(items || []).map((p) => (
              <PropertyCard key={p._id} p={p} />
            ))}
          </div>
        )}
      </div>

      {/* =========================
          PAGINAZIONE
      ========================= */}
      <div className="mt-8 flex items-center justify-center gap-3">
        {/* PREV */}
        <button
          className="rounded-xl border px-4 py-2 text-sm disabled:opacity-40"
          disabled={pagination.page <= 1}
          onClick={() => load(pagination.page - 1)}
        >
          Prev
        </button>

        {/* INFO PAGINA */}
        <p className="text-sm text-gray-600">
          Pagina {pagination.page} / {pagination.pages}
        </p>

        {/* NEXT */}
        <button
          className="rounded-xl border px-4 py-2 text-sm disabled:opacity-40"
          disabled={pagination.page >= pagination.pages}
          onClick={() => load(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </main>
  );
}
