import { Navigate, Outlet } from "react-router-dom";

/**
 * =========================
 * REQUIRE AUTH (PROTECTED ROUTE)
 * =========================
 * Protegge le rotte admin.
 * 
 * Logica:
 * - controlla presenza token in localStorage
 * - se NON presente → redirect a /admin (login)
 * - se presente → mostra contenuto protetto (Outlet)
 */
export default function RequireAuth() {

  /**
   * Recupero token salvato nel login
   * ⚠️ deve essere la stessa chiave di auth.js
   */
  const token = localStorage.getItem("admin_token");

  /**
   * Se NON autenticato → redirect login
   */
  if (!token) return <Navigate to="/admin" replace />;

  /**
   * Se autenticato → mostra route protetta
   */
  return <Outlet />;
}