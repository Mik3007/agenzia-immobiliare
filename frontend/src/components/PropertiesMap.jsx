import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * =========================
 * FIX ICONE LEAFLET
 * =========================
 * Risolve problema path icone default Leaflet (webpack/vite issue)
 */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/**
 * =========================
 * PROPERTIES MAP
 * =========================
 * Mostra tutti gli immobili su una mappa interattiva.
 *
 * Features:
 * - Marker per ogni immobile
 * - Popup con info immobile
 * - Hover per apertura popup
 * - Chiusura ritardata popup (UX migliorata)
 */
export default function PropertiesMap({ properties = [] }) {
  const navigate = useNavigate(); // navigazione pagina dettaglio

  // Timer per delay chiusura popup
  const closeTimer = useRef(null);

  /**
   * =========================
   * ICONA PERSONALIZZATA
   * =========================
   */
  const houseIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22],
  });

  /**
   * =========================
   * CENTRO MAPPA
   * =========================
   * - Se ci sono immobili → usa il primo
   * - Altrimenti fallback su coordinate default
   */
const firstWithLocation = properties.find((p) => p.location);

const center = firstWithLocation
  ? [firstWithLocation.location.lat, firstWithLocation.location.lng]
  : [41.083, 14.334];

  return (
    <MapContainer
      center={center} // centro iniziale
      zoom={12} // livello zoom
      style={{ height: "450px", width: "100%" }} // dimensioni
      className="rounded-2xl shadow-lg"
    >
      {/* =========================
          TILE LAYER
      ========================= */}
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* =========================
          MARKERS IMMOBILI
      ========================= */}
      {properties.map((p) => {
        // se immobile non ha coordinate → skip
if (
  !p.location ||
  typeof p.location.lat !== "number" ||
  typeof p.location.lng !== "number"
)
  return null;;

        return (
          <Marker
            key={p._id} // chiave univoca
            position={[p.location.lat, p.location.lng]}
            icon={houseIcon}
            eventHandlers={{
              /**
               * Mouse over:
               * - cancella eventuale timer chiusura
               * - apre popup
               */
              mouseover: (e) => {
                clearTimeout(closeTimer.current);
                e.target.openPopup();
              },

              /**
               * Mouse out:
               * - chiude popup con delay
               * (evita flicker quando si passa sopra velocemente)
               */
              mouseout: (e) => {
                const marker = e.target;
                closeTimer.current = setTimeout(() => {
                  marker.closePopup();
                }, 1000);
              },
            }}
          >
            {/* =========================
                POPUP IMMOBILE
            ========================= */}
            <Popup closeButton={false}>
              <div className="w-44 text-sm">
                {/* Immagine */}
                {p.images?.[0]?.url && (
                  <img
                    src={p.images[0].url}
                    alt={p.title}
                    className="mb-2 h-24 w-full rounded-lg object-cover"
                  />
                )}

                {/* Titolo */}
                <p className="font-semibold">{p.title}</p>

                {/* Prezzo */}
                <p>€ {p.price?.toLocaleString("it-IT")}</p>

                {/* CTA dettaglio */}
                <button
                  onClick={() => navigate(`/immobile/${p._id}`)}
                  className="mt-2 text-xs underline cursor-pointer"
                >
                  Vedi immobile
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
