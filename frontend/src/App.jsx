import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import AdminPropertyNew from "./pages/AdminPropertyNew";
import AdminPropertyEdit from "./pages/AdminPropertyEdit";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import PropertyDetail from "./pages/PropertyDetail";
import PropertiesPage from "./pages/PropertiesPage";

// metti il path dove stanno davvero questi 2 file
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: "Home", href: "#hero" },
    { label: "In evidenza", href: "#featured" },
    { label: "Mappa", href: "#map" },
    { label: "Chi siamo", href: "#about" },
    { label: "Recensioni", href: "#reviews" },
    { label: "Valutazione casa", href: "#valuation" },
  ];

  return (
    <Routes>
      {/* HOME: identica a prima */}
      <Route
        path="/"
        element={
          <div className="min-h-dvh flex flex-col bg-brand-ivory text-brand-ink">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="fixed left-4 top-4 z-30 rounded-2xl bg-brand-ink/90 px-4 py-3 text-sm font-medium text-brand-ivory shadow-lg hover:bg-brand-ink"
              aria-label="Apri menu"
            >
              ☰ Menu
            </button>

            <Sidebar
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              items={menuItems}
            />

            <div className="flex-1">
              <Home />
            </div>

            <Footer />
          </div>
        }
      />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route element={<RequireAuth />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
      <Route path="/admin/properties/new" element={<AdminPropertyNew />} />
      <Route path="/immobile/:id" element={<PropertyDetail />} />
      <Route path="/immobili" element={<PropertiesPage />} />
      <Route
        path="/admin/properties/:id/edit"
        element={<AdminPropertyEdit />}
      />

      {/* qualsiasi altra rotta torna alla home */}
      <Route
        path="*"
        element={
          <div className="min-h-dvh flex flex-col bg-brand-ivory text-brand-ink">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="fixed left-4 top-4 z-30 rounded-2xl bg-brand-ink/90 px-4 py-3 text-sm font-medium text-brand-ivory shadow-lg hover:bg-brand-ink"
              aria-label="Apri menu"
            >
              ☰ Menu
            </button>

            <Sidebar
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              items={menuItems}
            />

            <div className="flex-1">
              <Home />
            </div>

            <Footer />
          </div>
        }
      />
    </Routes>
  );
}
