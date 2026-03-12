import { useEffect, useState } from "react";
import HeroSearch from "../components/HeroSearch";
import PropertyCard from "../components/PropertyCard";
import fotoChiSono from "../assets/images/sectionChiSono.jpg";
import api from "../api/client";
import PropertiesMap from "../components/PropertiesMap";
import AddReviewModal from "../components/AddReviewModal";
import ValuationModal from "../components/ValuationModal";
import { useRef } from "react";
import Loader from "../components/Loader";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [mapProperties, setMapProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [valuationModalOpen, setValuationModalOpen] = useState(false);
  const featuredRef = useRef(null);
  const searchRef = useRef(null);
  const [loading, setLoading] = useState(true);

  async function handleSearch(filters) {
    try {
      setHasSearched(true);
      setSearchLoading(true);

      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });

      const res = await api.get(`/api/properties?${params.toString()}`);

      setSearchResults(res.data?.items || []);

      setTimeout(() => {
        const el = document.getElementById("search-results");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      console.error("Errore ricerca:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }

  function resetSearch() {
    setHasSearched(false);
    setSearchResults([]);
  }

  async function loadMapProperties() {
    const res = await api.get("/api/properties?limit=200");
    setMapProperties(res.data.items || []);
  }

  useEffect(() => {
    loadLatest();
    loadMapProperties();
    loadReviews();
  }, []);

  async function loadLatest() {
    try {
      const res = await api.get("/api/properties/latest?limit=20");
      setProperties(Array.isArray(res.data) ? res.data : res.data.items || []);
    } catch (err) {
      console.error("Errore caricamento immobili:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadReviews() {
    try {
      const res = await api.get("/api/reviews");

      const items = res.data.items || [];

      // salviamo TUTTE le recensioni
      setReviews(items);
    } catch (err) {
      console.error("Errore caricamento recensioni:", err);
    }
  }

  useEffect(() => {
    if (window.location.hash === "#map") {
      const el = document.getElementById("map");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  function formatDate(date) {
    return new Date(date).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function scroll(ref, direction) {
    if (!ref.current) return;

    ref.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }

  const reviewsPerPage = 3;

  const start = (page - 1) * reviewsPerPage;
  const end = start + reviewsPerPage;

  const paginatedReviews = reviews.slice(start, end);

  return (
    <main className="scroll-smooth">
      {/* ================= HERO ================= */}
      <HeroSearch onSearch={handleSearch} />

      {/* ================= RISULTATI RICERCA ================= */}
      {hasSearched && (
        <section id="search-results" className="py-16 bg-[#f9f9f6]">
          <div className="mx-auto max-w-6xl px-4 mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#282828]">
              Risultati ricerca
            </h2>

            <button
              onClick={resetSearch}
              className="text-sm font-medium text-[#44442c] hover:underline"
            >
              Reset filtri
            </button>
          </div>

          {searchLoading ? (
            <p className="text-center text-sm text-gray-500">
              Caricamento risultati...
            </p>
          ) : searchResults.length === 0 ? (
            <div className="max-w-6xl mx-auto px-4">
              <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
                <p className="text-sm text-[#99997b]">
                  Nessun immobile trovato con questi filtri.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative group">
              {/* fade sinistra */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-[#f9f9f6] to-transparent z-10"></div>

              {/* fade destra */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-[#f9f9f6] to-transparent z-10"></div>

              {/* freccia sinistra */}
              <button
                onClick={() => scroll(searchRef, "left")}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20
              opacity-0 group-hover:opacity-100 transition
              text-5xl text-black"
              >
                ‹
              </button>

              {/* slider */}
              <div
                ref={searchRef}
                className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6"
              >
                {searchResults.map((p) => (
                  <div
                    key={p._id}
                    className="min-w-85 snap-start transition-all duration-300 hover:min-w-95 hover:shadow-xl"
                  >
                    <PropertyCard property={p} />
                  </div>
                ))}
              </div>

              {/* freccia destra */}
              <button
                onClick={() => scroll(searchRef, "right")}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20
              opacity-0 group-hover:opacity-100 transition
              text-5xl text-black"
              >
                ›
              </button>
            </div>
          )}
        </section>
      )}

      {/* ================= ULTIMI IMMOBILI ================= */}
      <section id="featured" className="py-16">
        <div className="px-6 mb-8">
          <h2 className="text-2xl font-semibold text-[#282828]">
            Ultimi immobili inseriti
          </h2>
        </div>

        <div className="relative group">
          {/* fade sinistra */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-white to-transparent z-10"></div>

          {/* fade destra */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-white to-transparent z-10"></div>

          {/* freccia sinistra */}
          <button
            onClick={() => scroll(featuredRef, "left")}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20
          opacity-0 group-hover:opacity-100 transition
          text-5xl text-black"
          >
            ‹
          </button>

          {/* slider */}
          {loading ? (
            <Loader />
          ) : (
            <div
              ref={featuredRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6"
            >
              {(properties || []).map((p) => (
                <div
                  key={p._id}
                  className="min-w-85 snap-start transition-all duration-300 hover:min-w-95 hover:shadow-xl"
                >
                  <PropertyCard property={p} />
                </div>
              ))}
            </div>
          )}

          {/* freccia destra */}
          <button
            onClick={() => scroll(featuredRef, "right")}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20
          opacity-0 group-hover:opacity-100 transition
          text-5xl text-black"
          >
            ›
          </button>
        </div>
      </section>

      {/* ================= MAPPA ================= */}
      <section id="map" className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-2xl font-semibold text-[#282828]">
            Trova gli immobili sulla mappa
          </h2>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <PropertiesMap properties={mapProperties} />
          </div>
        </div>
      </section>

      {/* ================= CHI SIAMO ================= */}
      <section id="about" className="px-4 py-20">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-start">
          <div className="w-full overflow-hidden rounded-3xl bg-[#dddddd]">
            <img
              src={fotoChiSono}
              alt="Chi sono"
              className="w-full object-cover object-[center_40%] h-72 sm:h-80 md:h-105 lg:h-120"
              loading="lazy"
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[#282828]">Chi sono</h2>

            <p className="mt-4 text-sm leading-relaxed text-[#99997b]">
              Sono un agente immobiliare con oltre dieci anni di esperienza
              reale sul campo, costruita collaborando con diverse agenzie e
              vivendo ogni giorno trattative, sfide e relazioni che mi hanno
              insegnato cosa significa davvero fare questo lavoro. Il mio
              percorso nasce dall’esperienza diretta e dal contatto continuo con
              le persone, perché prima ancora degli immobili vengono sempre le
              storie e le esigenze di chi mi sceglie. Nel tempo ho capito che
              vendere o comprare casa non è solo una questione tecnica o
              economica: è un passaggio importante nella vita di una persona.
              Per questo metto al centro sia il cliente venditore che il cliente
              acquirente, accompagnandoli con attenzione, ascolto e trasparenza
              in ogni fase del percorso. Con i venditori lavoro per valorizzare
              al massimo l’immobile, costruendo strategie mirate e realistiche
              che permettano di raggiungere il miglior risultato possibile senza
              illusioni o promesse irrealistiche. Con gli acquirenti, invece, il
              mio obiettivo è offrire guida, chiarezza e sicurezza, aiutandoli a
              orientarsi tra dubbi, scelte e opportunità, affinché possano fare
              un passo così importante con serenità e consapevolezza. Negli anni
              ho sviluppato un modo di lavorare che unisce esperienza pratica,
              approccio umano e strumenti moderni, perché credo che
              professionalità e relazione debbano andare insieme. Ogni incarico
              rappresenta per me una responsabilità reale: non si tratta solo di
              concludere una trattativa, ma di costruire un rapporto basato
              sulla fiducia e sul rispetto reciproco. E se vi state chiedendo se
              il prezzo di una casa è trattabile, la mia risposta è sempre la
              stessa: il prezzo è trattabile solo se vi piace.
            </p>
          </div>
        </div>
      </section>

      {/* ================= RECENSIONI ================= */}
      <section id="reviews" className="px-4 py-16">
        <div className="mx-auto max-w-6xl bg-[#ecede7] p-20 rounded-4xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#282828]">
              Dicono di noi
            </h2>

            <button
              onClick={() => setReviewModalOpen(true)}
              className="rounded-xl px-4 py-2 text-sm font-medium bg-[#44442c] text-[#f0f1eb] hover:bg-[#5a5a3a] cursor-pointer"
            >
              Aggiungi recensione
            </button>
          </div>

          {reviews.length === 0 ? (
            <p className="text-sm text-[#99997b]">Nessuna recensione ancora.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedReviews.map((r) => (
                <div
                  key={r._id}
                  className="rounded-3xl bg-white p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <p className="mb-2 text-sm font-semibold text-[#282828]">
                      {r.name}
                    </p>

                    <p className="text-sm leading-relaxed text-[#99997b]">
                      "{r.text}"
                    </p>

                    <div className="text-yellow-500 text-sm mt-2">
                      {"⭐".repeat(r.rating)}
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-gray-400">
                    {formatDate(r.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-lg bg-[#44442c] text-white disabled:opacity-40"
          >
            ←
          </button>

          <button
            disabled={end >= reviews.length}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-lg bg-[#44442c] text-white disabled:opacity-40"
          >
            →
          </button>
        </div>

        {/* MODAL RECENSIONE */}
        <AddReviewModal
          open={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSuccess={loadReviews}
        />
      </section>

      {/* ================= CTA VALUTAZIONE ================= */}
      <section id="valuation" className="px-4 py-20 bg-[#44442c]">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold text-[#f0f1eb]">
            Scopri quanto vale la tua casa
          </h2>

          <p className="mt-4 text-sm text-[#f0f1eb]">
            Richiedi una valutazione gratuita e senza impegno.
          </p>

          <button
            onClick={() => setValuationModalOpen(true)}
            className="mt-8 rounded-2xl bg-[#f0f1eb] px-6 py-3 text-sm font-medium text-[#282828] hover:opacity-90 cursor-pointer"
          >
            Richiedi valutazione
          </button>
        </div>
      </section>
      <ValuationModal
        open={valuationModalOpen}
        onClose={() => setValuationModalOpen(false)}
      />
    </main>
  );
}
