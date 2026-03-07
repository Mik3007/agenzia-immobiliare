import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function PropertiesMap({ properties = [] }) {
  const navigate = useNavigate();
  const closeTimer = useRef(null);

  const houseIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22],
  });

  const center =
    properties.length && properties[0].location
      ? [properties[0].location.lat, properties[0].location.lng]
      : [41.083, 14.334];

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "450px", width: "100%" }}
      className="rounded-2xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {properties.map((p) => {
        if (!p.location) return null;

        return (
          <Marker
            key={p._id}
            position={[p.location.lat, p.location.lng]}
            icon={houseIcon}
            eventHandlers={{
              mouseover: (e) => {
                clearTimeout(closeTimer.current);
                e.target.openPopup();
              },
              mouseout: (e) => {
                const marker = e.target;
                closeTimer.current = setTimeout(() => {
                  marker.closePopup();
                }, 700); 
              },
            }}
          >
            <Popup closeButton={false}>
              <div className="w-44 text-sm">
                {p.images?.[0]?.url && (
                  <img
                    src={p.images[0].url}
                    alt={p.title}
                    className="mb-2 h-24 w-full rounded-lg object-cover"
                  />
                )}

                <p className="font-semibold">{p.title}</p>

                <p>€ {p.price?.toLocaleString("it-IT")}</p>

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