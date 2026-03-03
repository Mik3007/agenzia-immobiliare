import { useEffect, useState } from "react";
import HeroSearch from "../components/HeroSearch";
import PropertyCard from "../components/PropertyCard";
import fotoChiSono from "../assets/images/FotoChiSono.png";
import api from "../api/client";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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

      setSearchResults(res.data.items);

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

  useEffect(() => {
    loadLatest();
  }, []);

  async function loadLatest() {
    try {
      const res = await api.get("/api/properties/latest?limit=3");
      setProperties(res.data);
    } catch (err) {
      console.error("Errore caricamento immobili:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="scroll-smooth">
      {/* ================= HERO ================= */}
      <HeroSearch onSearch={handleSearch} />

      {/* ================= RISULTATI RICERCA ================= */}
      {hasSearched && (
        <section id="search-results" className="px-4 py-16 bg-[#f9f9f6]">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
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
              <p className="text-sm text-gray-500">Caricamento risultati...</p>
            ) : searchResults.length === 0 ? (
              <div className="rounded-2xl bg-white p-8 shadow-sm text-center">
                <p className="text-sm text-[#99997b]">
                  Nessun immobile trovato con questi filtri.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((p) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= ULTIMI IMMOBILI ================= */}
      <section id="featured" className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#282828]">
              Ultimi immobili inseriti
            </h2>

            <span className="text-sm font-medium text-[#44442c] opacity-70">
              {properties.length} immobili
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Caricamento immobili...</p>
          ) : properties.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nessun immobile disponibile.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ================= MAPPA ================= */}
      <section id="map" className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-2xl font-semibold text-[#282828]">
            Trova gli immobili sulla mappa
          </h2>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="text-sm text-[#99997b]">
              (Opzionale) Qui integreremo una mappa stile Airbnb/Booking con
              marker cliccabili.
            </p>
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
              className="w-full object-cover object-center h-72 sm:h-80 md:h-105 lg:h-120"
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
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-2xl font-semibold text-[#282828]">
            Dicono di noi
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl bg-white p-6 shadow-sm">
                <p className="text-sm leading-relaxed text-[#99997b]">
                  Recensione cliente. Inserire testimonianze reali.
                </p>

                <p className="mt-4 text-sm font-semibold text-[#282828]">
                  Nome Cliente
                </p>
              </div>
            ))}
          </div>
        </div>
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

          <button className="mt-8 rounded-2xl bg-[#f0f1eb] px-6 py-3 text-sm font-medium text-[#282828] hover:opacity-90">
            Richiedi valutazione
          </button>
        </div>
      </section>
    </main>
  );
}
