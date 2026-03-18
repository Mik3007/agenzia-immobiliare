import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

/**
 * =========================
 * LAYOUT PRINCIPALE SITO
 * =========================
 * Gestisce:
 * - Sidebar (menu mobile/overlay)
 * - Bottone apertura menu
 * - Struttura pagina (contenuto + footer)
 */
export default function MainLayout({ children }) {
  /**
   * Stato apertura menu sidebar
   */
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  /**
   * Voci menu (anchor navigation)
   * → puntano alle sezioni della home
   */
  const menuItems = [
    { label: "Home", href: "#hero" },
    { label: "In evidenza", href: "#featured" },
    { label: "Mappa", href: "#map" },
    { label: "Chi sono", href: "#about" },
    { label: "Recensioni", href: "#reviews" },
    { label: "Valutazione casa", href: "#valuation" },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-brand-ivory text-brand-ink">
      {/* ========================= */}
      {/* BUTTON MENU (FIXED) */}
      {/* ========================= */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-2xl bg-brand-ink/90 px-4 py-3 text-sm font-medium text-brand-ivory shadow-lg hover:bg-brand-ink transition"
      >
        ☰ Menu
      </button>

      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}
      <Sidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        items={menuItems}
      />

      {/* ========================= */}
      {/* CONTENUTO PAGINA */}
      {/* ========================= */}
      <main className="flex-1">{children}</main>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}
      <Footer />
    </div>
  );
}
