import { useEffect } from "react";
import symbol from "../assets/brand/EBi_Colori per sfondo chiaro (trasparente).png";
import { useNavigate, useLocation } from "react-router-dom";
import { Phone, Mail, Instagram } from "lucide-react";

/**
 * Sidebar "drawer" a scomparsa (tema scuro).
 * - isOpen: boolean -> apertura/chiusura
 * - onClose: fn -> chiude sidebar
 * - items: array -> voci menu con label e href (#id)
 */
export default function Sidebar({ isOpen, onClose, items }) {
  const navigate = useNavigate();
  const location = useLocation();
  // Chiudi con ESC
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Blocca scroll body quando la sidebar è aperta
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  function handleGoTo(href) {
    const id = href.replace("#", "");

    // Se siamo già nella Home
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Vai alla Home con anchor
      navigate(`/#${id}`);
    }

    onClose();
  }

  return (
    <>
      {/* OVERLAY */}
      <div
        className={[
          "fixed inset-0 z-40 transition-opacity",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* DRAWER */}
      <aside
        className={[
          "fixed left-0 top-0 z-50 h-dvh w-[80vw] max-w-85",
          "shadow-2xl transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{ backgroundColor: "#282828", color: "#f0f1eb" }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        {/* HEADER */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: "rgba(240,241,235,0.12)" }}
        >
          {/* LOGO + TESTO → clic chiude */}
          <button
            onClick={onClose}
            className="flex items-center gap-3 text-left"
            aria-label="Chiudi menu"
          >
            <div
              className="h-11 w-11 overflow-hidden rounded-2xl p-2"
              style={{ backgroundColor: "rgba(240,241,235,0.06)" }}
            >
              <img
                src={symbol}
                alt="Biscardi Immobiliare"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-wide">
                Biscardi Immobiliare
              </p>
              <p className="text-xs" style={{ color: "#99997b" }}>
                Caserta e provincia
              </p>
            </div>
          </button>

          {/* X CHIUSURA */}
          <button
            onClick={onClose}
            className="rounded-xl border px-3 py-2 text-sm hover:opacity-90"
            style={{
              borderColor: "rgba(240,241,235,0.18)",
              color: "#f0f1eb",
              backgroundColor: "rgba(240,241,235,0.06)",
            }}
            aria-label="Chiudi menu"
          >
            ✕
          </button>
        </div>

        {/* NAV */}
        <nav className="px-3 py-4">
          <ul className="space-y-1">
            {items.map((it) => (
              <li key={it.href}>
                <button
                  onClick={() => handleGoTo(it.href)}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm hover:bg-white/5"
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CONTATTI RAPIDI */}
          <div className="mt-8 px-4">
            <div
              className="rounded-2xl border p-4 shadow-lg shadow-gray-600"

              style={{
                borderColor: "rgba(240,241,235,0.12)",
                backgroundColor: "rgba(240,241,235,0.05)",
              }}
            >
              <p className="text-sm font-semibold">Contatti rapidi</p>

              <div className="mt-4 space-y-3 text-sm">
                {/* TELEFONO */}
                <a
                  href="tel:+393333333333"
                  className="flex items-center gap-3 hover:opacity-80"
                >
                  <Phone size={18} />
                  <span>+39 3663432225</span>
                </a>

                {/* INSTAGRAM */}
                <a
                  href="https://instagram.com/biscardi_immobiliare/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:opacity-80"
                >
                  <Instagram size={18} />
                  <span>Biscardi_Immobiliare</span>
                </a>
              </div>

              {/* EMAIL */}
              <p
                href="mailto:info@emanuelebiscardi.it"
                className="flex items-center gap-3 hover:opacity-80 mt-3"
              >
                <Mail size={18} />
                <span>biscardimmobiliare@libero.it</span>
              </p>

              <button
                onClick={() => handleGoTo("#valuation")}
                className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-medium hover:opacity-90"
                style={{
                  backgroundColor: "#44442c",
                  color: "#f0f1eb",
                }}
              >
                Chiedi valutazione
              </button>
            </div>
          </div>
        </nav>

        {/* FOOTER */}
        <div
          className="absolute bottom-0 left-0 right-0 border-t px-5 py-4 text-xs"
          style={{
            borderColor: "rgba(240,241,235,0.12)",
            color: "rgba(240,241,235,0.6)",
          }}
        >
          © {new Date().getFullYear()} Biscardi Immobiliare
        </div>
      </aside>
    </>
  );
}
