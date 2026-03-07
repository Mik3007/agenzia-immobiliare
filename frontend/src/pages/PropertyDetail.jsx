import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import * as Motion from "framer-motion";
import PropertyMap from "../components/PropertyMap";

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

  const intervalRef = useRef(null);

  const gallery = item?.images?.map((i) => i.url) || [];
  const hasImages = gallery.length > 0;

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

  const nextRef = useRef(next);
  const prevRef = useRef(prev);

  useEffect(() => {
    nextRef.current = next;
    prevRef.current = prev;
  });

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
  }, [id]);

  useEffect(() => {
    if (!autoplay || hover || lightbox || !hasImages) return;

    intervalRef.current = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % gallery.length);
    }, 3500);

    return () => clearInterval(intervalRef.current);
  }, [autoplay, hover, lightbox, hasImages, gallery.length]);

  useEffect(() => {
    function keys(e) {
      if (!lightbox) return;

      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") nextRef.current();
      if (e.key === "ArrowLeft") prevRef.current();
    }

    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, [lightbox]);

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
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* GALLERY */}
        <div>
          <div
            className="relative w-full min-h-105 md:min-h-125 overflow-hidden rounded-2xl bg-gray-100 flex items-center justify-center"
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
                    transition={{ duration: 0.3 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -60) next();
                      if (info.offset.x > 60) prev();
                    }}
                    onClick={() => setLightbox(true)}
                    className="absolute inset-0 h-full w-full object-contain bg-gray-100 cursor-zoom-in"
                  />
                </Motion.AnimatePresence>

                {/* FRECCE */}
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl drop-shadow-lg hover:scale-110 transition"
                >
                  ‹
                </button>

                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl drop-shadow-lg hover:scale-110 transition"
                >
                  ›
                </button>

                {/* AUTOPLAY */}
                <button
                  onClick={() => setAutoplay((p) => !p)}
                  className="absolute right-3 top-3 text-xs px-3 py-1 rounded-full backdrop-blur"
                  style={{
                    backgroundColor: "rgba(240,241,235,0.85)",
                    color: BRAND.ink,
                  }}
                >
                  {autoplay ? "⏸" : "▶"}
                </button>
              </>
            )}
          </div>

          {/* THUMBS */}
          <div className="mt-3 grid grid-cols-6 gap-2">
            {gallery.slice(0, 6).map((img, i) => {
              const remaining = gallery.length - 6;
              const isLast = i === 5 && remaining > 0;

              return (
                <div
                  key={img}
                  className="relative h-20 w-full cursor-pointer overflow-hidden rounded-xl"
                  onClick={() => {
                    if (isLast && remaining > 0) {
                      setLightbox(true);
                    } else {
                      setDirection(i > index ? 1 : -1);
                      setIndex(i);
                    }
                  }}
                >
                  <img
                    src={img}
                    className={`h-full w-full object-cover ${
                      i === index ? "ring-2 ring-black" : ""
                    }`}
                  />

                  {/* overlay +X foto */}
                  {isLast && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-sm font-semibold">
                      +{remaining}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* MAPPA */}
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold">Posizione immobile</h2>
            <PropertyMap property={item} />
          </div>
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

          <Link
            to={`/contatti?propertyId=${item._id}`}
            className="mt-6 inline-flex rounded-xl px-6 py-3 text-sm text-white"
            style={{ backgroundColor: BRAND.olive }}
          >
            Richiedi informazioni
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Motion.motion.main
      initial={{ opacity: 0, y: -60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="min-h-screen px-4 py-10"
      style={{ backgroundColor: BRAND.ivory }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-gray-100"
          >
            🏡 Home
          </Link>

          <Link
            to="/#map"
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm hover:bg-gray-100"
          >
            🗺️ Mappa
          </Link>
        </div>

        {content}

        <Motion.AnimatePresence>
          {lightbox && hasImages && (
            <Motion.motion.div
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* chiudi */}
              <button
                onClick={() => setLightbox(false)}
                className="absolute right-6 top-6 text-white text-2xl"
              >
                ✕
              </button>

              {/* freccia sinistra */}
              <button
                onClick={prev}
                className="absolute left-6 text-white text-4xl hover:scale-110 transition"
              >
                ‹
              </button>

              {/* immagine */}
              <Motion.motion.img
                key={gallery[index]}
                src={gallery[index]}
                className="max-h-[90vh] w-auto max-w-[85vw] object-contain"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
              />

              {/* freccia destra */}
              <button
                onClick={next}
                className="absolute right-6 text-white text-4xl hover:scale-110 transition"
              >
                ›
              </button>

              {/* contatore */}
              <div className="absolute bottom-6 text-white text-sm">
                {index + 1} / {gallery.length}
              </div>
            </Motion.motion.div>
          )}
        </Motion.AnimatePresence>
      </div>
    </Motion.motion.main>
  );
}
