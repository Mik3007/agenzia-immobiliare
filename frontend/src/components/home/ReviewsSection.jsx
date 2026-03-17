import AddReviewModal from "../AddReviewModal";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function ReviewsSection({
  reviews,
  paginatedReviews,
  page,
  setPage,
  end,
  reviewModalOpen,
  setReviewModalOpen,
  loadReviews,
  formatDate,
}) {
  return (
    <motion.section
      id="reviews"
      className="px-4 py-16 bg-transparent"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* CONTAINER */}
      <div className="mx-auto max-w-6xl bg-[#ecede7] p-20 rounded-4xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-[#282828] text-center md:text-left">
            Dicono di noi
          </h2>

          <button
            onClick={() => setReviewModalOpen(true)}
            className="rounded-xl px-4 py-2 text-sm font-medium bg-[#44442c] text-[#f0f1eb] hover:bg-[#5a5a3a]"
          >
            Aggiungi recensione
          </button>
        </div>

        {/* LISTA */}
        {reviews.length === 0 ? (
          <p className="text-sm text-[#99997b]">Nessuna recensione ancora.</p>
        ) : (
          <motion.div
            key={page + "-" + paginatedReviews.length}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
          >
            {paginatedReviews.map((r) => (
              <motion.div
                key={r._id}
                className="rounded-3xl bg-white p-6 shadow-sm flex flex-col justify-between"
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.98 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.4 }}
              >
                <div>
                  <p className="mb-2 text-sm font-semibold text-[#282828]">
                    {r.name}
                  </p>

                  <p className="text-sm text-[#99997b]">"{r.text}"</p>

                  <div className="text-yellow-500 text-sm mt-2">
                    {"⭐".repeat(r.rating)}
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  {formatDate(r.createdAt)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* PAGINAZIONE */}
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

      {/* MODAL */}
      <AddReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSuccess={loadReviews}
      />
    </motion.section>
  );
}
