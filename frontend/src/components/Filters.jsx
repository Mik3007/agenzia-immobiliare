/**
 * =========================
 * FILTERS COMPONENT
 * =========================
 * Form filtri immobili.
 * 
 * Componente controllato:
 * - Lo stato NON è interno
 * - Viene gestito dal parent (Listings / Home)
 * - Ogni input aggiorna il parent tramite onChange
 * 
 * Props:
 * - filters → oggetto con i valori correnti
 * - onChange → funzione per aggiornare i filtri
 * - onSubmit → funzione submit ricerca
 */
export default function Filters({ filters, onChange, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // evita refresh pagina
        onSubmit();         // trigger ricerca
      }}
      className="grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-6"
    >
      {/* =========================
          CITTÀ
      ========================= */}
      <input
        className="md:col-span-2 rounded-xl border px-3 py-2 text-sm"
        placeholder="Città (es. Milano)"
        value={filters.city} // valore controllato
        onChange={(e) =>
          onChange({ ...filters, city: e.target.value }) // update parent
        }
      />

      {/* =========================
          CONTRATTO
      ========================= */}
      <select
        className="rounded-xl border px-3 py-2 text-sm"
        value={filters.contract}
        onChange={(e) =>
          onChange({ ...filters, contract: e.target.value })
        }
      >
        <option value="">Contratto</option>
        <option value="vendita">Vendita</option>
        <option value="affitto">Affitto</option>
      </select>

      {/* =========================
          TIPOLOGIA
      ========================= */}
      <select
        className="rounded-xl border px-3 py-2 text-sm"
        value={filters.type}
        onChange={(e) =>
          onChange({ ...filters, type: e.target.value })
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

      {/* =========================
          PREZZO MIN
      ========================= */}
      <input
        type="number"
        className="rounded-xl border px-3 py-2 text-sm"
        placeholder="Prezzo min"
        value={filters.minPrice}
        onChange={(e) =>
          onChange({ ...filters, minPrice: e.target.value })
        }
      />

      {/* =========================
          PREZZO MAX
      ========================= */}
      <input
        type="number"
        className="rounded-xl border px-3 py-2 text-sm"
        placeholder="Prezzo max"
        value={filters.maxPrice}
        onChange={(e) =>
          onChange({ ...filters, maxPrice: e.target.value })
        }
      />

      {/* =========================
          SUBMIT
      ========================= */}
      <button className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 md:col-span-6">
        Cerca
      </button>
    </form>
  );
}