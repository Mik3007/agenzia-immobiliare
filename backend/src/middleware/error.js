/**
 * =========================
 * NOT FOUND MIDDLEWARE
 * =========================
 * Viene chiamato quando nessuna route matcha la richiesta
 */
export function notFound(req, res) {
  res.status(404).json({
    message: "Endpoint non trovato",
    path: req.originalUrl, // utile per debug
  });
}

/**
 * =========================
 * ERROR HANDLER GLOBALE
 * =========================
 * Gestisce tutti gli errori dell'applicazione
 */
export function errorHandler(err, req, res, next) {
  /**
   * Log completo lato server (IMPORTANTE per debug)
   */
  console.error("❌ Error:", err);

  /**
   * Se esiste già uno status code impostato (es: 400, 401, ecc.)
   * lo usiamo, altrimenti default 500
   */
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  /**
   * Risposta JSON pulita lato client
   * In produzione NON esponiamo stack completo
   */
  res.status(statusCode).json({
    message: err.message || "Errore server",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack, // visibile solo in dev
    }),
  });
}