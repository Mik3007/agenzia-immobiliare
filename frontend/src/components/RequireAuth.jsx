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

  // recupero token salvato (login admin)
  const token = localStorage.getItem("token"); 

  // se NON autenticato → redirect
  if (!token) return <Navigate to="/admin" replace />;

  // se autenticato → render figli della route
  return <Outlet />;
}