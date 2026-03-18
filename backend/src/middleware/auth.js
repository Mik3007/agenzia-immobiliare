import jwt from "jsonwebtoken";

/**
 * =========================
 * AUTH MIDDLEWARE (ADMIN)
 * =========================
 * Protegge le route private
 *
 * Richiede header:
 * Authorization: Bearer <token>
 */
export function requireAuth(req, res, next) {
  /**
   * Recupero header Authorization
   */
  const authHeader = req.headers.authorization || "";

  /**
   * Estrazione token:
   * - formato atteso: "Bearer <token>"
   */
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  /**
   * Se manca token → errore 401
   */
  if (!token) {
    res.status(401);
    throw new Error("Token mancante");
  }

  try {
    /**
     * Verifica token JWT
     */
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * Salviamo i dati utente nella request
     * (disponibili nei controller successivi)
     */
    req.user = payload; // es: { userId, role, email }

    next();
  } catch (err) {
    /**
     * Token non valido o scaduto
     */
    res.status(401);
    throw new Error("Token non valido");
  }
}