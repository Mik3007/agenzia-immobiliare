import { useState } from "react";
import api from "../api/client";
import { setToken } from "../utils/auth";

/**
 * =========================
 * ADMIN LOGIN
 * =========================
 * Login area admin:
 * - invio credenziali al backend
 * - salvataggio token
 * - redirect dashboard
 * - gestione errori
 */
export default function AdminLogin() {


  // stati form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // stato errore
  const [err, setErr] = useState("");

  /**
   * =========================
   * SUBMIT LOGIN
   * =========================
   */
  async function submit(e) {
    e.preventDefault();

    // reset errore
    setErr("");

    try {
      // chiamata API login
      const res = await api.post("/api/auth/login", { email, password });

      // salva token
      setToken(res.data.token);

      // 🔥 forza redirect corretto
      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      // gestione messaggio errore (fallback multipli)
      const msg =
        err?.response?.data?.message || // errore backend
        err?.message || // errore generico
        "Login fallito (controlla credenziali).";

      setErr(msg);
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      {/* =========================
          HEADER
      ========================= */}
      <h1 className="text-2xl font-semibold">Admin</h1>
      {/* =========================
          ERRORE
      ========================= */}
      {err && (
        <div className="mt-4 rounded-xl border bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* =========================
          FORM LOGIN
      ========================= */}
      <form
        onSubmit={submit}
        className="mt-6 space-y-3 rounded-2xl border bg-white p-5"
      >
        {/* EMAIL */}
        <input
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          type="password"
          className="w-full rounded-xl border px-3 py-2 text-sm"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* SUBMIT */}
        <button className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:opacity-90">
          Entra
        </button>
      </form>
    </main>
  );
}
