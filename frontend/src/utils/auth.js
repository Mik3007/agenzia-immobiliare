/**
 * =========================
 * AUTH TOKEN UTILS
 * =========================
 * Gestione token admin tramite localStorage
 */

// chiave usata nel localStorage
const KEY = "admin_token";

/**
 * Salva il token nel localStorage
 * @param {string} token - JWT ricevuto dal backend
 */
export function setToken(token) {
  localStorage.setItem(KEY, token);
}

/**
 * Recupera il token salvato
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem(KEY);
}

/**
 * Rimuove il token (logout)
 */
export function clearToken() {
  localStorage.removeItem(KEY);
}

/**
 * Verifica se l'utente è loggato
 * @returns {boolean}
 */
export function isLoggedIn() {
  return Boolean(getToken());
}