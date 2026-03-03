import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/client";

export default function Contact() {
  const [params] = useSearchParams();
  const propertyId = useMemo(() => params.get("propertyId"), [params]);

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [ok, setOk] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setOk(false);

    await api.post("/api/contact", { ...form, propertyId: propertyId || null });

    setOk(true);
    setForm({ name: "", email: "", phone: "", message: "" });
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Contatti</h1>
      <p className="mt-2 text-sm text-gray-600">
        Qui puoi aggiungere mappa, orari, WhatsApp, ecc.
      </p>

      {ok && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Messaggio inviato! Ti ricontatteremo a breve.
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-3 rounded-2xl border bg-white p-5">
        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Nome e cognome"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Telefono (opzionale)"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <textarea
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Messaggio"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90">
          Invia
        </button>
      </form>
    </main>
  );
}