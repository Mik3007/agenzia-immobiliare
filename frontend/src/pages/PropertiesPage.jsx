import { useEffect, useState } from "react";
import api from "../api/client";
import PropertyCard from "../components/PropertyCard";
import HeroSearch from "../components/HeroSearch";
import { useNavigate } from "react-router-dom";

export default function PropertiesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load(params = {}) {
    setLoading(true);

    const res = await api.get("/api/properties", {
      params: {
        ...params,
        limit: 200,
      },
    });

    // ORDINAMENTO PREZZO CRESCENTE
    const sorted = res.data.items.sort((a, b) => a.price - b.price);

    setItems(sorted);
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchProperties() {
      try {
        setLoading(true);

        const res = await api.get("/api/properties", {
          params: { limit: 200 },
        });

        if (cancelled) return;

        const sorted = (res.data.items || [])
          .slice()
          .sort((a, b) => Number(a.price ?? 0) - Number(b.price ?? 0));

        setItems(sorted);
      } catch (err) {
        console.error(err);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProperties();

    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <section className="py-10">
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
          <HeroSearch compact onSearch={load} />
        </div>

        {/* HEADER RISULTATI */}
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">{items.length} immobili trovati</p>

          <button
            onClick={() => navigate("/")}
            className="text-sm underline hover:opacity-70"
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <PropertyCard key={item._id} property={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
