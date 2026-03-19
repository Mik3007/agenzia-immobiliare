import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { isLoggedIn } from "../utils/auth";

/**
 * =========================
 * DND KIT IMPORTS
 * =========================
 */
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/**
 * =========================
 * IMMAGINE DRAGGABILE
 * =========================
 */
function SortableImage({ image, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.public_id });

  // stile trasformazione (drag)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative"
    >
      <img
        src={image.url}
        alt=""
        className="h-24 w-32 rounded-xl object-cover"
      />

      {/* rimozione immagine */}
      <button
        type="button"
        onClick={() => onRemove(image)}
        className="absolute right-1 top-1 bg-white/90 text-xs px-2 py-1 rounded"
      >
        ✕
      </button>
    </div>
  );
}

/**
 * =========================
 * ADMIN PROPERTY EDIT
 * =========================
 * Modifica immobile:
 * - update dati
 * - upload immagini
 * - reorder immagini (drag & drop)
 * - delete immagini
 */
export default function AdminPropertyEdit() {
  const { id } = useParams();
  const nav = useNavigate();

  // stato form
  const [form, setForm] = useState(null);

  // stato loading iniziale
  const [loading, setLoading] = useState(true);

  // stato salvataggio
  const [saving, setSaving] = useState(false);

  // stato upload immagini
  const [uploading, setUploading] = useState(false);

  // sensori drag
  const sensors = useSensors(useSensor(PointerSensor));

  /**
   * =========================
   * LOAD IMMOBILE
   * =========================
   */
  useEffect(() => {
    if (!isLoggedIn()) nav("/admin");

    async function load() {
      const res = await api.get(`/api/properties/${id}`);
      setForm(res.data.item);
      setLoading(false);
    }

    load();
  }, [id, nav]);

  /**
   * =========================
   * UPLOAD IMMAGINI
   * =========================
   */
  async function onUploadImages(files) {
    if (!files?.length) return;

    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("images", f));

    setUploading(true);

    const res = await api.post("/api/properties/upload/images", fd);

    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...res.data.images],
    }));

    setUploading(false);
  }

  /**
   * =========================
   * RIMOZIONE IMMAGINE
   * =========================
   */
async function removeImage(image) {
  await api.post("/api/properties/delete-image", {
    public_id: image.public_id,
  });

    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.public_id !== image.public_id),
    }));
  }

  /**
   * =========================
   * DRAG END (RIORDINO)
   * =========================
   */
  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setForm((prev) => {
        const oldIndex = prev.images.findIndex(
          (i) => i.public_id === active.id,
        );

        const newIndex = prev.images.findIndex((i) => i.public_id === over.id);

        return {
          ...prev,
          images: arrayMove(prev.images, oldIndex, newIndex),
        };
      });
    }
  }

  /**
   * =========================
   * SALVATAGGIO
   * =========================
   */
  async function save(e) {
    e.preventDefault();

    setSaving(true);

    await api.put(`/api/properties/${id}`, form);

    nav("/admin/dashboard");
  }

  /**
   * =========================
   * STATI UI
   * =========================
   */
  if (loading) return <div className="p-10">Caricamento…</div>;

  if (!form) return <div className="p-10">Non trovato</div>;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Modifica immobile</h1>

          <p className="mt-2 text-sm text-gray-600">
            Modifica tutti i campi e salva le modifiche.
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

      {/* FORM */}

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
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
            required
          />
        </div>

        {/* Indirizzo */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Indirizzo
          </label>
          <input
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={form.address || ""}
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
            value={form.rooms}
            onChange={(e) =>
              setForm({ ...form, rooms: Number(e.target.value) })
            }
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
            value={form.bathrooms}
            onChange={(e) =>
              setForm({ ...form, bathrooms: Number(e.target.value) })
            }
          />
        </div>

        {/* Superficie */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Superficie (mq)
          </label>
          <input
            type="number"
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={form.areaMq}
            onChange={(e) =>
              setForm({ ...form, areaMq: Number(e.target.value) })
            }
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
            rows={6}
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* IMMAGINI */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Immagini</p>

            <label className="cursor-pointer rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
              {uploading ? "Caricamento…" : "Aggiungi immagini"}
              <input
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={(e) => onUploadImages(e.target.files)}
              />
            </label>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={form.images.map((i) => i.public_id)}
              strategy={rectSortingStrategy}
            >
              <div className="mt-4 flex flex-wrap gap-3">
                {form.images.map((image) => (
                  <SortableImage
                    key={image.public_id}
                    image={image}
                    onRemove={removeImage}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="md:col-span-2">
          <button
            disabled={saving || uploading}
            className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Salvataggio…" : "Salva modifiche"}
          </button>
        </div>
      </form>
    </main>
  );
}
