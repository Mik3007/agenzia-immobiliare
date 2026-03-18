import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import PropertyDetail from "./pages/PropertyDetail";
import PropertiesPage from "./pages/PropertiesPage";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPropertyNew from "./pages/AdminPropertyNew";
import AdminPropertyEdit from "./pages/AdminPropertyEdit";
import AdminReviews from "./pages/AdminReviews";

import RequireAuth from "./components/RequireAuth";

/**
 * =========================
 * ROUTING PRINCIPALE APP
 * =========================
 * Gestisce:
 * - rotte pubbliche (sito)
 * - rotte admin (protette)
 */
export default function App() {
  return (
    <Routes>
      {/* ========================= */}
      {/* SITO PUBBLICO */}
      {/* ========================= */}
      {/* Home */}
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />
      {/* Lista immobili */}
      <Route
        path="/immobili"
        element={
          <MainLayout>
            <PropertiesPage />
          </MainLayout>
        }
      />
      {/* Dettaglio immobile */}
      <Route
        path="/immobile/:id"
        element={
          <MainLayout>
            <PropertyDetail />
          </MainLayout>
        }
      />
      {/* ========================= */}
      {/* AREA ADMIN */}
      {/* ========================= */}
      {/* Login admin */}
      <Route path="/admin" element={<AdminLogin />} />
      /** * Rotte protette: * accessibili solo con JWT valido */
      <Route element={<RequireAuth />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />

        {/* CRUD immobili admin */}
        <Route path="/admin/properties/new" element={<AdminPropertyNew />} />
        <Route
          path="/admin/properties/:id/edit"
          element={<AdminPropertyEdit />}
        />
      </Route>
    </Routes>
  );
}
