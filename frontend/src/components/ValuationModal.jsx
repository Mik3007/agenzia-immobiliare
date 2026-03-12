import { useState } from "react";
import api from "../api/client";

export default function ValuationModal({ open, onClose }) {
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    telefono: "",
    email: "",
    city: "",
    address: "",
    type: "",
    sqm: "",
    rooms: "",
    bathrooms: "",
    floor: "",
    condition: "",
    estimatedPrice: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await api.post("/api/valuation", form);

      alert("Richiesta inviata! Ti contatteremo a breve.");

      onClose();
    } catch (err) {
      console.error(err);
      alert("Errore invio richiesta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-[#282828]">
            Valuta la tua casa
          </h3>

          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="space-y-6">
            {/* DATI PROPRIETARIO */}
            <div
              className="border-b pb-8"
              style={{ borderColor: "rgba(40,40,40,0.08)" }}
            >
              <h2 className="text-base font-semibold text-[#282828]">
                Dati proprietario
              </h2>

              <p className="mt-1 text-sm text-[#99997b]">
                Inserisci i tuoi contatti per essere ricontattato.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-[#282828]">
                    Nome
                  </label>

                  <input
                    name="nome"
                    required
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-[#282828]">
                    Cognome
                  </label>

                  <input
                    name="cognome"
                    required
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-[#282828]">
                    Telefono
                  </label>

                  <input
                    name="telefono"
                    required
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-[#282828]">
                    Email
                  </label>

                  <input
                    name="email"
                    type="email"
                    required
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  />
                </div>
              </div>
            </div>

            {/* DATI IMMOBILE */}
            <div
              className="border-b pb-8"
              style={{ borderColor: "rgba(40,40,40,0.08)" }}
            >
              <h2 className="text-base font-semibold text-[#282828]">
                Informazioni immobile
              </h2>

              <p className="text-sm text-[#99997b]">
                Inserisci i dati principali per ricevere una valutazione.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-[#282828]">
                    Città
                  </label>

                  <input
                    name="city"
                    required
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-[#282828]">
                    Indirizzo
                  </label>

                  <input
                    name="address"
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#282828]">
                    Tipologia
                  </label>

                  <select
                    name="type"
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  >
                    <option value="">Seleziona tipologia</option>
                    <option>Appartamento</option>
                    <option>Villa</option>
                    <option>Ufficio</option>
                    <option>Locale commerciale</option>
                    <option>Terreno</option>
                    <option>Altro</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#282828]">
                    Metri quadri
                  </label>

                  <input
                    name="sqm"
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#282828]">
                    Locali
                  </label>

                  <input
                    name="rooms"
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#282828]">
                    Bagni
                  </label>

                  <input
                    name="bathrooms"
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#282828]">
                    Piano
                  </label>

                  <input
                    name="floor"
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-[#282828]">
                    Stato immobile
                  </label>

                  <select
                    name="condition"
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  >
                    <option value="">Seleziona</option>
                    <option>Da ristrutturare</option>
                    <option>Buono stato</option>
                    <option>Ottimo stato</option>
                    <option>Nuova costruzione</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-[#282828]">
                    Quale pensi sia il valore del tuo immobile?
                  </label>

                  <input
                    name="estimatedPrice"
                    onChange={update}
                    placeholder="es. 250000"
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-[#282828]">
                    Note aggiuntive
                  </label>

                  <textarea
                    name="message"
                    rows="4"
                    onChange={update}
                    className="mt-2 w-full rounded-md px-3 py-2 text-sm outline-1"
                    style={{ outlineColor: "rgba(40,40,40,0.12)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-x-4">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium text-[#282828]"
            >
              Annulla
            </button>

            <button
              type="submit"
              className="rounded-xl px-4 py-2 text-sm font-medium"
              style={{ background: "#44442c", color: "#f0f1eb" }}
            >
              {loading ? "Invio..." : "Invia richiesta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
