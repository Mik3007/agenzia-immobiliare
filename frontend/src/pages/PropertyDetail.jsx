import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import * as Motion from "framer-motion";
import PropertyMap from "../components/PropertyMap";
import PropertyContactModal from "../components/PropertyContactModal";

export default function PropertyDetail() {
  const { id } = useParams();
  const realId = id.split("-").pop();

  const BRAND = useMemo(
    () => ({
      ink: "#282828",
      olive: "#44442c",
      sage: "#99997b",
      ivory: "#f0f1eb",
    }),
    [],
  );

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [direction, setDirection] = useState(1);
  const [hover, setHover] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [contactOpen, setContactOpen] = useState(false);

  const intervalRef = useRef(null);

  const gallery = item?.images?.map((i) => i.url) || [];
  const hasImages = gallery.length > 0;

  const [planIndex, setPlanIndex] = useState(0);
  const [planLightbox, setPlanLightbox] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await api.get(`/api/properties/${realId}`);
        if (active) {
          setItem(res.data.item);
          setIndex(0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => (active = false);
  }, [realId]);

  const next = () => {
    if (!hasImages) return;
    setDirection(1);
    setIndex((prev) => (prev + 1) % gallery.length);
  };

  const prev = () => {
    if (!hasImages) return;
    setDirection(-1);
    setIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  useEffect(() => {
    if (!autoplay || hover || lightbox || !hasImages) return;

    intervalRef.current = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % gallery.length);
    }, 3500);

    return () => clearInterval(intervalRef.current);
  }, [autoplay, hover, lightbox, hasImages, gallery.length]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  let content;

  if (loading) content = <div>Caricamento…</div>;
  else if (!item) content = <div>Immobile non trovato</div>;
  else {
    content = (
      <>
        {/* GRID FOTO + INFO */}
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          {/* GALLERY */}
          <div>
            <div
              className="relative z-10 w-full min-h-105 md:min-h-130 overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {hasImages && (
                <>
                  <Motion.AnimatePresence
                    initial={false}
                    custom={direction}
                    mode="wait"
                  >
                    <Motion.motion.img
                      key={gallery[index]}
                      src={gallery[index]}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35 }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -60) next();
                        if (info.offset.x > 60) prev();
                      }}
                      onClick={() => setLightbox(true)}
                      className="absolute inset-0 h-full w-full object-contain cursor-zoom-in"
                    />
                  </Motion.AnimatePresence>

                  {/* arrows */}
                  <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl z-20"
                  >
                    ‹
                  </button>

                  <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-20"
                  >
                    ›
                  </button>

                  {/* autoplay toggle */}
                  <button
                    onClick={() => setAutoplay((p) => !p)}
                    className="absolute right-3 top-3 text-xs px-3 py-1 rounded-full backdrop-blur z-20"
                    style={{
                      backgroundColor: "rgba(240,241,235,0.85)",
                      color: BRAND.ink,
                    }}
                  >
                    {autoplay ? "⏸" : "▶"}
                  </button>

                  {/* indicatore */}
                  <div className="absolute bottom-3 right-3 z-20 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur">
                    {index + 1} / {gallery.length}
                  </div>
                </>
              )}
            </div>

            {/* THUMBNAILS */}
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-6 gap-3">
                {gallery.slice(0, 6).map((img, i) => {
                  const isLast = i === 5 && gallery.length > 6;
                  const remaining = gallery.length - 5;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > index ? 1 : -1);
                        setIndex(i);
                        setLightbox(true);
                      }}
                      className={`relative h-16 w-full rounded-lg overflow-hidden border ${
                        i === index ? "border-black" : "border-gray-200"
                      }`}
                    >
                      <img src={img} className="h-full w-full object-cover" />

                      {isLast && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                          +{remaining}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* INFO */}
          <div>
            <h1 className="text-3xl font-semibold">{item.title}</h1>

            <p className="mt-1 text-gray-500">
              {item.city} {item.address && `• ${item.address}`}
            </p>

            <p className="mt-4 text-2xl font-medium">
              € {Number(item.price).toLocaleString("it-IT")}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-lg bg-gray-100 px-3 py-1">
                {item.contract}
              </span>
              <span className="rounded-lg bg-gray-100 px-3 py-1">
                {item.type}
              </span>
              <span className="rounded-lg bg-gray-100 px-3 py-1">
                {item.rooms} locali
              </span>
              <span className="rounded-lg bg-gray-100 px-3 py-1">
                {item.areaMq} mq
              </span>
            </div>

            <div className="mt-6 rounded-2xl border bg-white p-5">
              <p className="font-semibold">Descrizione</p>
              <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">
                {item.description || "—"}
              </p>
            </div>

            <button
              onClick={() => setContactOpen(true)}
              className="mt-6 rounded-xl bg-[#44442c] px-5 py-3 text-sm font-medium text-white hover:opacity-90"
            >
              Richiedi informazioni
            </button>
          </div>
        </div>

        {/* PLANIMETRIE */}
        <div >
          <h2 className="text-lg font-semibold mb-4">Planimetrie</h2>

          {item.planimetries?.length > 0 ? (
            <>
              <div className="grid grid-cols-6 gap-3">
                {item.planimetries.slice(0, 6).map((img, i) => {
                  const isLast = i === 5 && item.planimetries.length > 6;
                  const remaining = item.planimetries.length - 5;

                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setPlanIndex(i);
                        setPlanLightbox(true);
                      }}
                      className="relative h-16 w-full rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={img.url}
                        className="h-full w-full object-cover"
                      />

                      {isLast && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-semibold">
                          +{remaining}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="mt-3 text-xs text-gray-500">
                {item.planimetries.length} planimetr
                {item.planimetries.length === 1 ? "ia" : "ie"} disponibili
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Nessuna planimetria disponibile
            </p>
          )}
        </div>

        {/* MAPPA */}
        <div className="mt-12 relative z-0">
          <h2 className="mb-4 text-lg font-semibold">Posizione immobile</h2>

          <div className="h-87.5 md:h-105 overflow-hidden rounded-2xl">
            <PropertyMap property={item} />
          </div>
        </div>

        {/* LIGHTBOX IMMAGINI */}
        {lightbox && (
          <div
            className="fixed inset-0 z-9999 bg-black/80 flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <img
              src={gallery[index]}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />

            {gallery.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  className="absolute left-6 text-white text-5xl"
                >
                  ‹
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  className="absolute right-6 text-white text-5xl"
                >
                  ›
                </button>
              </>
            )}

            <div className="absolute bottom-6 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur">
              {index + 1} / {gallery.length}
            </div>
          </div>
        )}

        {/* LIGHTBOX PLANIMETRIE */}
        {planLightbox && (
          <div
            className="fixed inset-0 z-999 bg-black/80 flex items-center justify-center"
            onClick={() => setPlanLightbox(false)}
          >
            <img
              src={item.planimetries[planIndex].url}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />

            {item.planimetries.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlanIndex(
                      (prev) =>
                        (prev - 1 + item.planimetries.length) %
                        item.planimetries.length,
                    );
                  }}
                  className="absolute left-6 text-white text-5xl"
                >
                  ‹
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlanIndex(
                      (prev) => (prev + 1) % item.planimetries.length,
                    );
                  }}
                  className="absolute right-6 text-white text-5xl"
                >
                  ›
                </button>
              </>
            )}

            <div className="absolute bottom-6 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur">
              {planIndex + 1} / {item.planimetries.length}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <Motion.motion.main
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="min-h-screen px-4 py-10"
      style={{ backgroundColor: BRAND.ivory }}
    >
      <div className="mx-auto max-w-6xl bg-[#f0f1eb]">
        <div className="flex gap-3 my-8">
          <Link
            to="/"
            className="rounded-full px-4 py-2 text-sm hover:bg-gray-100"
          >
            ← Torna alla home
          </Link>

          <Link
            to="/#map"
            className="rounded-full px-4 py-2 text-sm hover:bg-gray-100"
          >
            🗺️ Mappa
          </Link>
        </div>

        {content}

        <PropertyContactModal
          open={contactOpen}
          onClose={() => setContactOpen(false)}
          property={item}
        />
      </div>
    </Motion.motion.main>
  );
}
