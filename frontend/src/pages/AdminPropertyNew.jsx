import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { isLoggedIn } from "../utils/auth";

const empty = {
  title: "",
  city: "",
  address: "",
  price: "",
  contract: "vendita",
  type: "appartamento",
  rooms: "",
  bathrooms: "",
  areaMq: "",
  description: "",
  images: [],
  featured: false,
};

export default function AdminPropertyNew() {
  const nav = useNavigate();
  const [form, setForm] = useState(empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    if (!isLoggedIn()) nav("/admin");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setNum = (key) => (e) => {
    // manteniamo stringa vuota se l'input è vuoto, così non vedi "0" ovunque
    const v = e.target.value;
    setForm((prev) => ({ ...prev, [key]: v === "" ? "" : Number(v) }));
  };

  async function onUploadImages(files) {
    if (!files?.length) return;

    const fileArray = Array.from(files);

    // creo preview locali
    const localPreviews = fileArray.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews((prev) => [...prev, ...localPreviews]);

    setUploading(true);

    try {
      const fd = new FormData();
      fileArray.forEach((f) => fd.append("images", f));

      const res = await api.post("/api/properties/upload/images", fd);

      const uploadedImages = res.data.images || [];

      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedImages],
      }));

      // ✅ RIMUOVO le preview appena caricate
      setPreviews((prev) => prev.filter((p) => !fileArray.includes(p.file)));
    } finally {
      setUploading(false);
    }
  }

  async function save(e) {
    e.preventDefault();

    // 🚫 BLOCCA se immagini ancora in upload
    if (uploading) {
      alert("Attendi il completamento del caricamento immagini.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price || 0),
        rooms: Number(form.rooms || 0),
        bathrooms: Number(form.bathrooms || 0),
        areaMq: Number(form.areaMq || 0),
      };

      console.log("IMAGES CHE STO SALVANDO:", payload.images); // DEBUG

      await api.post("/api/properties", payload);
      nav("/admin/dashboard");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Nuovo immobile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Compila i campi e salva. Le immagini vengono caricate in locale.
          </p>
        </div>

        <button
          type="button"
          onClick={() => nav("/admin/dashboard")}
          className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
        >
          ← Torna
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={save}
        className="mt-6 grid gap-4 rounded-2xl border bg-white p-6 md:grid-cols-2"
      >
        {/* Titolo */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Titolo annuncio *
          </label>
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Es. Trilocale luminoso con balcone"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        {/* Città */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Città *
          </label>
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Es. Napoli"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            required
          />
        </div>

        {/* Prezzo */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Prezzo (€) *
          </label>
          <input
            type="number"
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Es. 245000"
            value={form.price}
            onChange={setNum("price")}
            required
          />
        </div>

        {/* Indirizzo */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Indirizzo (opzionale)
          </label>
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Es. Via Roma 10"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        {/* Contratto */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Contratto
          </label>
          <select
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={form.contract}
            onChange={(e) => setForm({ ...form, contract: e.target.value })}
          >
            <option value="vendita">Vendita</option>
            <option value="affitto">Affitto</option>
          </select>
        </div>

        {/* Tipologia */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Tipologia
          </label>
          <select
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="appartamento">Appartamento</option>
            <option value="villa">Villa</option>
            <option value="ufficio">Ufficio</option>
            <option value="negozio">Negozio</option>
            <option value="terreno">Terreno</option>
            <option value="altro">Altro</option>
          </select>
        </div>

        {/* Locali */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Locali
          </label>
          <input
            type="number"
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Es. 3"
            value={form.rooms}
            onChange={setNum("rooms")}
          />
        </div>

        {/* Bagni */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Bagni
          </label>
          <input
            type="number"
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Es. 2"
            value={form.bathrooms}
            onChange={setNum("bathrooms")}
          />
        </div>

        {/* Mq */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Superficie (mq)
          </label>
          <input
            type="number"
            className="w-full rounded-xl border px-3 py-2 text-sm"
            placeholder="Es. 95"
            value={form.areaMq}
            onChange={setNum("areaMq")}
          />
        </div>

        {/* Featured */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Metti in evidenza (Home)
          </label>
        </div>

        {/* Descrizione */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Descrizione
          </label>
          <textarea
            className="w-full rounded-xl border px-3 py-2 text-sm"
            rows={6}
            placeholder="Descrivi l’immobile..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Immagini */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Immagini</p>
              <p className="mt-1 text-xs text-gray-500">
                Carica JPG/PNG/WebP. Verranno salvate in locale.
              </p>
            </div>

            <label className="cursor-pointer rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
              {uploading ? "Caricamento…" : "Carica immagini"}
              <input
                type="file"
                className="hidden"
                multiple
                accept="image/*"
                onChange={(e) => onUploadImages(e.target.files)}
              />
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {/* PREVIEW LOCALI */}
            {previews.map((p, i) => (
              <img
                key={i}
                src={p.url}
                alt=""
                className="h-20 w-28 rounded-xl object-cover"
              />
            ))}

            {/* IMMAGINI CLOUDINARY */}
            {(form.images || []).map((img) => (
              <div key={img.public_id} className="relative">
                <img
                  src={img.url}
                  alt=""
                  className="h-20 w-28 rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      images: prev.images.filter(
                        (x) => x.public_id !== img.public_id,
                      ),
                    }))
                  }
                  className="absolute right-1 top-1 rounded-lg bg-white/90 px-2 py-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            disabled={saving || uploading}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving
              ? "Salvataggio…"
              : uploading
                ? "Caricamento immagini…"
                : "Crea immobile"}
          </button>
        </div>
      </form>
    </main>
  );
}
