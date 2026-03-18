import PropertiesMap from "../PropertiesMap";

/**
 * =========================
 * MAP SECTION
 * =========================
 * Sezione della Home dedicata alla mappa.
 * 
 * Scopo:
 * - Mostrare tutti gli immobili geolocalizzati
 * - Permettere una visualizzazione geografica delle proprietà
 * 
 * I dati arrivano dal componente Home tramite props.
 */
export default function MapSection({ mapProperties }) {
  return (
    <section
      id="map" // ID usato per eventuali scroll/ancore
      className="px-4 py-16 bg-transparent"
    >
      {/* Container centrale con larghezza massima */}
      <div className="mx-auto max-w-6xl">
        
        {/* Titolo sezione */}
        <h2 className="mb-8 text-2xl font-semibold text-[#282828] text-center md:text-left">
          Trova gli immobili sulla mappa
        </h2>

        {/* Wrapper della mappa */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          
          {/* 
            Componente mappa vera e propria
            - riceve array di immobili
            - ogni immobile dovrebbe avere coordinate (lat/lng)
            - gestisce marker, popup, ecc.
          */}
          <PropertiesMap properties={mapProperties} />
        </div>
      </div>
    </section>
  );
}