import { HomeIcon } from "@heroicons/react/24/solid";

/**
 * =========================
 * LOADER
 * =========================
 * Componente semplice per stato di caricamento.
 * 
 * Mostra:
 * - icona casa
 * - animazione pulse
 * 
 * Utilizzo:
 * - fetch dati immobili
 * - attese API
 * - fallback UI
 */
export default function Loader() {
  return (
    <div className="flex justify-center items-center py-20">
      {/* icona con animazione */}
      <HomeIcon className="w-14 h-14 text-[#44442c] animate-pulse" />
    </div>
  );
}