export default function Filters({ filters, onChange, onSubmit }) {
  // Component “controllato”: l'input aggiorna lo stato nel parent (Listings)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-6"
    >
      <input
        className="md:col-span-2 rounded-xl border px-3 py-2 text-sm"
        placeholder="Città (es. Milano)"
        value={filters.city}
        onChange={(e) => onChange({ ...filters, city: e.target.value })}
      />

      <select
        className="rounded-xl border px-3 py-2 text-sm"
        value={filters.contract}
        onChange={(e) => onChange({ ...filters, contract: e.target.value })}
      >
        <option value="">Contratto</option>
        <option value="vendita">Vendita</option>
        <option value="affitto">Affitto</option>
      </select>

      <select
        className="rounded-xl border px-3 py-2 text-sm"
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value })}
      >
        <option value="">Tipologia</option>
        <option value="appartamento">Appartamento</option>
        <option value="villa">Villa</option>
        <option value="ufficio">Ufficio</option>
        <option value="negozio">Negozio</option>
        <option value="terreno">Terreno</option>
        <option value="altro">Altro</option>
      </select>

      <input
        type="number"
        className="rounded-xl border px-3 py-2 text-sm"
        placeholder="Prezzo min"
        value={filters.minPrice}
        onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
      />
      <input
        type="number"
        className="rounded-xl border px-3 py-2 text-sm"
        placeholder="Prezzo max"
        value={filters.maxPrice}
        onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
      />

      <button className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 md:col-span-6">
        Cerca
      </button>
    </form>
  );
}