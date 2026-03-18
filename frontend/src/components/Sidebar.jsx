import { useEffect } from "react";
import symbol from "../assets/brand/LogoChiaro.png";
import { useNavigate, useLocation } from "react-router-dom";
import { Phone, Mail, Instagram } from "lucide-react";

/**
 * =========================
 * SIDEBAR (DRAWER MOBILE)
 * =========================
 * Menu laterale mobile con:
 * - overlay scuro
 * - animazione slide-in
 * - navigazione interna (#anchor)
 * - contatti rapidi
 *
 * Props:
 * - isOpen → stato apertura
 * - onClose → funzione chiusura
 * - items → array voci menu { label, href }
 */
export default function Sidebar({ isOpen, onClose, items }) {
  const navigate = useNavigate();
  const location = useLocation();

  /* =========================
     CHIUSURA CON ESC
  ========================= */
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    // attiva listener solo se sidebar aperta
    if (isOpen) window.addEventListener("keydown", onKeyDown);

    // cleanup listener
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  /* =========================
     BLOCCO SCROLL BODY
  ========================= */
  useEffect(() => {
    if (!isOpen) return;

    // salva stato precedente
    const prev = document.body.style.overflow;

    // blocca scroll
    document.body.style.overflow = "hidden";

    // ripristina scroll alla chiusura
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  /* =========================
     NAVIGAZIONE SEZIONI
  ========================= */
  function handleGoTo(href) {
    const id = href.replace("#", "");

    // Se siamo già nella Home → scroll smooth
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      // Altrimenti → redirect con anchor
      navigate(`/#${id}`);
    }

    // chiude sidebar dopo click
    onClose();
  }

  return (
    <>
      {/* =========================
          OVERLAY
      ========================= */}
      <div
        className={[
          "fixed inset-0 z-40 transition-opacity",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        ].join(" ")}
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={onClose} // chiude cliccando fuori
        aria-hidden="true"
      />

      {/* =========================
          DRAWER (SIDEBAR)
      ========================= */}
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
        {/* =========================
            HEADER
        ========================= */}
        <div
          className="flex items-center justify-between border-b px-5 py-4"
          style={{ borderColor: "rgba(240,241,235,0.12)" }}
        >
          {/* LOGO + BRAND */}
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

          {/* BOTTONE CHIUSURA */}
          <button
            onClick={onClose}
            className="rounded-xl border px-3 py-2 text-sm hover:opacity-90 transition"
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

        {/* =========================
            NAV MENU
        ========================= */}
        <nav className="px-3 py-4">
          <ul className="space-y-1">
            {items.map((it) => (
              <li key={it.href}>
                <button
                  onClick={() => handleGoTo(it.href)}
                  className="w-full rounded-xl px-4 py-3 text-left text-sm hover:bg-white/5 transition"
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>

          {/* =========================
              CONTATTI RAPIDI
          ========================= */}
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
                  href="tel:+393663432225"
                  className="flex items-center gap-3 hover:opacity-80 transition"
                >
                  <Phone size={18} />
                  <span>+39 3663432225</span>
                </a>

                {/* INSTAGRAM */}
                <a
                  href="https://instagram.com/biscardi_immobiliare/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:opacity-80 transition"
                >
                  <Instagram size={18} />
                  <span>Biscardi_Immobiliare</span>
                </a>
              </div>

              {/* EMAIL */}
              <a
                href="mailto:biscardimmobiliare@libero.it"
                className="flex items-center gap-3 hover:opacity-80 mt-3 transition"
              >
                <Mail size={18} />
                <span>biscardimmobiliare@libero.it</span>
              </a>

              {/* CTA VALUTAZIONE */}
              <button
                onClick={() => handleGoTo("#valuation")}
                className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-medium hover:opacity-90 transition"
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

        {/* =========================
            FOOTER
        ========================= */}
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
