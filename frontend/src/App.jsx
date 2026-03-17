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

export default function App() {
  return (
    <Routes>

      {/* SITO */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />

      <Route path="/immobili" element={
        <MainLayout>
          <PropertiesPage />
        </MainLayout>
      } />

      <Route path="/immobile/:id" element={
        <MainLayout>
          <PropertyDetail />
        </MainLayout>
      } />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLogin />} />

      <Route element={<RequireAuth />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
      </Route>

      <Route path="/admin/properties/new" element={<AdminPropertyNew />} />
      <Route path="/admin/properties/:id/edit" element={<AdminPropertyEdit />} />

    </Routes>
  );
}