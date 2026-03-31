import { useState } from "react";
import logoEsteso from "../assets/brand/EBi_Logo esteso per sfondo chiaro (trasparente).png";
import { useNavigate } from "react-router-dom";

/**
 * =========================
 * HERO + SEARCH COMPONENT
 * =========================
 * Due modalità:
 * - HERO (home page)
 * - COMPACT (pagina immobili)
 *
 * Props:
 * - onSearch → callback che riceve i filtri correnti
 * - compact → attiva la versione compatta
 */
export default function HeroSearch({ onSearch, compact = false }) {
  /**
   * Stato filtri ricerca
   */
  const [filters, setFilters] = useState({
    q: "",
    contract: "vendita",
    type: "",
    minPrice: "",
    maxPrice: "",
    city: "",
  });

  const nav = useNavigate();

  /**
   * Stato apertura filtro mobile
   */
  const [openMobileFilter, setOpenMobileFilter] = useState(false);

  /**
   * Submit ricerca
   */
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
        {/* Bottone mobile filtro */}
        <button
          onClick={() => setOpenMobileFilter(!openMobileFilter)}
          className="md:hidden w-full rounded-2xl px-5 py-3 text-sm font-medium"
          style={{
            backgroundColor: "#282828",
            color: "#f0f1eb",
          }}
        >
          {openMobileFilter ? "Chiudi ricerca" : "Cerca un immobile"}
        </button>

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
              onChange={(e) =>
                setFilters({ ...filters, city: e.target.value })
              }
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
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value })
              }
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
  /* ===== VERSIONE HERO HOME ==== */
  /* ============================= */

  return (
    <section
      id="hero"
      className="relative min-h-[78vh] px-4 pt-24 pb-16"
      style={{ backgroundColor: "#f0f1eb" }}
    >
      {/* Background decorativo */}
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

      <div className="relative mx-auto grid max-w-7xl gap-14 md:grid-cols-2 md:items-center">
        {/* ================= LEFT HERO ================= */}
        <div>
          <img
            src={logoEsteso}
            alt="Emanuele Biscardi Immobiliare"
            className="h-32 md:h-36 lg:h-44 w-auto max-w-none"
          />

          <p
            className="mt-4 max-w-xs text-sm leading-relaxed md:mt-5 md:max-w-lg md:text-base md:leading-relaxed md:mb-2"
            style={{ color: "#99997b" }}
          >
            Immobili selezionati, consulenza chiara,
            <br className="md:hidden" />
            visite rapide e gestione completa  
            <br className="md:hidden" />
            della trattativa.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => nav("/immobili")}
              className="rounded-2xl px-6 py-3 text-sm font-medium shadow-sm cursor-pointer"
              style={{
                backgroundColor: "#282828",
                color: "#f0f1eb",
              }}
            >
              Guarda gli immobili
            </button>

            <a
              href="#valuation"
              className="rounded-2xl px-6 py-3 text-sm font-medium hover:backdrop-blur-2xl"
              style={{
                backgroundColor: "#44442c",
                color: "#f0f1eb",
              }}
            >
              Valuta la tua casa
            </a>
          </div>

          <div
            className="mt-7 text-sm space-y-1 md:space-y-0 lg:space-y-0 lg:flex lg:flex-wrap lg:gap-4"
            style={{ color: "rgba(40,40,40,0.55)" }}
          >
            <p>📍 Caserta e provincia</p>
            <p>✉️ biscardimmobiliare@libero.it</p>
            <p>📞 +39 3663432225</p>
          </div>
        </div>

        {/* ================= FILTRO ================= */}
        <div>
          {/* Bottone apertura filtro mobile */}
          <button
            onClick={() => setOpenMobileFilter(!openMobileFilter)}
            className="md:hidden mb-4 w-full rounded-2xl px-5 py-3 text-sm font-medium shadow-sm"
            style={{
              backgroundColor: "#282828",
              color: "#f0f1eb",
            }}
          >
            {openMobileFilter ? "Chiudi ricerca" : "Cerca un immobile"}
          </button>

          <div
            className={`rounded-3xl border p-5 md:p-6 lg:p-7 shadow-sm md:max-w-sm lg:max-w-none ${
              openMobileFilter ? "block" : "hidden md:block"
            }`}
            style={{
              backgroundColor: "rgba(255,255,255,0.75)",
              borderColor: "rgba(40,40,40,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p className="text-base font-semibold" style={{ color: "#282828" }}>
              Cerca un immobile
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* parole chiave */}
              <input
                className="w-full rounded-2xl border px-4 py-3.5 text-sm outline-none"
                style={{ borderColor: "rgba(40,40,40,0.12)" }}
                placeholder="Parole chiave (es. trilocale, giardino, box...)"
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              />

              {/* città */}
              <input
                className="w-full rounded-2xl border px-4 py-3.5 text-sm outline-none"
                style={{ borderColor: "rgba(40,40,40,0.12)" }}
                placeholder="Città (es. Caserta, Napoli...)"
                value={filters.city}
                onChange={(e) =>
                  setFilters({ ...filters, city: e.target.value })
                }
              />

              {/* contract + type */}
              <div className="grid gap-3 md:grid-cols-2">
                <select
                  className="w-full rounded-2xl border px-4 py-3.5 text-sm outline-none"
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
                  className="w-full rounded-2xl border px-4 py-3.5 text-sm outline-none"
                  style={{ borderColor: "rgba(40,40,40,0.12)" }}
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                >
                  <option value="">Tipologia (tutte)</option>
                  <option value="appartamento">Appartamento</option>
                  <option value="villa">Villa</option>
                  <option value="ufficio">Ufficio</option>
                  <option value="negozio">Negozio</option>
                  <option value="terreno">Terreno</option>
                  <option value="altro">Altro</option>
                </select>
              </div>

              {/* prezzo */}
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  type="number"
                  className="w-full rounded-2xl border px-4 py-3.5 text-sm outline-none"
                  style={{ borderColor: "rgba(40,40,40,0.12)" }}
                  placeholder="Prezzo min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                />

                <input
                  type="number"
                  className="w-full rounded-2xl border px-4 py-3.5 text-sm outline-none"
                  style={{ borderColor: "rgba(40,40,40,0.12)" }}
                  placeholder="Prezzo max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                />
              </div>

              {/* submit */}
              <button
                className="w-full rounded-2xl px-5 py-3.5 text-sm font-medium hover:opacity-95"
                style={{
                  backgroundColor: "#282828",
                  color: "#f0f1eb",
                }}
              >
                Cerca
              </button>
            </form>
          </div>

          {/* KPI */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs md:text-sm">
            <div
              className="rounded-2xl border p-3 md:p-4"
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
              className="rounded-2xl border p-3 md:p-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.6)",
                borderColor: "rgba(40,40,40,0.10)",
              }}
            >
              <p className="font-semibold" style={{ color: "#282828" }}>
                100%
              </p>
              <p style={{ color: "#99997b" }}>Visite Mirate</p>
            </div>

            <div
              className="rounded-2xl border p-3 md:p-4"
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
