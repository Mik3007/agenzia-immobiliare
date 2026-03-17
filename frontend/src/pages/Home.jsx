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

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [mapProperties, setMapProperties] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [valuationModalOpen, setValuationModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [featuredShowLeftFade, setFeaturedShowLeftFade] = useState(false);
  const [featuredShowRightFade, setFeaturedShowRightFade] = useState(true);

  const featuredRef = useRef(null);
  const searchRef = useRef(null);

  const nav = useNavigate();

  /* ================= SEARCH ================= */

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

  /* ================= LOAD ================= */

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
      console.error("Errore immobili:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMapProperties() {
    const res = await api.get("/api/properties?limit=200");
    setMapProperties(res.data.items || []);
  }

  async function loadReviews() {
    try {
      const res = await api.get("/api/reviews");
      setReviews(res.data.items || []);
    } catch (err) {
      console.error("Errore recensioni:", err);
    }
  }

  /* ================= SCROLL ================= */

  function scroll(ref, direction) {
    if (!ref.current) return;

    ref.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }

  /* ================= REVIEWS ================= */

  const reviewsPerPage =
    window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;

  const end = page * reviewsPerPage;
  const paginatedReviews = reviews.slice(end - reviewsPerPage, end);

  function formatDate(date) {
    return new Date(date).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  /* ================= RETURN ================= */

  return (
    <main className="scroll-smooth">
      <HeroSearch onSearch={handleSearch} />

      {/* SEARCH */}
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

      {/* FEATURED */}
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

      {/* MAP */}
      <MapSection mapProperties={mapProperties} />

      {/* GRADIENT WRAPPER */}
      <div className="bg-[linear-gradient(to_bottom,rgb(93,92,87),rgb(68,68,44))]">

        <AboutSection />

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

        <ValuationSection
          valuationModalOpen={valuationModalOpen}
          setValuationModalOpen={setValuationModalOpen}
        />

      </div>
    </main>
  );
}