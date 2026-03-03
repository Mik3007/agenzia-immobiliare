import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { clearToken, isLoggedIn } from "../utils/auth";

export default function AdminDashboard() {
  const nav = useNavigate();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) nav("/admin");
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load() {
    const res = await api.get("/api/properties", { params: { limit: 200 } });
    setItems(res.data.items || []);
  }

  function logout() {
    clearToken();
    nav("/admin");
  }

  async function remove(id) {
    if (!confirm("Eliminare questo immobile?")) return;
    await api.delete(`/api/properties/${id}`);
    await load();
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;

    return items.filter((p) => {
      const hay = [p.title, p.city, p.address, p.contract, p.type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return hay.includes(s);
    });
  }, [items, q]);

  async function toggleFeatured(property) {
    await api.put(`/api/properties/${property._id}`, {
      featured: !property.featured,
    });

    setItems((prev) =>
      prev.map((p) =>
        p._id === property._id ? { ...p, featured: !p.featured } : p,
      ),
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard Admin</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestisci immobili: ricerca, aggiungi, modifica, elimina.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => nav("/")}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Home
          </button>
          <button
            onClick={() => nav("/admin/properties/new")}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            + Aggiungi immobile
          </button>

          <button
            onClick={logout}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Esci
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <input
          className="w-full rounded-xl border bg-white px-4 py-3 text-sm"
          placeholder="Cerca per titolo, città, indirizzo..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <p className="mt-2 text-xs text-gray-500">
          Risultati: {filtered.length} / {items.length}
        </p>
      </div>

      {/* Table */}
      <section className="mt-6">
        <div className="overflow-hidden rounded-2xl border bg-white">
          {/* HEADER */}
          <div className="grid grid-cols-12 gap-2 border-b bg-gray-50 p-3 text-xs font-semibold text-gray-600">
            <div className="col-span-6">Immobile</div>
            <div className="col-span-2">Città</div>
            <div className="col-span-2">Prezzo</div>
            <div className="col-span-1">Home</div>
            <div className="col-span-1 text-right">Azioni</div>
          </div>

          {/* ROWS */}
          {filtered.map((p) => (
            <div
              key={p._id}
              className="grid grid-cols-12 items-center gap-2 p-3 text-sm border-t"
            >
              {/* THUMB + TITOLO + VIA */}
              <div className="col-span-6 flex items-center gap-3 min-w-0">
                <div className="h-14 w-20 overflow-hidden rounded-lg bg-gray-100 shrink-0">
                  <img
                    src={
                      p.images?.[0]?.url ||
                      "https://via.placeholder.com/160x120?text=No+Image"
                    }
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <div className="truncate font-medium">{p.title}</div>
                  <div className="truncate text-xs text-gray-500">
                    {p.address || "—"}
                  </div>
                </div>
              </div>

              {/* CITTA */}
              <div className="col-span-2 text-gray-600">{p.city}</div>

              {/* PREZZO */}
              <div className="col-span-2">
                € {Number(p.price || 0).toLocaleString("it-IT")}
              </div>

              {/* FEATURED */}
              <div className="col-span-1">
                <button
                  onClick={() => toggleFeatured(p)}
                  className="text-lg"
                  title="Metti in evidenza in home"
                >
                  {p.featured ? "✅" : "⬜"}
                </button>
              </div>

              {/* AZIONI */}
              <div className="col-span-1 flex justify-end gap-2">
                <button
                  onClick={() => nav(`/admin/properties/${p._id}/edit`)}
                  className="rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
                >
                  ✏️
                </button>

                <button
                  onClick={() => remove(p._id)}
                  className="rounded-lg border px-2 py-1 text-xs hover:bg-gray-50"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-6 text-sm text-gray-600">
              Nessun immobile trovato.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
