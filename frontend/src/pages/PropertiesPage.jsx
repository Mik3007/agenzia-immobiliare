import { useEffect, useState } from "react";
import api from "../api/client";
import PropertyCard from "../components/PropertyCard";
import HeroSearch from "../components/HeroSearch";
import { useNavigate } from "react-router-dom";

export default function PropertiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort] = useState("newest");
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  async function load(params = {}) {
    setLoading(true);

    try {
      const res = await api.get("/api/properties", {
        params: {
          ...params,
          page,
          limit: 12,
          sort,
        },
      });

      setItems(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);
  return (
    <section className="py-10 ">
      <div className="mx-auto max-w-6xl px-4">
        {/* TITOLO PAGINA */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-[#282828]">
            Tutti gli immobili
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Trova la soluzione perfetta per te
          </p>
        </div>

        {/* FILTRO COMPATTO */}
        <div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
          <HeroSearch
            compact
            onSearch={(params) => {
              setPage(1);
              load(params);
            }}
          />
        </div>

        {/* HEADER RISULTATI */}
        <div className="flex justify-between items-center my-10">
          <p className="text-sm font-medium">
            {pagination?.total || items.length} immobili trovati
          </p>

          <button
            onClick={() => navigate("/")}
            className="text-sm underline hover:opacity-70 cursor-pointer"
          >
            ← Torna alla home
          </button>
        </div>

        {/* GRID CARD */}
        {loading ? (
          <div className="py-16 text-center text-gray-500">
            Caricamento immobili…
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            Nessun immobile trovato.
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <PropertyCard key={item._id} property={item} />
            ))}
          </div>
        )}
        {/* PAGINAZIONE */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-2">
            {/* PREVIOUS */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              ←
            </button>

            {/* NUMERI PAGINA */}
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

            {/* NEXT */}
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
