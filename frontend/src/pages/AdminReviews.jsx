import { useEffect, useState } from "react";
import api from "../api/client";
import AdminLayout from "../layouts/AdminLayout";

/**
 * =========================
 * ADMIN REVIEWS
 * =========================
 * Gestione recensioni:
 * - approvazione
 * - rifiuto
 * - eliminazione
 *
 * FIX APPLICATI:
 * - sicurezza su reviews undefined
 * - sicurezza su rating (no crash repeat)
 */
export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);

  /**
   * =========================
   * LOAD DATI
   * =========================
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const pendingRes = await api.get("/api/reviews/admin");
        const allRes = await api.get("/api/reviews/admin/all");

        setReviews(pendingRes.data.items || []);
        setAllReviews(allRes.data.items || []);
      } catch (err) {
        console.error("Errore caricamento recensioni:", err);
      }
    };

    loadData();
  }, []);

  /**
   * =========================
   * APPROVA RECENSIONE
   * =========================
   */
  async function approve(id) {
    try {
      await api.patch(`/api/reviews/${id}/approve`);

      // rimuove dalla lista pending
      setReviews((prev) => prev.filter((r) => r._id !== id));

      // aggiorna lista pubblicate
      const updated = await api.get("/api/reviews/admin/all");
      setAllReviews(updated.data.items || []);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * =========================
   * RIFIUTA RECENSIONE
   * =========================
   */
  async function reject(id) {
    try {
      await api.patch(`/api/reviews/${id}/reject`);

      // rimuove dai pending
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * =========================
   * ELIMINA RECENSIONE
   * =========================
   */
  async function deleteReview(id) {
    try {
      await api.delete(`/api/reviews/${id}`);

      // rimuove dalle pubblicate
      setAllReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AdminLayout title="Gestione recensioni">

      {/* =========================
          EMPTY STATE (SAFE)
          evita crash se reviews undefined
      ========================= */}
      {(!reviews || reviews.length === 0) && (
        <div className="rounded-2xl border bg-white p-6 md:p-10 text-center">
          <p className="text-sm text-gray-500">
            Nessuna nuova recensione da approvare.
          </p>
        </div>
      )}

      {/* =========================
          PENDING
      ========================= */}
      <div className="space-y-5">
        {(reviews || [])
          .filter((r) => r.status === "pending")
          .map((r) => (
            <div
              key={r._id}
              className="rounded-2xl border bg-white p-4 md:p-6 shadow-sm flex flex-col md:flex-row md:justify-between gap-4 md:gap-6"
            >
              {/* TESTO */}
              <div className="flex-1">
                <p className="font-semibold text-[#282828]">{r.name}</p>

                {/* FIX: rating sempre numero → evita crash */}
                <p className="text-yellow-500 mt-1">
                  {"⭐".repeat(Number(r.rating) || 0)}
                </p>

                <p className="text-sm mt-3 text-gray-600">{r.text}</p>
              </div>

              {/* AZIONI */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={() => approve(r._id)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-xs text-white w-full sm:w-auto"
                >
                  Approva
                </button>

                <button
                  onClick={() => reject(r._id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-xs text-white w-full sm:w-auto"
                >
                  Rifiuta
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* =========================
          APPROVED
      ========================= */}
      <h2 className="text-lg font-semibold mt-12 mb-4">
        Recensioni pubblicate
      </h2>

      <div className="space-y-4 bg-[#ecede7] p-6 md:p-10 lg:p-20 rounded-3xl">
        {(allReviews || [])
          .filter((r) => r.status === "approved")
          .map((r) => (
            <div
              key={r._id}
              className="border rounded-xl p-5 flex justify-between bg-white hover:bg-amber-100"
            >
              {/* TESTO */}
              <div className="flex-1">
                <p className="font-semibold">{r.name}</p>

                {/* FIX: rating safe */}
                <p className="text-yellow-500">
                  {"⭐".repeat(Number(r.rating) || 0)}
                </p>

                <p className="text-sm text-gray-600 mt-2">{r.text}</p>
              </div>

              {/* DELETE */}
              <div className="flex md:block">
                <button
                  onClick={() => deleteReview(r._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm w-full md:w-auto"
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
      </div>
    </AdminLayout>
  );
}