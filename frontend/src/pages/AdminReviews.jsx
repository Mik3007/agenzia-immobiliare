import { useEffect, useState } from "react";
import api from "../api/client";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);

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

  async function approve(id) {
    try {
      await api.patch(`/api/reviews/${id}/approve`);

      // rimuove dalla lista pending
      setReviews((prev) => prev.filter((r) => r._id !== id));

      // aggiorna la lista pubblicate
      const updated = await api.get("/api/reviews/admin/all");
      setAllReviews(updated.data.items || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function reject(id) {
    try {
      await api.patch(`/api/reviews/${id}/reject`);

      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteReview(id) {
    try {
      await api.delete(`/api/reviews/${id}`);

      setAllReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AdminLayout title="Gestione recensioni">
      {/* Pending */}
      {reviews.length === 0 && (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-sm text-gray-500">
            Nessuna nuova recensione da approvare.
          </p>
        </div>
      )}

      <div className="space-y-5">
        {reviews
          .filter((r) => r.status === "pending")
          .map((r) => (
            <div
              key={r._id}
              className="rounded-2xl border bg-white p-6 shadow-sm flex justify-between gap-6"
            >
              <div>
                <p className="font-semibold text-[#282828]">{r.name}</p>
                <p className="text-yellow-500 mt-1">{"⭐".repeat(r.rating)}</p>
                <p className="text-sm mt-3 text-gray-600">{r.text}</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => approve(r._id)}
                  className="rounded-lg bg-green-600 px-4 py-2 text-xs text-white"
                >
                  Approva
                </button>

                <button
                  onClick={() => reject(r._id)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-xs text-white"
                >
                  Rifiuta
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Approved */}
      <h2 className="text-lg font-semibold mt-12 mb-4">
        Recensioni pubblicate
      </h2>

      <div className="space-y-4">
        {allReviews
          .filter((r) => r.status === "approved")
          .map((r) => (
            <div
              key={r._id}
              className="border rounded-xl p-5 flex justify-between"
            >
              <div>
                <p className="font-semibold">{r.name}</p>
                <p className="text-yellow-500">{"⭐".repeat(r.rating)}</p>
                <p className="text-sm text-gray-600 mt-2">{r.text}</p>
              </div>

              <button
                onClick={() => deleteReview(r._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Elimina
              </button>
            </div>
          ))}
      </div>
    </AdminLayout>
  );
}
