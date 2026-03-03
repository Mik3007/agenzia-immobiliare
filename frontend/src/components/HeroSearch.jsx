import { useState } from "react";
import logoEsteso from "../assets/brand/EBi_Logo esteso per sfondo chiaro (trasparente).png";
import { useNavigate } from "react-router-dom";

export default function HeroSearch({ onSearch, compact = false }) {
  const [filters, setFilters] = useState({
    q: "",
    contract: "vendita",
    type: "",
    minPrice: "",
    maxPrice: "",
    city: "",
  });

  const nav = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    onSearch?.(filters);
  }

  /* ============================= */
  /* ===== VERSIONE COMPATTA ===== */
  /* ============================= */
  if (compact) {
    return (
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold mb-4" style={{ color: "#282828" }}>
          Filtra immobili
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Riga 1 */}
          <div className="grid gap-4 md:grid-cols-5">
            <input
              className="rounded-2xl border px-4 py-3 text-sm md:col-span-2"
              style={{ borderColor: "rgba(40,40,40,0.12)" }}
              placeholder="Parole chiave"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />

            <input
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{ borderColor: "rgba(40,40,40,0.12)" }}
              placeholder="Città"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            />

            <select
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{ borderColor: "rgba(40,40,40,0.12)" }}
              value={filters.contract}
              onChange={(e) =>
                setFilters({ ...filters, contract: e.target.value })
              }
            >
              <option value="vendita">Vendita</option>
              <option value="affitto">Affitto</option>
            </select>

            <select
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{ borderColor: "rgba(40,40,40,0.12)" }}
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">Tipologia</option>
              <option value="appartamento">Appartamento</option>
              <option value="villa">Villa</option>
              <option value="ufficio">Ufficio</option>
              <option value="negozio">Negozio</option>
              <option value="terreno">Terreno</option>
              <option value="altro">Altro</option>
            </select>
          </div>

          {/* Riga 2 - PREZZO AFFIANCATI */}
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="number"
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{ borderColor: "rgba(40,40,40,0.12)" }}
              placeholder="Prezzo min"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
            />

            <input
              type="number"
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{ borderColor: "rgba(40,40,40,0.12)" }}
              placeholder="Prezzo max"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
            />
          </div>

          {/* Pulsante */}
          <button
            className="w-full rounded-2xl px-5 py-3 text-sm font-medium"
            style={{
              backgroundColor: "#282828",
              color: "#f0f1eb",
            }}
          >
            Cerca
          </button>
        </form>
      </div>
    );
  }

  /* ============================= */
  /* ===== VERSIONE HERO HOME === */
  /* ============================= */

  return (
    <section
      id="hero"
      className="relative min-h-[88vh] px-4 pt-24"
      style={{ backgroundColor: "#f0f1eb" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% 10%, rgba(68,68,44,0.18), transparent 55%), radial-gradient(900px 500px at 90% 30%, rgba(153,153,123,0.20), transparent 55%)",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(40,40,40,0.02)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <img
            src={logoEsteso}
            alt="Emanuele Biscardi Immobiliare"
            className="h-20 md:h-24 w-auto max-w-none"
          />

          <p className="mt-4 text-sm md:text-base" style={{ color: "#99997b" }}>
            Immobili selezionati a Caserta e provincia. Consulenza chiara,
            visite rapide e gestione completa della trattativa.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => nav("/immobili")}
              className="rounded-2xl px-5 py-3 text-sm font-medium shadow-sm cursor-pointer"
              style={{
                backgroundColor: "#282828",
                color: "#f0f1eb",
              }}
            >
              Guarda gli immobili
            </button>

            <a
              href="#valuation"
              className="rounded-2xl px-5 py-3 text-sm font-medium"
              style={{
                backgroundColor: "#44442c",
                color: "#f0f1eb",
              }}
            >
              Valuta la tua casa
            </a>
          </div>

          <p className="mt-6 text-xs" style={{ color: "rgba(40,40,40,0.55)" }}>
            📍 Caserta e provincia • ✉️ biscardimmobiliare@libero.it • 📞 +39
            3663432225
          </p>
        </div>

        {/* Filtro originale identico */}
        <div>
          <div
            className="rounded-3xl border p-5 shadow-sm md:p-6"
            style={{
              backgroundColor: "rgba(255,255,255,0.75)",
              borderColor: "rgba(40,40,40,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="text-sm font-semibold" style={{ color: "#282828" }}>
              Cerca un immobile
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {/* Tutto il tuo form originale rimane uguale */}
              {/* Riga 1: testo libero */}
              <input
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: "rgba(40,40,40,0.12)" }}
                placeholder="Parole chiave (es. trilocale, giardino, box...)"
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              />
              {/* NUOVO CAMPO CITTÀ */}
              <input
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                style={{ borderColor: "rgba(40,40,40,0.12)" }}
                placeholder="Città (es. Caserta, Napoli...)"
                value={filters.city}
                onChange={(e) =>
                  setFilters({ ...filters, city: e.target.value })
                }
              />

              {/* Riga 2: contract + type */}
              <div className="grid gap-3 md:grid-cols-2">
                <select
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{ borderColor: "rgba(40,40,40,0.12)" }}
                  value={filters.contract}
                  onChange={(e) =>
                    setFilters({ ...filters, contract: e.target.value })
                  }
                >
                  {/* Modifica qui le opzioni contratto */}
                  <option value="vendita">Vendita</option>
                  <option value="affitto">Affitto</option>
                </select>

                <select
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{ borderColor: "rgba(40,40,40,0.12)" }}
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                >
                  {/* Modifica qui le tipologie */}
                  <option value="">Tipologia (tutte)</option>
                  <option value="appartamento">Appartamento</option>
                  <option value="villa">Villa</option>
                  <option value="ufficio">Ufficio</option>
                  <option value="negozio">Negozio</option>
                  <option value="terreno">Terreno</option>
                  <option value="altro">Altro</option>
                </select>
              </div>

              {/* Riga 3: prezzo min/max */}
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="number"
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{ borderColor: "rgba(40,40,40,0.12)" }}
                  placeholder="Prezzo min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                />
                <input
                  type="number"
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                  style={{ borderColor: "rgba(40,40,40,0.12)" }}
                  placeholder="Prezzo max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                />
              </div>

              {/* Pulsante submit */}
              <button
                className="w-full rounded-2xl px-5 py-3 text-sm font-medium hover:opacity-95"
                style={{
                  backgroundColor: "#282828",
                  color: "#f0f1eb",
                }}
              >
                Cerca
              </button>

              {/* Nota: puoi aggiungere "reset filtri" qui sotto */}
            </form>
          </div>

          {/* Tip: spazio per “badge” o KPI */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
            <div
              className="rounded-2xl border p-3"
              style={{
                backgroundColor: "rgba(255,255,255,0.6)",
                borderColor: "rgba(40,40,40,0.10)",
              }}
            >
              <p className="font-semibold" style={{ color: "#282828" }}>
                100%
              </p>
              <p style={{ color: "#99997b" }}>Trasparenza</p>
            </div>
            <div
              className="rounded-2xl border p-3"
              style={{
                backgroundColor: "rgba(255,255,255,0.6)",
                borderColor: "rgba(40,40,40,0.10)",
              }}
            >
              <p className="font-semibold" style={{ color: "#282828" }}>
                +Visite
              </p>
              <p style={{ color: "#99997b" }}>Organizzate</p>
            </div>
            <div
              className="rounded-2xl border p-3"
              style={{
                backgroundColor: "rgba(255,255,255,0.6)",
                borderColor: "rgba(40,40,40,0.10)",
              }}
            >
              <p className="font-semibold" style={{ color: "#282828" }}>
                Supporto
              </p>
              <p style={{ color: "#99997b" }}>Dedicato</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
