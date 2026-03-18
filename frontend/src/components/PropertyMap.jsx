import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * =========================
 * ICONA PERSONALIZZATA
 * =========================
 * Definisce l'icona del marker sulla mappa.
 * 
 * - iconUrl → immagine marker
 * - iconSize → dimensione icona
 * - iconAnchor → punto di ancoraggio (base del marker)
 */
const houseIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

/**
 * =========================
 * PROPERTY MAP
 * =========================
 * Mostra la mappa per un singolo immobile.
 * 
 * Props:
 * - property → oggetto immobile con coordinate
 * 
 * Comportamento:
 * - Se non ci sono coordinate → non renderizza nulla
 * - Mostra mappa centrata sull'immobile
 * - Mostra marker con icona personalizzata
 */
export default function PropertyMap({ property }) {
  // Se non esiste location → evita errore render
  if (!property?.location) return null;

  // Coordinate mappa [lat, lng]
  const position = [property.location.lat, property.location.lng];

  return (
    <MapContainer
      center={position} // centro mappa
      zoom={14} // livello zoom
      style={{ height: "300px", width: "100%" }} // dimensioni inline
      className="rounded-2xl"
    >
      {/* =========================
          TILE LAYER (MAPPA)
      ========================= */}
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* =========================
          MARKER IMMOBILE
      ========================= */}
      <Marker
        position={position} // posizione marker
        icon={houseIcon}    // icona custom
      />
    </MapContainer>
  );
}