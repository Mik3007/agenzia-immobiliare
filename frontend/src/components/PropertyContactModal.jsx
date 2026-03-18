import { useState } from "react";
import api from "../api/client";

/**
 * =========================
 * PROPERTY CONTACT MODAL
 * =========================
 * Modal per richiedere informazioni su un immobile.
 * 
 * Funzioni:
 * - invio richiesta via API
 * - include dati immobile nel payload
 * - feedback visivo di invio completato
 * - reset automatico form
 */
export default function PropertyContactModal({ open, onClose, property }) {
  
  // stato form controllato
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [sent, setSent] = useState(false);   // stato richiesta inviata
  const [loading, setLoading] = useState(false); // stato loading submit

  // se modal chiuso → non renderizza nulla
  if (!open) return null;

  /**
   * =========================
   * SUBMIT FORM
   * =========================
   * Invia i dati al backend + info immobile
   */
  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      // chiamata API contatto
      await api.post("/api/contact", {
        ...form, // dati utente

        // dati immobile
        propertyTitle: property.title,
        propertyCity: property.city,
        propertyPrice: property.price,

        // url pagina corrente
        propertyUrl: window.location.href,
      });

      // stato successo
      setSent(true);

      // reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      // chiusura automatica dopo 1.2s
      setTimeout(() => {
        setSent(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      alert("Errore invio richiesta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#282828]">
            Richiedi informazioni
          </h2>

          {/* chiusura modal */}
          <button
            onClick={onClose}
            className="text-gray-500 hover:opacity-70"
          >
            ✕
          </button>
        </div>

        {/* =========================
            MESSAGGIO CONFERMA
        ========================= */}
        {sent && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Richiesta inviata ✔
          </div>
        )}

        {/* =========================
            FORM
        ========================= */}
        <form onSubmit={submit} className="space-y-3">

          {/* NOME */}
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Nome e cognome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          {/* EMAIL */}
          <input
            type="email"
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          {/* TELEFONO */}
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Telefono"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          {/* MESSAGGIO */}
          <textarea
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Messaggio"
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#282828] px-4 py-3 text-sm text-white disabled:opacity-60"
          >
            {loading ? "Invio..." : "Invia richiesta"}
          </button>

        </form>
      </div>
    </div>
  );
}