import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function PropertyCard({
  property,
  isAdmin = false,
  onDelete,
  onEdit,
}) {
  const navigate = useNavigate();

  const BRAND = {
    ink: "#282828",
    olive: "#44442c",
    sage: "#99997b",
    ivory: "#f0f1eb",
  };

  const cover = property?.images?.[0]?.url || "";

  const hoverBlock = {
    rest: { opacity: 0, y: 14 },
    hover: { opacity: 1, y: 0 },
  };

  function goToDetail() {
    const slug = slugify(`${property.title} ${property.city}`);
    navigate(`/immobile/${slug}-${property._id}`);
  }

  return (
    <Motion.div
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.995 }}
      className="group relative w-full aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={!isAdmin ? goToDetail : undefined}
    >
      {/* IMMAGINE */}
      <div className="absolute inset-0">
        {cover ? (
          <img
            src={cover}
            alt={`${property.city} ${property.address}`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="h-full w-full flex items-center justify-center text-sm"
            style={{
              backgroundColor: "rgba(40,40,40,0.08)",
              color: BRAND.ink,
            }}
          >
            Nessuna immagine
          </div>
        )}
      </div>

      {/* OVERLAY */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(40,40,40,0.92), rgba(40,40,40,0.15), rgba(40,40,40,0))",
        }}
      />

      {/* CONTENUTO */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-2xl font-semibold text-white">{property.city}</h3>

        <p className="mt-1 text-sm text-white/85">{property.address}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/80">
          {property.areaMq > 0 && (
            <>
              <span>{property.areaMq} m²</span>
              <span>•</span>
            </>
          )}

          <span>{property.rooms} locali</span>

          <span>•</span>

          <span>{property.contract === "vendita" ? "Vendita" : "Affitto"}</span>
          <span
            className="inline-block rounded-xl px-3 py-2 text-base font-semibold"
            style={{
              backgroundColor: "rgba(240,241,235,0.12)",
              color: BRAND.ivory,
            }}
          >
            €{Number(property.price || 0).toLocaleString()}
          </span>
        </div>

        {/* PREZZO + BOTTONI */}
        <Motion.div
          variants={hoverBlock}
          transition={{ duration: 0.28 }}
          className="mt-4 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        >
          <div className="mt-5">
            {!isAdmin ? (
              <Motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  goToDetail();
                }}
                className="w-full rounded-xl py-3 text-sm font-medium"
                style={{
                  backgroundColor: BRAND.olive,
                  color: BRAND.ivory,
                }}
              >
                Dettagli
              </Motion.button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(property._id);
                  }}
                  className="flex-1 rounded-xl py-3 text-sm font-medium bg-white"
                >
                  Modifica
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(property._id);
                  }}
                  className="flex-1 rounded-xl py-3 text-sm font-medium bg-red-600 text-white"
                >
                  Elimina
                </button>
              </div>
            )}
          </div>
        </Motion.div>
      </div>
    </Motion.div>
  );
}
