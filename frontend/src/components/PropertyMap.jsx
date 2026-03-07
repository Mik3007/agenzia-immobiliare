import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* icona casa */
const houseIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

export default function PropertyMap({ property }) {
  if (!property?.location) return null;

  const position = [property.location.lat, property.location.lng];

  return (
    <MapContainer
      center={position}
      zoom={14}
      style={{ height: "300px", width: "100%" }}
      className="rounded-2xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position} icon={houseIcon} />
    </MapContainer>
  );
}