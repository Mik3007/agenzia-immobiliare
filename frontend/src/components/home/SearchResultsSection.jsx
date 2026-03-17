import PropertyCard from "../PropertyCard";
import Loader from "../Loader";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function SearchResultsSection({
  hasSearched,
  searchLoading,
  searchResults,
  scroll,
  searchRef,
  showLeftFade,
  showRightFade,
  setShowLeftFade,
  setShowRightFade,
  resetSearch,
}) {
  if (!hasSearched) return null;

  return (
    <motion.section
      id="search-results"
      className="py-16 bg-white group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* HEADER */}
      <div className="mx-3 max-w-6xl mb-8 flex items-center justify-center gap-4 md:justify-start">
        <h2 className="text-2xl font-semibold text-[#282828] pb-2.5">
          Risultati ricerca
        </h2>

        <button
          onClick={resetSearch}
          className="text-sm font-medium text-[#44442c] transition md:opacity-0 md:group-hover:opacity-100 hover:text-blue-600"
        >
          Reset filtri →
        </button>
      </div>

      {/* SLIDER */}
      {searchLoading ? (
        <Loader />
      ) : (
        <div className="relative -ml-6 pl-6">

          {/* FADE LEFT */}
          {showLeftFade && (
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-white to-transparent z-10" />
          )}

          {/* FADE RIGHT */}
          {showRightFade && (
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-white to-transparent z-10" />
          )}

          {/* FRECCIA SX */}
          <button
            onClick={() => scroll(searchRef, "left")}
            className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 text-5xl"
          >
            ‹
          </button>

          {/* LISTA */}
          <motion.div
            ref={searchRef}
            onScroll={(e) => {
              const el = e.target;
              setShowLeftFade(el.scrollLeft > 10);
              setShowRightFade(
                el.scrollLeft + el.clientWidth < el.scrollWidth - 10
              );
            }}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pl-6 pr-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {searchResults.map((p) => (
              <motion.div
                key={p._id}
                className="min-w-65 sm:min-w-75 lg:min-w-85 snap-start transition-all duration-300 lg:group-hover:brightness-50 lg:hover:brightness-100 lg:hover:min-w-95 lg:hover:shadow-2xl"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
              >
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </motion.div>

          {/* FRECCIA DX */}
          <button
            onClick={() => scroll(searchRef, "right")}
            className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 text-5xl"
          >
            ›
          </button>
        </div>
      )}
    </motion.section>
  );
}