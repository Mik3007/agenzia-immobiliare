import PropertiesMap from "../PropertiesMap";

/**
 * MAP SECTION
 *
 * Mostra la mappa con tutti gli immobili geolocalizzati.
 * Riceve i dati dal componente Home.
 */
export default function MapSection({ mapProperties }) {
  return (
    <section id="map" className="px-4 py-16 bg-transparent">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-2xl font-semibold text-[#282828] text-center md:text-left">
          Trova gli immobili sulla mappa
        </h2>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <PropertiesMap properties={mapProperties} />
        </div>
      </div>
    </section>
  );
}