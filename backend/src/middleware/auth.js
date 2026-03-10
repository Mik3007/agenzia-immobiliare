import jwt from "jsonwebtoken";

/**
 * Middleware per proteggere le route admin.
 * - si aspetta header: Authorization: Bearer <token>
 */
export function requireAuth(req, res, next) {
  console.log("AUTH HEADER:", req.headers.authorization);
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Token mancante" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token non valido" });
  }
}