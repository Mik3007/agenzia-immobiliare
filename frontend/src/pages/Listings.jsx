import { useEffect, useState } from "react";
import api from "../api/client";
import PropertyCard from "../components/PropertyCard";
import Filters from "../components/Filters";

export default function Listings() {
  const [filters, setFilters] = useState({
    city: "",
    contract: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  async function load(page = 1) {
    const params = {
      ...filters,
      page,
      limit: 12,
    };

    // Pulizia: non inviare query vuote
    Object.keys(params).forEach((k) => {
      if (params[k] === "") delete params[k];
    });

    const res = await api.get("/api/properties", { params });
    setItems(res.data.items);
    setPagination(res.data.pagination);
  }

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Immobili</h1>
      <p className="mt-2 text-sm text-gray-600">
        Personalizza filtri, card e layout per renderlo simile al tuo riferimento.
      </p>

      <div className="mt-6">
        <Filters filters={filters} onChange={setFilters} onSubmit={() => load(1)} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <PropertyCard key={p._id} p={p} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          className="rounded-xl border px-4 py-2 text-sm disabled:opacity-40"
          disabled={pagination.page <= 1}
          onClick={() => load(pagination.page - 1)}
        >
          Prev
        </button>
        <p className="text-sm text-gray-600">
          Pagina {pagination.page} / {pagination.pages}
        </p>
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