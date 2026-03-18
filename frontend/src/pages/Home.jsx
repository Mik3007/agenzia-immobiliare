import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import HeroSearch from "../components/HeroSearch";
import Loader from "../components/Loader";

import SearchResultsSection from "../components/home/SearchResultsSection";
import FeaturedSection from "../components/home/FeaturedSection";
import MapSection from "../components/home/MapSection";
import AboutSection from "../components/home/AboutSection";
import ReviewsSection from "../components/home/ReviewsSection";
import ValuationSection from "../components/home/ValuationSection";

import api from "../api/client";

/**
 * =========================
 * HOME PAGE
 * =========================
 * Pagina principale del sito.
 * 
 * Contiene:
 * - Hero con ricerca
 * - Risultati ricerca dinamici
 * - Slider immobili (featured)
 * - Mappa immobili
 * - Sezione "Chi sono"
 * - Recensioni
 * - Valutazione immobile
 */
export default function Home() {
  /* =========================
     STATE GLOBALI
  ========================= */

  const [properties, setProperties] = useState([]); // immobili latest (slider)
  const [searchResults, setSearchResults] = useState([]); // risultati ricerca
  const [searchLoading, setSearchLoading] = useState(false); // loading ricerca
  const [hasSearched, setHasSearched] = useState(false); // flag ricerca effettuata

  const [mapProperties, setMapProperties] = useState([]); // immobili per mappa
  const [reviews, setReviews] = useState([]); // tutte le recensioni

  const [reviewModalOpen, setReviewModalOpen] = useState(false); // modal recensione
  const [valuationModalOpen, setValuationModalOpen] = useState(false); // modal valutazione

  const [page, setPage] = useState(1); // paginazione recensioni
  const [loading, setLoading] = useState(true); // loading featured

  /* =========================
     FADE SLIDER
  ========================= */

  const [showLeftFade, setShowLeftFade] = useState(false); // search slider
  const [showRightFade, setShowRightFade] = useState(true);

  const [featuredShowLeftFade, setFeaturedShowLeftFade] = useState(false); // featured slider
  const [featuredShowRightFade, setFeaturedShowRightFade] = useState(true);

  /* =========================
     REF SLIDER
  ========================= */

  const featuredRef = useRef(null); // ref slider featured
  const searchRef = useRef(null);   // ref slider search

  const nav = useNavigate(); // navigazione router

  /* =========================
     SEARCH
  ========================= */

  /**
   * Gestisce la ricerca immobili dalla Hero
   * costruisce query params dinamicamente
   */
  async function handleSearch(filters) {
    try {
      setHasSearched(true);      // attiva sezione risultati
      setSearchLoading(true);    // attiva loader

      const params = new URLSearchParams();

      // costruzione query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });

      // chiamata API
      const res = await api.get(`/api/properties?${params.toString()}`);

      // set risultati
      setSearchResults(res.data?.items || []);

      // scroll automatico alla sezione risultati
      setTimeout(() => {
        const el = document.getElementById("search-results");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      console.error("Errore ricerca:", err);
      setSearchResults([]); // fallback
    } finally {
      setSearchLoading(false); // stop loader
    }
  }

  /**
   * Reset ricerca
   * nasconde la sezione risultati
   */
  function resetSearch() {
    setHasSearched(false);
    setSearchResults([]);
  }

  /* =========================
     LOAD INIZIALE
  ========================= */

  useEffect(() => {
    loadLatest();        // immobili slider
    loadMapProperties(); // immobili mappa
    loadReviews();       // recensioni
  }, []);

  /**
   * Carica ultimi immobili
   */
  async function loadLatest() {
    try {
      const res = await api.get("/api/properties/latest?limit=20");

      // supporta sia array diretto che struttura { items }
      setProperties(Array.isArray(res.data) ? res.data : res.data.items || []);
    } catch (err) {
      console.error("Errore immobili:", err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Carica immobili per mappa
   */
  async function loadMapProperties() {
    const res = await api.get("/api/properties?limit=200");
    setMapProperties(res.data.items || []);
  }

  /**
   * Carica recensioni
   */
  async function loadReviews() {
    try {
      const res = await api.get("/api/reviews");
      setReviews(res.data.items || []);
    } catch (err) {
      console.error("Errore recensioni:", err);
    }
  }

  /* =========================
     SCROLL SLIDER
  ========================= */

  /**
   * Scroll manuale slider (featured + search)
   */
  function scroll(ref, direction) {
    if (!ref.current) return;

    ref.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }

  /* =========================
     REVIEWS PAGINATION
  ========================= */

  // numero recensioni per pagina (responsive)
  const reviewsPerPage =
    window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

  const end = page * reviewsPerPage;

  // slice recensioni per pagina corrente
  const paginatedReviews = reviews.slice(end - reviewsPerPage, end);

  /**
   * Format data recensione
   */
  function formatDate(date) {
    return new Date(date).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <main className="scroll-smooth">
      
      {/* HERO + SEARCH */}
      <HeroSearch onSearch={handleSearch} />

      {/* =========================
          SEARCH RESULTS
      ========================= */}
      <SearchResultsSection
        hasSearched={hasSearched}
        searchLoading={searchLoading}
        searchResults={searchResults}
        resetSearch={resetSearch}
        showLeftFade={showLeftFade}
        showRightFade={showRightFade}
        setShowLeftFade={setShowLeftFade}
        setShowRightFade={setShowRightFade}
        scroll={scroll}
        searchRef={searchRef}
      />

      {/* =========================
          FEATURED
      ========================= */}
      <FeaturedSection
        properties={properties}
        loading={loading}
        featuredRef={featuredRef}
        featuredShowLeftFade={featuredShowLeftFade}
        featuredShowRightFade={featuredShowRightFade}
        setFeaturedShowLeftFade={setFeaturedShowLeftFade}
        setFeaturedShowRightFade={setFeaturedShowRightFade}
        scroll={scroll}
        nav={nav}
      />

      {/* =========================
          MAPPA
      ========================= */}
      <MapSection mapProperties={mapProperties} />

      {/* =========================
          WRAPPER GRADIENT
          (sezioni scure sotto)
      ========================= */}
      <div className="bg-[linear-gradient(to_bottom,rgb(93,92,87),rgb(68,68,44))]">

        {/* CHI SONO */}
        <AboutSection />

        {/* RECENSIONI */}
        <ReviewsSection
          reviews={reviews}
          paginatedReviews={paginatedReviews}
          page={page}
          setPage={setPage}
          end={end}
          reviewModalOpen={reviewModalOpen}
          setReviewModalOpen={setReviewModalOpen}
          loadReviews={loadReviews}
          formatDate={formatDate}
        />

        {/* VALUTAZIONE IMMOBILE */}
        <ValuationSection
          valuationModalOpen={valuationModalOpen}
          setValuationModalOpen={setValuationModalOpen}
        />

      </div>
    </main>
  );
}